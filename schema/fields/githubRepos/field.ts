// Note: without a personal github access token in your env, the server will be rate limited to 60 requests per hour
// https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token

import {graphql as schema } from '@keystone-next/keystone/types';

import fetch from 'node-fetch';

type GitubRepoData = {
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
};

export const GitHubRepo = schema.object<GitubRepoData>()({
  name: 'GitHubRepo',
  fields: {
    id: schema.field({ type: schema.Int }),
    name: schema.field({ type: schema.String }),
    fullName: schema.field({
      type: schema.String,
      resolve: val => val.full_name,
    }),
    htmlUrl: schema.field({
      type: schema.String,
      resolve: val => val.html_url,
    }),
    description: schema.field({ type: schema.String }),
    createdAt: schema.field({
      type: schema.String,
      resolve: val => val.created_at,
    }),
    updatedAt: schema.field({
      type: schema.String,
      resolve: val => val.updated_at,
    }),
    pushedAt: schema.field({
      type: schema.String,
      resolve: val => val.pushed_at,
    }),
    homepage: schema.field({ type: schema.String }),
    size: schema.field({ type: schema.Int }),
    stargazersCount: schema.field({
      type: schema.Int,
      resolve: val => val.stargazers_count,
    }),
    watchersCount: schema.field({
      type: schema.Int,
      resolve: val => val.watchers_count,
    }),
    language: schema.field({ type: schema.String }),
    forksCount: schema.field({
      type: schema.Int,
      resolve: val => val.forks_count,
    }),
  },
});

export async function githubReposResolver(item: any) {
  if (!item.githubUsername) return [];
  try {
    const token = process.env.GITHUB_AUTH_TOKEN;
    const options = token
      ? { headers: { Authorization: `token ${token}` } }
      : undefined;
    const result = await fetch(
      `https://api.github.com/users/${item.githubUsername}/repos?type=public&per_page=100`,
      options
    );
    const allRepos = await result.json();
    return allRepos
      .filter(
        (repo: any) =>
          !(repo.fork || repo.private || repo.disabled || repo.private)
      )
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count);
  } catch (err) {
    console.error(err);
    return [];
  }
}
