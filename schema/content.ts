import { relationship, select, text, timestamp } from '@keystone-next/keystone/fields';
import { document } from '@keystone-next/fields-document';
import { list } from '@keystone-next/keystone';

import { permissions, rules, SessionFrame, ItemContext } from './access';
import { componentBlocks } from '../schema/fields/content/components';

export const contentListAccess = {
  filter: {
    create:  ({ session, context, listKey, operation } : SessionFrame) => permissions.canManageContent(session),
    update: ({ session, context, listKey, operation } : SessionFrame) => permissions.canManageContent(session),
    delete: ({ session, context, listKey, operation } : SessionFrame) => permissions.canManageContent(session),
  }
};

export const contentUIConfig = {
  hideCreate: (session: any) => !permissions.canManageContent(session),
  hideDelete: (session: any) => !permissions.canManageContent(session),
  itemView: {
    defaultFieldMode: (session: ItemContext) =>
      permissions.canManageContent(session) ? 'edit' : 'read',
  },
};

export const Label = list({
  access: contentListAccess,
  ui: contentUIConfig,
  fields: {
    name: text(),
    posts: relationship({
      ref: 'Post.labels',
      many: true,
      ui: {
        displayMode: 'count',
      },
    }),
  },
});

function defaultSlug({ context, inputData }: any) {
  const date = new Date();
  return `${inputData?.title
    ?.trim()
    ?.toLowerCase()
    ?.replace(/[^\w ]+/g, '')
    ?.replace(/ +/g, '-') ?? ''
    }-${date?.getFullYear() ?? ''}${date?.getMonth() + 1 ?? ''}${date?.getDate() ?? ''
    }`;
}

function defaultTimestamp() {
  return new Date().toISOString();
}

export const Post = list({
  access: {
    operation: {
      query:({ session, context, listKey, operation } : SessionFrame) =>  rules.canReadContentList(context),
    },
    filter: {
      ...contentListAccess.filter,
      
      query:({ session, context, listKey, operation } : SessionFrame) => rules.filterCanReadContentList(session),
    },
  },
  ui: contentUIConfig,
  fields: {
    title: text(),
    slug: text({
      ui: { createView: { fieldMode: 'hidden' } },
      isIndexed: 'unique',
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData, context }) => {
          if (operation === 'create' && !inputData.slug) {
            return defaultSlug({ context, inputData });
          }
          return resolvedData.slug;
        }
      }
    }),
    status: select({
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
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
        }
      }
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
