import {
  relationship,
  select,
  text,
  timestamp,
} from '@keystone-next/keystone/fields';
import { document } from '@keystone-next/fields-document';
import { list } from '@keystone-next/keystone';

import {
  permissions,
  ItemContext,
  SessionFrame,
  PUBLISHED,
  DRAFT,
  ARCHIVED,
  EDIT,
  READ,
  HIDDEN,
} from './access';
import { componentBlocks } from '../schema/fields/content/components';

import { ItemSession, GraphQLOutput } from '../wrap_any';

//FIXME:
// These anys are causing issues. What is the strong type?
// The deduced type from permissions api is SessionFrame, but that doesn't work ...
// MaybeSessionFunction has something to do with the ts error.

export const contentUIConfig = {
  hideCreate: (session: ItemSession) =>
    !permissions.canManageContentItem(session),
  hideDelete: (session: ItemSession) =>
    !permissions.canManageContentItem(session),
  itemView: {
    defaultFieldMode: (session: ItemContext) =>
      permissions.canManageContentSession(session) ? EDIT : READ,
  },
};

export const contentListAccess = {
  operation: {
    create: permissions.canManageContentList,
    update: permissions.canManageContentList,
    delete: permissions.canManageContentList,
  },
};

export const Label = list({
  access: contentListAccess,
  ui: contentUIConfig,
  fields: {
    name: text(),
    posts: relationship({
      isFilterable: true,
      ref: 'Post.labels',
      many: true,
      ui: {
        displayMode: 'count',
      },
    }),
  },
});

function defaultSlug(inputData: GraphQLOutput) {
  const date = new Date();
  return `${
    inputData?.title
      ?.trim()
      ?.toLowerCase()
      ?.replace(/[^\w ]+/g, '')
      ?.replace(/ +/g, '-') ?? ''
  }-${date?.getFullYear() ?? ''}${date?.getMonth() + 1 ?? ''}${
    date?.getDate() ?? ''
  }`;
}

function defaultTimestamp() {
  return new Date().toISOString();
}

export const Post = list({
  access: {
    operation: {
      create: permissions.canManageContentList,
      update: permissions.canManageContentList,
      delete: permissions.canManageContentList,
    },
    filter: {
      query: (frame: SessionFrame) =>
        permissions.filterCanManageContentList(frame),
    },
  },
  ui: contentUIConfig,
  fields: {
    title: text(),
    slug: text({
      ui: { createView: { fieldMode: HIDDEN } },
      isIndexed: 'unique',
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData, context }) => {
          if (operation === 'create' && !inputData.slug) {
            return defaultSlug({ context, inputData });
          }
          return resolvedData.slug;
        },
      },
    }),
    status: select({
      options: [
        { label: 'Draft', value: DRAFT },
        { label: 'Published', value: PUBLISHED },
        { label: 'Archived', value: ARCHIVED },
      ],
      defaultValue: 'draft',
      ui: { displayMode: 'segmented-control' },
    }),
    publishedDate: timestamp({
      hooks: {
        resolveInput: ({ inputData, operation, resolvedData }) => {
          if (operation === 'create' && !inputData.slug) {
            return defaultTimestamp();
          }
          return resolvedData.slug;
        },
      },
    }),
    author: relationship({ ref: 'User.authoredPosts' }),
    labels: relationship({ ref: 'Label.posts', many: true }),
    intro: document({
      formatting: {
        inlineMarks: true,
        blockTypes: true,
        listTypes: true,
        softBreaks: true,
      },
      links: true,
    }),
    content: document({
      formatting: true,
      links: true,
      dividers: true,
      relationships: {
        poll: {
          listKey: 'Poll',
          kind: 'prop',
          selection: `
            id
            label
            answers {
              id
              label
              voteCount
            }
            userAnswer {
              id
            }`,
        },
      },
      componentBlocks,
      ui: { views: require.resolve('./fields/content/components') },
    }),
  },
});
