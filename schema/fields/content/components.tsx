/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx, useTheme } from '@keystone-ui/core';
import { InfoIcon } from '@keystone-ui/icons/icons/InfoIcon';
import { AlertTriangleIcon } from '@keystone-ui/icons/icons/AlertTriangleIcon';
import { AlertOctagonIcon } from '@keystone-ui/icons/icons/AlertOctagonIcon';
import { CheckCircleIcon } from '@keystone-ui/icons/icons/CheckCircleIcon';
import { Trash2Icon } from '@keystone-ui/icons/icons/Trash2Icon';
import { Tooltip } from '@keystone-ui/tooltip';
import {
  component,
  fields,
  NotEditable,
} from '@keystone-next/fields-document/component-blocks';
import {
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from '@keystone-next/fields-document/primitives';

const appearances = {
  info: {
    icon: InfoIcon,
    backgroundColor: '#E0F2FE',
    borderColor: '#38BDF8',
    foregroundColor: '#0C4A6E',
  },
  error: {
    icon: AlertOctagonIcon,
    backgroundColor: '#FFE4E6',
    borderColor: '#FB7185',
    foregroundColor: '#881337',
  },
  warning: {
    icon: AlertTriangleIcon,
    backgroundColor: '#FEF3C7',
    borderColor: '#FBBF24',
    foregroundColor: '#78350F',
  },
  success: {
    icon: CheckCircleIcon,
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
    foregroundColor: '#064E3B',
  },
} as const;

export const componentBlocks = {
  callout: component({
    component: function Callout({ content, appearance }) {
      const { palette, radii, spacing } = useTheme();
      const intentConfig = appearances[appearance.value];

      return (
        <div
          css={{
            borderRadius: radii.small,
            display: 'flex',
            paddingLeft: spacing.medium,
            paddingRight: spacing.medium,
          }}
          style={{
            background: intentConfig.backgroundColor,
          }}
        >
          <NotEditable>
            <div
              css={{
                color: intentConfig.foregroundColor,
                marginRight: spacing.small,
                marginTop: '1em',
              }}
            >
              <intentConfig.icon />
            </div>
          </NotEditable>
          <div css={{ flex: 1 }}>{content}</div>
        </div>
      );
    },
    label: 'Notice',
    chromeless: true,
    props: {
      appearance: fields.select({
        label: 'Appearance',
        options: [
          { value: 'info', label: 'Info' },
          { value: 'error', label: 'Error' },
          { value: 'warning', label: 'Warning' },
          { value: 'success', label: 'Success' },
        ] as const,
        defaultValue: 'info',
      }),
      content: fields.child({
        kind: 'block',
        placeholder: '',
        formatting: 'inherit',
        dividers: 'inherit',
        links: 'inherit',
      }),
    },
    toolbar({ props, onRemove }) {
      return (
        <ToolbarGroup>
          {props.appearance.options.map(opt => {
            const Icon = appearances[opt.value].icon;

            return (
              <Tooltip key={opt.value} content={opt.label} weight="subtle">
                {attrs => (
                  <ToolbarButton
                    isSelected={props.appearance.value === opt.value}
                    onClick={() => {
                      props.appearance.onChange(opt.value);
                    }}
                    {...attrs}
                  >
                    <Icon size="small" />
                  </ToolbarButton>
                )}
              </Tooltip>
            );
          })}

          <ToolbarSeparator />

          <Tooltip content="Remove" weight="subtle">
            {attrs => (
              <ToolbarButton
                variant="destructive"
                onClick={onRemove}
                {...attrs}
              >
                <Trash2Icon size="small" />
              </ToolbarButton>
            )}
          </Tooltip>
        </ToolbarGroup>
      );
    },
  }),
  quote: component({
    component: ({ content, name, position }) => {
      return (
        <div css={{}}>
          <div css={{ fontStyle: 'italic' }}>{content}</div>
          <div css={{ fontWeight: 'bold', color: '#4A5568', marginTop: 4 }}>
            {name}
          </div>
          <div css={{ color: '#718096', marginTop: 4 }}>{position}</div>
        </div>
      );
    },
    label: 'Quote',
    props: {
      content: fields.child({
        kind: 'block',
        placeholder: 'Quote...',
        formatting: { inlineMarks: 'inherit', softBreaks: 'inherit' },
        links: 'inherit',
      }),
      name: fields.child({
        kind: 'inline',
        placeholder: 'Name...',
      }),
      position: fields.child({
        kind: 'inline',
        placeholder: 'Description...',
      }),
      image: fields.text({ label: 'Profile Photo URL' }),
      href: fields.text({ label: 'Profile Link URL' }),
    },
  }),
  poll: component({
    component: ({ poll }) => {
      if (!poll.value) return <NotEditable>No Poll Selected</NotEditable>;
      return (
        <NotEditable>
          <h2>{poll.value.label}</h2>
          <ul>
            {poll.value.data.answers.map((answer: any) => {
              return (
                <li>
                  {answer.label} ({answer.voteCount} answers)
                </li>
              );
            })}
          </ul>
        </NotEditable>
      );
    },
    label: 'Poll',
    props: {
      poll: fields.relationship<'one'>({
        label: 'Poll',
        relationship: 'poll',
      }),
    },
  }),
};
