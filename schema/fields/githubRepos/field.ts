// Note: without a personal github access token in your env, the server will be rate limited to 60 requests per hour
// https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token

import { graphql } from '@keystone-next/keystone';
import fetch from 'node-fetch';
import { bad } from '../../../utils/badValues';
import { GithubResolverItemAny } from '../../../wrap_any';

type GithubRepoData = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  forks_count: number;
  fork: boolean;
  private: boolean;
  disabled: boolean;
};

import { makeIO } from '../../../utils/maybeIOPromise';
export const GitHubRepo = graphql.object<GithubRepoData>()({
  name: 'GitHubRepo',
  fields: {
    id: graphql.field({ type: graphql.Int }),
    name: graphql.field({ type: graphql.String }),
    fullName: graphql.field({
      type: graphql.String,
      resolve: val => val.full_name,
    }),
    htmlUrl: graphql.field({
      type: graphql.String,
      resolve: val => val.html_url,
    }),
    description: graphql.field({ type: graphql.String }),
    createdAt: graphql.field({
      type: graphql.String,
      resolve: val => val.created_at,
    }),
    updatedAt: graphql.field({
      type: graphql.String,
      resolve: val => val.updated_at,
    }),
    pushedAt: graphql.field({
      type: graphql.String,
      resolve: val => val.pushed_at,
    }),
    homepage: graphql.field({ type: graphql.String }),
    size: graphql.field({ type: graphql.Int }),
    stargazersCount: graphql.field({
      type: graphql.Int,
      resolve: val => val.stargazers_count,
    }),
    watchersCount: graphql.field({
      type: graphql.Int,
      resolve: val => val.watchers_count,
    }),
    language: graphql.field({ type: graphql.String }),
    forksCount: graphql.field({
      type: graphql.Int,
      resolve: val => val.forks_count,
    }),
  },
});

type UserTableColumns = {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  githubUsername: string;
};

export const githubReposResolver = (item: GithubResolverItemAny) => {
  const utc = item as UserTableColumns;

  if (!utc.githubUsername) return [];

  return makeIO(() =>
    fetch(
      `https://api.github.com/users/${item.githubUsername}/repos?type=public&per_page=100`,
      {
        method: 'GET',
        headers: { Accept: 'application/vnd.github.v3+json' },
      }
    )
      .then(res => Promise.all([res.status, res.json()]))
      .then(([status, jsonData]) =>
        status ? (jsonData as GithubRepoData[]) : bad<GithubRepoData[]>()
      )
  )
    .then(allRepos =>
      allRepos
        .filter(
          (repo: GithubRepoData) =>
            !(repo.fork || repo.private || repo.disabled)
        )
        .sort(
          (a: GithubRepoData, b: GithubRepoData) =>
            b.stargazers_count - a.stargazers_count
        )
    )
    .exec([]);
};
