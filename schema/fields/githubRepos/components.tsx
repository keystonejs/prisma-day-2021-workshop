/** @jsxRuntime classic */
/** @jsx jsx */

import { FC } from 'react';
import { FieldProps } from '@keystone-6/core/types';
import { jsx } from '@keystone-ui/core';
import { FieldContainer, FieldLabel } from '@keystone-ui/fields';
import { controller } from '@keystone-6/core/fields/types/json/views';

export type Repo = {
  name: string;
  htmlUrl: string;
  description: string;
  homepage: string;
  stargazersCount: number;
  language: string;
};

const Star = () => {
  return (
    <svg
      xmlns="https://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      css={{ width: 16, height: 16, marginLeft: 12, marginRight: 4 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

export type GitHubReposFieldProps = Omit<FieldProps<typeof controller>, 'value'> & {
  value?: Repo[];
};

export const Field: FC<GitHubReposFieldProps> = ({ field, value }) => {
  if (!value) return null;
  const topRepos = value.slice(0, 10);
  const moreRepos = value.length - 10;
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {value.length ? (
        <ul>
          {topRepos.map(repo => {
            const href = repo.homepage || repo.htmlUrl;
            const stars = repo.stargazersCount.toLocaleString();
            return (
              <li key= {repo.name}>
                <div css={{ display: 'flex', alignItems: 'center' }}>
                  <a target="_blank" rel="noreferrer" href={href}>
                    {repo.name}
                  </a>
                  <Star /> <span>{stars}</span>
                </div>
              </li>
            );
          })}
          {moreRepos > 0 ? <li>... and {moreRepos} more</li> : null}
        </ul>
      ) : (
        <div>No Repos.</div>
      )}
    </FieldContainer>
  );
};
