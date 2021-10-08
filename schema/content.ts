import { relationship, select, text, timestamp } from '@keystone-next/keystone/fields';
import { document } from '@keystone-next/fields-document';
import { list } from '@keystone-next/keystone';

import { permissions, rules } from './access';
import { componentBlocks } from './fields/content/components';

import { ListAccessControl, BaseGeneratedListTypes } from '@keystone-next/keystone/types';



export const contentListAccess : ListAccessControl<BaseGeneratedListTypes> = { 

  operation:
  {
    create: ({ session, context, listKey, operation }) =>  !!permissions.canManageContent(context),
    query: ({ session, context, listKey, operation }) =>  true,
    update: ({ session, context, listKey, operation }) =>  !!permissions.canManageContent(context),
    delete: ({ session, context, listKey, operation }) =>  !!permissions.canManageContent(context)
  }  
  }
  

  /*
  let acc = contentListAccess
  acc!.operation!.query =  ({ session, context, listKey, operation }) => 
    rules.canReadContentList(session)
    
  acc!.filter!.query = ({ session, context, listKey, operation }) => 
  { 
    return { status: { equals: 'published' } }
  }
  operation:
  {
    create: ({ session, context, listKey, operation }) =>  rules.canReadContentList(session)
  },
  */

export const postListAccess  : ListAccessControl<BaseGeneratedListTypes> = { 
  operation:
  {
    create: ({ session, context, listKey, operation }) =>  !!permissions.canManageContent(context),
    query: ({ session, context, listKey, operation }) =>  true,
    update: ({ session, context, listKey, operation }) =>  !!permissions.canManageContent(context),
    delete: ({ session, context, listKey, operation }) =>  !!permissions.canManageContent(context)
  },

}
/*

*/


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
  access: 
    postListAccess,
  ui: contentUIConfig,
  fields: {
    title: text(),
    image_url: text(),
    slug: text({
      defaultValue: defaultSlug,
      ui: { createView: { fieldMode: 'hidden' } },
      isFilterable: true,
      isIndexed: 'unique'
    }),
    status: select({
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      isFilterable: true,
      defaultValue: 'draft',
      ui: { displayMode: 'segmented-control' },
    }),
    publishedDate: timestamp({
      isFilterable: true,
      isOrderable: true,
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
