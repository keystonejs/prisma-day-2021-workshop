import { relationship, select, text, timestamp } from '@keystone-next/fields';
import { document } from '@keystone-next/fields-document';
import { list } from '@keystone-next/keystone/schema';

import { permissions, rules } from './access';
import { componentBlocks } from '../schema/fields/content/components';

export const contentListAccess = {
  create: permissions.canManageContent,
  update: permissions.canManageContent,
  delete: permissions.canManageContent,
};

export const contentUIConfig = {
  hideCreate: (context: any) => !permissions.canManageContent(context),
  hideDelete: (context: any) => !permissions.canManageContent(context),
  itemView: {
    defaultFieldMode: (context: any) =>
      permissions.canManageContent(context) ? 'edit' : 'read',
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

function defaultSlug({ context, originalInput }: any) {
  const date = new Date();
  return `${
    originalInput?.title
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
    ...contentListAccess,
    read: rules.canReadContentList,
  },
  ui: contentUIConfig,
  fields: {
    title: text(),
    slug: text({
      defaultValue: defaultSlug,
      ui: { createView: { fieldMode: 'hidden' } },
      isUnique: true,
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
      defaultValue: defaultTimestamp,
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
