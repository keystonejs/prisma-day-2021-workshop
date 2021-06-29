import { InferRenderersForComponentBlocks } from '@keystone-next/fields-document/component-blocks';
import {
  DocumentRenderer as KeystoneDocumentRenderer,
  DocumentRendererProps,
} from '@keystone-next/document-renderer';
import { ComponentProps } from 'react';

// by default the DocumentRenderer will render unstyled html elements
// we're customising how headings are rendered here but you can customise any of the renderers that the DocumentRenderer uses
export const renderers: DocumentRendererProps['renderers'] = {
  block: {
    heading({ level, children, textAlign }) {
      const Comp = `h${level}` as const;
      return (
        <Comp style={{ textAlign, textTransform: 'uppercase' }}>
          {children}
        </Comp>
      );
    },
  },
};

export const componentBlockRenderers: InferRenderersForComponentBlocks<
  typeof import('./components').componentBlocks
> = {
  callout: function Callout({ appearance, content }) {
    return <div>{content}</div>;
  },
  quote: function Quote({ content, name, position }) {
    return <div>{content}</div>;
  },
  poll: function Poll({ poll }) {
    return <pre>{JSON.stringify(poll, null, 2)}</pre>;
  },
};

export function DocumentRenderer({
  document,
}: Pick<ComponentProps<typeof KeystoneDocumentRenderer>, 'document'>) {
  return (
    <KeystoneDocumentRenderer
      document={document}
      renderers={renderers}
      componentBlocks={componentBlockRenderers}
    />
  );
}
