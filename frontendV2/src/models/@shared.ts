import { QueryKey, UseQueryOptions } from '@tanstack/react-query';

// internals
export type AccessToken = string;
export type RefreshToken = string;
export type Nickname = string;

// externals
export type GithubAuthCode = string;
export type GithubUniqueUserId = number;
export type GithubNickname = string;
export type GithubProfileURL = URLString;

// libs
export type CustomQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  'queryKey' | 'queryFn' | 'select'
>;
