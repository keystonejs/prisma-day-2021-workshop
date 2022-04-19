// ts-gql-integrity:169c5b69102699e89abcceafce435f0d
/*
ts-gql-meta-begin
{
  "hash": "dc4887ab09fd5ace5a9c4f170e18437e"
}
ts-gql-meta-end
*/
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type Mutation = {
  readonly __typename: 'Mutation';
  readonly voteForPoll: Maybe<Scalars['Boolean']>;
  readonly clearVoteForPoll: Maybe<Scalars['Boolean']>;
  readonly createPost: Maybe<Post>;
  readonly createPosts: Maybe<ReadonlyArray<Maybe<Post>>>;
  readonly updatePost: Maybe<Post>;
  readonly updatePosts: Maybe<ReadonlyArray<Maybe<Post>>>;
  readonly deletePost: Maybe<Post>;
  readonly deletePosts: Maybe<ReadonlyArray<Maybe<Post>>>;
  readonly createLabel: Maybe<Label>;
  readonly createLabels: Maybe<ReadonlyArray<Maybe<Label>>>;
  readonly updateLabel: Maybe<Label>;
  readonly updateLabels: Maybe<ReadonlyArray<Maybe<Label>>>;
  readonly deleteLabel: Maybe<Label>;
  readonly deleteLabels: Maybe<ReadonlyArray<Maybe<Label>>>;
  readonly createPoll: Maybe<Poll>;
  readonly createPolls: Maybe<ReadonlyArray<Maybe<Poll>>>;
  readonly updatePoll: Maybe<Poll>;
  readonly updatePolls: Maybe<ReadonlyArray<Maybe<Poll>>>;
  readonly deletePoll: Maybe<Poll>;
  readonly deletePolls: Maybe<ReadonlyArray<Maybe<Poll>>>;
  readonly createPollAnswer: Maybe<PollAnswer>;
  readonly createPollAnswers: Maybe<ReadonlyArray<Maybe<PollAnswer>>>;
  readonly updatePollAnswer: Maybe<PollAnswer>;
  readonly updatePollAnswers: Maybe<ReadonlyArray<Maybe<PollAnswer>>>;
  readonly deletePollAnswer: Maybe<PollAnswer>;
  readonly deletePollAnswers: Maybe<ReadonlyArray<Maybe<PollAnswer>>>;
  readonly createUser: Maybe<User>;
  readonly createUsers: Maybe<ReadonlyArray<Maybe<User>>>;
  readonly updateUser: Maybe<User>;
  readonly updateUsers: Maybe<ReadonlyArray<Maybe<User>>>;
  readonly deleteUser: Maybe<User>;
  readonly deleteUsers: Maybe<ReadonlyArray<Maybe<User>>>;
  readonly createRole: Maybe<Role>;
  readonly createRoles: Maybe<ReadonlyArray<Maybe<Role>>>;
  readonly updateRole: Maybe<Role>;
  readonly updateRoles: Maybe<ReadonlyArray<Maybe<Role>>>;
  readonly deleteRole: Maybe<Role>;
  readonly deleteRoles: Maybe<ReadonlyArray<Maybe<Role>>>;
  readonly endSession: Scalars['Boolean'];
  readonly authenticateUserWithPassword: Maybe<UserAuthenticationWithPasswordResult>;
  readonly createInitialUser: UserAuthenticationWithPasswordSuccess;
};


export type MutationvoteForPollArgs = {
  answerId: Scalars['ID'];
};


export type MutationclearVoteForPollArgs = {
  pollId: Scalars['ID'];
};


export type MutationcreatePostArgs = {
  data: PostCreateInput;
};


export type MutationcreatePostsArgs = {
  data: ReadonlyArray<PostCreateInput>;
};


export type MutationupdatePostArgs = {
  where: PostWhereUniqueInput;
  data: PostUpdateInput;
};


export type MutationupdatePostsArgs = {
  data: ReadonlyArray<PostUpdateArgs>;
};


export type MutationdeletePostArgs = {
  where: PostWhereUniqueInput;
};


export type MutationdeletePostsArgs = {
  where: ReadonlyArray<PostWhereUniqueInput>;
};


export type MutationcreateLabelArgs = {
  data: LabelCreateInput;
};


export type MutationcreateLabelsArgs = {
  data: ReadonlyArray<LabelCreateInput>;
};


export type MutationupdateLabelArgs = {
  where: LabelWhereUniqueInput;
  data: LabelUpdateInput;
};


export type MutationupdateLabelsArgs = {
  data: ReadonlyArray<LabelUpdateArgs>;
};


export type MutationdeleteLabelArgs = {
  where: LabelWhereUniqueInput;
};


export type MutationdeleteLabelsArgs = {
  where: ReadonlyArray<LabelWhereUniqueInput>;
};


export type MutationcreatePollArgs = {
  data: PollCreateInput;
};


export type MutationcreatePollsArgs = {
  data: ReadonlyArray<PollCreateInput>;
};


export type MutationupdatePollArgs = {
  where: PollWhereUniqueInput;
  data: PollUpdateInput;
};


export type MutationupdatePollsArgs = {
  data: ReadonlyArray<PollUpdateArgs>;
};


export type MutationdeletePollArgs = {
  where: PollWhereUniqueInput;
};


export type MutationdeletePollsArgs = {
  where: ReadonlyArray<PollWhereUniqueInput>;
};


export type MutationcreatePollAnswerArgs = {
  data: PollAnswerCreateInput;
};


export type MutationcreatePollAnswersArgs = {
  data: ReadonlyArray<PollAnswerCreateInput>;
};


export type MutationupdatePollAnswerArgs = {
  where: PollAnswerWhereUniqueInput;
  data: PollAnswerUpdateInput;
};


export type MutationupdatePollAnswersArgs = {
  data: ReadonlyArray<PollAnswerUpdateArgs>;
};


export type MutationdeletePollAnswerArgs = {
  where: PollAnswerWhereUniqueInput;
};


export type MutationdeletePollAnswersArgs = {
  where: ReadonlyArray<PollAnswerWhereUniqueInput>;
};


export type MutationcreateUserArgs = {
  data: UserCreateInput;
};


export type MutationcreateUsersArgs = {
  data: ReadonlyArray<UserCreateInput>;
};


export type MutationupdateUserArgs = {
  where: UserWhereUniqueInput;
  data: UserUpdateInput;
};


export type MutationupdateUsersArgs = {
  data: ReadonlyArray<UserUpdateArgs>;
};


export type MutationdeleteUserArgs = {
  where: UserWhereUniqueInput;
};


export type MutationdeleteUsersArgs = {
  where: ReadonlyArray<UserWhereUniqueInput>;
};


export type MutationcreateRoleArgs = {
  data: RoleCreateInput;
};


export type MutationcreateRolesArgs = {
  data: ReadonlyArray<RoleCreateInput>;
};


export type MutationupdateRoleArgs = {
  where: RoleWhereUniqueInput;
  data: RoleUpdateInput;
};


export type MutationupdateRolesArgs = {
  data: ReadonlyArray<RoleUpdateArgs>;
};


export type MutationdeleteRoleArgs = {
  where: RoleWhereUniqueInput;
};


export type MutationdeleteRolesArgs = {
  where: ReadonlyArray<RoleWhereUniqueInput>;
};


export type MutationauthenticateUserWithPasswordArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationcreateInitialUserArgs = {
  data: CreateInitialUserInput;
};

export type Post = {
  readonly __typename: 'Post';
  readonly id: Scalars['ID'];
  readonly title: Maybe<Scalars['String']>;
  readonly slug: Maybe<Scalars['String']>;
  readonly status: Maybe<Scalars['String']>;
  readonly publishedDate: Maybe<Scalars['DateTime']>;
  readonly author: Maybe<User>;
  readonly labels: Maybe<ReadonlyArray<Label>>;
  readonly labelsCount: Maybe<Scalars['Int']>;
  readonly intro: Maybe<Post_intro_Document>;
  readonly content: Maybe<Post_content_Document>;
};


export type PostlabelsArgs = {
  where?: LabelWhereInput;
  orderBy?: ReadonlyArray<LabelOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type PostlabelsCountArgs = {
  where?: LabelWhereInput;
};


export type Post_intro_Document = {
  readonly __typename: 'Post_intro_Document';
  readonly document: Scalars['JSON'];
};


export type Post_intro_DocumentdocumentArgs = {
  hydrateRelationships?: Scalars['Boolean'];
};

export type Post_content_Document = {
  readonly __typename: 'Post_content_Document';
  readonly document: Scalars['JSON'];
};


export type Post_content_DocumentdocumentArgs = {
  hydrateRelationships?: Scalars['Boolean'];
};

export type PostWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
  readonly slug?: Maybe<Scalars['String']>;
};

export type PostWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<PostWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<PostWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<PostWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly title?: Maybe<StringFilter>;
  readonly slug?: Maybe<StringFilter>;
  readonly status?: Maybe<StringNullableFilter>;
  readonly publishedDate?: Maybe<DateTimeNullableFilter>;
  readonly author?: Maybe<UserWhereInput>;
  readonly labels?: Maybe<LabelManyRelationFilter>;
};

export type IDFilter = {
  readonly equals?: Maybe<Scalars['ID']>;
  readonly in?: Maybe<ReadonlyArray<Scalars['ID']>>;
  readonly notIn?: Maybe<ReadonlyArray<Scalars['ID']>>;
  readonly lt?: Maybe<Scalars['ID']>;
  readonly lte?: Maybe<Scalars['ID']>;
  readonly gt?: Maybe<Scalars['ID']>;
  readonly gte?: Maybe<Scalars['ID']>;
  readonly not?: Maybe<IDFilter>;
};

export type StringFilter = {
  readonly equals?: Maybe<Scalars['String']>;
  readonly in?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly notIn?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly lt?: Maybe<Scalars['String']>;
  readonly lte?: Maybe<Scalars['String']>;
  readonly gt?: Maybe<Scalars['String']>;
  readonly gte?: Maybe<Scalars['String']>;
  readonly contains?: Maybe<Scalars['String']>;
  readonly startsWith?: Maybe<Scalars['String']>;
  readonly endsWith?: Maybe<Scalars['String']>;
  readonly mode?: Maybe<QueryMode>;
  readonly not?: Maybe<NestedStringFilter>;
};

export type QueryMode =
  | 'default'
  | 'insensitive';

export type NestedStringFilter = {
  readonly equals?: Maybe<Scalars['String']>;
  readonly in?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly notIn?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly lt?: Maybe<Scalars['String']>;
  readonly lte?: Maybe<Scalars['String']>;
  readonly gt?: Maybe<Scalars['String']>;
  readonly gte?: Maybe<Scalars['String']>;
  readonly contains?: Maybe<Scalars['String']>;
  readonly startsWith?: Maybe<Scalars['String']>;
  readonly endsWith?: Maybe<Scalars['String']>;
  readonly not?: Maybe<NestedStringFilter>;
};

export type StringNullableFilter = {
  readonly equals?: Maybe<Scalars['String']>;
  readonly in?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly notIn?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly lt?: Maybe<Scalars['String']>;
  readonly lte?: Maybe<Scalars['String']>;
  readonly gt?: Maybe<Scalars['String']>;
  readonly gte?: Maybe<Scalars['String']>;
  readonly contains?: Maybe<Scalars['String']>;
  readonly startsWith?: Maybe<Scalars['String']>;
  readonly endsWith?: Maybe<Scalars['String']>;
  readonly mode?: Maybe<QueryMode>;
  readonly not?: Maybe<NestedStringNullableFilter>;
};

export type NestedStringNullableFilter = {
  readonly equals?: Maybe<Scalars['String']>;
  readonly in?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly notIn?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly lt?: Maybe<Scalars['String']>;
  readonly lte?: Maybe<Scalars['String']>;
  readonly gt?: Maybe<Scalars['String']>;
  readonly gte?: Maybe<Scalars['String']>;
  readonly contains?: Maybe<Scalars['String']>;
  readonly startsWith?: Maybe<Scalars['String']>;
  readonly endsWith?: Maybe<Scalars['String']>;
  readonly not?: Maybe<NestedStringNullableFilter>;
};

export type DateTimeNullableFilter = {
  readonly equals?: Maybe<Scalars['DateTime']>;
  readonly in?: Maybe<ReadonlyArray<Scalars['DateTime']>>;
  readonly notIn?: Maybe<ReadonlyArray<Scalars['DateTime']>>;
  readonly lt?: Maybe<Scalars['DateTime']>;
  readonly lte?: Maybe<Scalars['DateTime']>;
  readonly gt?: Maybe<Scalars['DateTime']>;
  readonly gte?: Maybe<Scalars['DateTime']>;
  readonly not?: Maybe<DateTimeNullableFilter>;
};

export type LabelManyRelationFilter = {
  readonly every?: Maybe<LabelWhereInput>;
  readonly some?: Maybe<LabelWhereInput>;
  readonly none?: Maybe<LabelWhereInput>;
};

export type PostOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly title?: Maybe<OrderDirection>;
  readonly slug?: Maybe<OrderDirection>;
  readonly status?: Maybe<OrderDirection>;
  readonly publishedDate?: Maybe<OrderDirection>;
};

export type OrderDirection =
  | 'asc'
  | 'desc';

export type PostUpdateInput = {
  readonly title?: Maybe<Scalars['String']>;
  readonly slug?: Maybe<Scalars['String']>;
  readonly status?: Maybe<Scalars['String']>;
  readonly publishedDate?: Maybe<Scalars['DateTime']>;
  readonly author?: Maybe<UserRelateToOneForUpdateInput>;
  readonly labels?: Maybe<LabelRelateToManyForUpdateInput>;
  readonly intro?: Maybe<Scalars['JSON']>;
  readonly content?: Maybe<Scalars['JSON']>;
};

export type UserRelateToOneForUpdateInput = {
  readonly create?: Maybe<UserCreateInput>;
  readonly connect?: Maybe<UserWhereUniqueInput>;
  readonly disconnect?: Maybe<Scalars['Boolean']>;
};

export type LabelRelateToManyForUpdateInput = {
  readonly disconnect?: Maybe<ReadonlyArray<LabelWhereUniqueInput>>;
  readonly set?: Maybe<ReadonlyArray<LabelWhereUniqueInput>>;
  readonly create?: Maybe<ReadonlyArray<LabelCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<LabelWhereUniqueInput>>;
};

export type PostUpdateArgs = {
  readonly where: PostWhereUniqueInput;
  readonly data: PostUpdateInput;
};

export type PostCreateInput = {
  readonly title?: Maybe<Scalars['String']>;
  readonly slug?: Maybe<Scalars['String']>;
  readonly status?: Maybe<Scalars['String']>;
  readonly publishedDate?: Maybe<Scalars['DateTime']>;
  readonly author?: Maybe<UserRelateToOneForCreateInput>;
  readonly labels?: Maybe<LabelRelateToManyForCreateInput>;
  readonly intro?: Maybe<Scalars['JSON']>;
  readonly content?: Maybe<Scalars['JSON']>;
};

export type UserRelateToOneForCreateInput = {
  readonly create?: Maybe<UserCreateInput>;
  readonly connect?: Maybe<UserWhereUniqueInput>;
};

export type LabelRelateToManyForCreateInput = {
  readonly create?: Maybe<ReadonlyArray<LabelCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<LabelWhereUniqueInput>>;
};

export type Label = {
  readonly __typename: 'Label';
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly posts: Maybe<ReadonlyArray<Post>>;
  readonly postsCount: Maybe<Scalars['Int']>;
};


export type LabelpostsArgs = {
  where?: PostWhereInput;
  orderBy?: ReadonlyArray<PostOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type LabelpostsCountArgs = {
  where?: PostWhereInput;
};

export type LabelWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
};

export type LabelWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<LabelWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<LabelWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<LabelWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly name?: Maybe<StringFilter>;
  readonly posts?: Maybe<PostManyRelationFilter>;
};

export type PostManyRelationFilter = {
  readonly every?: Maybe<PostWhereInput>;
  readonly some?: Maybe<PostWhereInput>;
  readonly none?: Maybe<PostWhereInput>;
};

export type LabelOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly name?: Maybe<OrderDirection>;
};

export type LabelUpdateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly posts?: Maybe<PostRelateToManyForUpdateInput>;
};

export type PostRelateToManyForUpdateInput = {
  readonly disconnect?: Maybe<ReadonlyArray<PostWhereUniqueInput>>;
  readonly set?: Maybe<ReadonlyArray<PostWhereUniqueInput>>;
  readonly create?: Maybe<ReadonlyArray<PostCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<PostWhereUniqueInput>>;
};

export type LabelUpdateArgs = {
  readonly where: LabelWhereUniqueInput;
  readonly data: LabelUpdateInput;
};

export type LabelCreateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly posts?: Maybe<PostRelateToManyForCreateInput>;
};

export type PostRelateToManyForCreateInput = {
  readonly create?: Maybe<ReadonlyArray<PostCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<PostWhereUniqueInput>>;
};

export type Poll = {
  readonly __typename: 'Poll';
  readonly id: Scalars['ID'];
  readonly label: Maybe<Scalars['String']>;
  readonly answers: Maybe<ReadonlyArray<PollAnswer>>;
  readonly answersCount: Maybe<Scalars['Int']>;
  readonly responsesCount: Maybe<Scalars['Int']>;
  readonly userAnswer: Maybe<PollAnswer>;
};


export type PollanswersArgs = {
  where?: PollAnswerWhereInput;
  orderBy?: ReadonlyArray<PollAnswerOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type PollanswersCountArgs = {
  where?: PollAnswerWhereInput;
};

export type PollWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
};

export type PollWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<PollWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<PollWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<PollWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly label?: Maybe<StringFilter>;
  readonly answers?: Maybe<PollAnswerManyRelationFilter>;
};

export type PollAnswerManyRelationFilter = {
  readonly every?: Maybe<PollAnswerWhereInput>;
  readonly some?: Maybe<PollAnswerWhereInput>;
  readonly none?: Maybe<PollAnswerWhereInput>;
};

export type PollOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly label?: Maybe<OrderDirection>;
};

export type PollUpdateInput = {
  readonly label?: Maybe<Scalars['String']>;
  readonly answers?: Maybe<PollAnswerRelateToManyForUpdateInput>;
};

export type PollAnswerRelateToManyForUpdateInput = {
  readonly disconnect?: Maybe<ReadonlyArray<PollAnswerWhereUniqueInput>>;
  readonly set?: Maybe<ReadonlyArray<PollAnswerWhereUniqueInput>>;
  readonly create?: Maybe<ReadonlyArray<PollAnswerCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<PollAnswerWhereUniqueInput>>;
};

export type PollUpdateArgs = {
  readonly where: PollWhereUniqueInput;
  readonly data: PollUpdateInput;
};

export type PollCreateInput = {
  readonly label?: Maybe<Scalars['String']>;
  readonly answers?: Maybe<PollAnswerRelateToManyForCreateInput>;
};

export type PollAnswerRelateToManyForCreateInput = {
  readonly create?: Maybe<ReadonlyArray<PollAnswerCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<PollAnswerWhereUniqueInput>>;
};

export type PollAnswer = {
  readonly __typename: 'PollAnswer';
  readonly id: Scalars['ID'];
  readonly label: Maybe<Scalars['String']>;
  readonly poll: Maybe<Poll>;
  readonly voteCount: Maybe<Scalars['Int']>;
  readonly answeredByUsers: Maybe<ReadonlyArray<User>>;
  readonly answeredByUsersCount: Maybe<Scalars['Int']>;
};


export type PollAnsweransweredByUsersArgs = {
  where?: UserWhereInput;
  orderBy?: ReadonlyArray<UserOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type PollAnsweransweredByUsersCountArgs = {
  where?: UserWhereInput;
};

export type PollAnswerWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
};

export type PollAnswerWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<PollAnswerWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<PollAnswerWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<PollAnswerWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly label?: Maybe<StringFilter>;
  readonly poll?: Maybe<PollWhereInput>;
  readonly answeredByUsers?: Maybe<UserManyRelationFilter>;
};

export type UserManyRelationFilter = {
  readonly every?: Maybe<UserWhereInput>;
  readonly some?: Maybe<UserWhereInput>;
  readonly none?: Maybe<UserWhereInput>;
};

export type PollAnswerOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly label?: Maybe<OrderDirection>;
};

export type PollAnswerUpdateInput = {
  readonly label?: Maybe<Scalars['String']>;
  readonly poll?: Maybe<PollRelateToOneForUpdateInput>;
  readonly answeredByUsers?: Maybe<UserRelateToManyForUpdateInput>;
};

export type PollRelateToOneForUpdateInput = {
  readonly create?: Maybe<PollCreateInput>;
  readonly connect?: Maybe<PollWhereUniqueInput>;
  readonly disconnect?: Maybe<Scalars['Boolean']>;
};

export type UserRelateToManyForUpdateInput = {
  readonly disconnect?: Maybe<ReadonlyArray<UserWhereUniqueInput>>;
  readonly set?: Maybe<ReadonlyArray<UserWhereUniqueInput>>;
  readonly create?: Maybe<ReadonlyArray<UserCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<UserWhereUniqueInput>>;
};

export type PollAnswerUpdateArgs = {
  readonly where: PollAnswerWhereUniqueInput;
  readonly data: PollAnswerUpdateInput;
};

export type PollAnswerCreateInput = {
  readonly label?: Maybe<Scalars['String']>;
  readonly poll?: Maybe<PollRelateToOneForCreateInput>;
  readonly answeredByUsers?: Maybe<UserRelateToManyForCreateInput>;
};

export type PollRelateToOneForCreateInput = {
  readonly create?: Maybe<PollCreateInput>;
  readonly connect?: Maybe<PollWhereUniqueInput>;
};

export type UserRelateToManyForCreateInput = {
  readonly create?: Maybe<ReadonlyArray<UserCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<UserWhereUniqueInput>>;
};

export type User = {
  readonly __typename: 'User';
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly email: Maybe<Scalars['String']>;
  readonly password: Maybe<PasswordState>;
  readonly role: Maybe<Role>;
  readonly githubUsername: Maybe<Scalars['String']>;
  readonly githubRepos: ReadonlyArray<Maybe<GitHubRepo>>;
  readonly authoredPosts: Maybe<ReadonlyArray<Post>>;
  readonly authoredPostsCount: Maybe<Scalars['Int']>;
  readonly pollAnswers: Maybe<ReadonlyArray<PollAnswer>>;
  readonly pollAnswersCount: Maybe<Scalars['Int']>;
};


export type UserauthoredPostsArgs = {
  where?: PostWhereInput;
  orderBy?: ReadonlyArray<PostOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type UserauthoredPostsCountArgs = {
  where?: PostWhereInput;
};


export type UserpollAnswersArgs = {
  where?: PollAnswerWhereInput;
  orderBy?: ReadonlyArray<PollAnswerOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type UserpollAnswersCountArgs = {
  where?: PollAnswerWhereInput;
};

export type PasswordState = {
  readonly __typename: 'PasswordState';
  readonly isSet: Scalars['Boolean'];
};

export type GitHubRepo = {
  readonly __typename: 'GitHubRepo';
  readonly id: Maybe<Scalars['Int']>;
  readonly name: Maybe<Scalars['String']>;
  readonly fullName: Maybe<Scalars['String']>;
  readonly htmlUrl: Maybe<Scalars['String']>;
  readonly description: Maybe<Scalars['String']>;
  readonly createdAt: Maybe<Scalars['String']>;
  readonly updatedAt: Maybe<Scalars['String']>;
  readonly pushedAt: Maybe<Scalars['String']>;
  readonly homepage: Maybe<Scalars['String']>;
  readonly size: Maybe<Scalars['Int']>;
  readonly stargazersCount: Maybe<Scalars['Int']>;
  readonly watchersCount: Maybe<Scalars['Int']>;
  readonly language: Maybe<Scalars['String']>;
  readonly forksCount: Maybe<Scalars['Int']>;
};

export type UserWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
  readonly email?: Maybe<Scalars['String']>;
};

export type UserWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<UserWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<UserWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<UserWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly name?: Maybe<StringFilter>;
  readonly email?: Maybe<StringFilter>;
  readonly password?: Maybe<PasswordFilter>;
  readonly role?: Maybe<RoleWhereInput>;
  readonly githubUsername?: Maybe<StringFilter>;
  readonly authoredPosts?: Maybe<PostManyRelationFilter>;
  readonly pollAnswers?: Maybe<PollAnswerManyRelationFilter>;
};

export type PasswordFilter = {
  readonly isSet: Scalars['Boolean'];
};

export type UserOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly name?: Maybe<OrderDirection>;
  readonly email?: Maybe<OrderDirection>;
  readonly githubUsername?: Maybe<OrderDirection>;
};

export type UserUpdateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly email?: Maybe<Scalars['String']>;
  readonly password?: Maybe<Scalars['String']>;
  readonly role?: Maybe<RoleRelateToOneForUpdateInput>;
  readonly githubUsername?: Maybe<Scalars['String']>;
  readonly authoredPosts?: Maybe<PostRelateToManyForUpdateInput>;
  readonly pollAnswers?: Maybe<PollAnswerRelateToManyForUpdateInput>;
};

export type RoleRelateToOneForUpdateInput = {
  readonly create?: Maybe<RoleCreateInput>;
  readonly connect?: Maybe<RoleWhereUniqueInput>;
  readonly disconnect?: Maybe<Scalars['Boolean']>;
};

export type UserUpdateArgs = {
  readonly where: UserWhereUniqueInput;
  readonly data: UserUpdateInput;
};

export type UserCreateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly email?: Maybe<Scalars['String']>;
  readonly password?: Maybe<Scalars['String']>;
  readonly role?: Maybe<RoleRelateToOneForCreateInput>;
  readonly githubUsername?: Maybe<Scalars['String']>;
  readonly authoredPosts?: Maybe<PostRelateToManyForCreateInput>;
  readonly pollAnswers?: Maybe<PollAnswerRelateToManyForCreateInput>;
};

export type RoleRelateToOneForCreateInput = {
  readonly create?: Maybe<RoleCreateInput>;
  readonly connect?: Maybe<RoleWhereUniqueInput>;
};

export type Role = {
  readonly __typename: 'Role';
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly canManageContent: Maybe<Scalars['Boolean']>;
  readonly canManageUsers: Maybe<Scalars['Boolean']>;
  readonly users: Maybe<ReadonlyArray<User>>;
  readonly usersCount: Maybe<Scalars['Int']>;
};


export type RoleusersArgs = {
  where?: UserWhereInput;
  orderBy?: ReadonlyArray<UserOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type RoleusersCountArgs = {
  where?: UserWhereInput;
};

export type RoleWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
};

export type RoleWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<RoleWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<RoleWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<RoleWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly name?: Maybe<StringFilter>;
  readonly canManageContent?: Maybe<BooleanFilter>;
  readonly canManageUsers?: Maybe<BooleanFilter>;
  readonly users?: Maybe<UserManyRelationFilter>;
};

export type BooleanFilter = {
  readonly equals?: Maybe<Scalars['Boolean']>;
  readonly not?: Maybe<BooleanFilter>;
};

export type RoleOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly name?: Maybe<OrderDirection>;
  readonly canManageContent?: Maybe<OrderDirection>;
  readonly canManageUsers?: Maybe<OrderDirection>;
};

export type RoleUpdateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly canManageContent?: Maybe<Scalars['Boolean']>;
  readonly canManageUsers?: Maybe<Scalars['Boolean']>;
  readonly users?: Maybe<UserRelateToManyForUpdateInput>;
};

export type RoleUpdateArgs = {
  readonly where: RoleWhereUniqueInput;
  readonly data: RoleUpdateInput;
};

export type RoleCreateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly canManageContent?: Maybe<Scalars['Boolean']>;
  readonly canManageUsers?: Maybe<Scalars['Boolean']>;
  readonly users?: Maybe<UserRelateToManyForCreateInput>;
};


export type UserAuthenticationWithPasswordResult = UserAuthenticationWithPasswordSuccess | UserAuthenticationWithPasswordFailure;

export type UserAuthenticationWithPasswordSuccess = {
  readonly __typename: 'UserAuthenticationWithPasswordSuccess';
  readonly sessionToken: Scalars['String'];
  readonly item: User;
};

export type UserAuthenticationWithPasswordFailure = {
  readonly __typename: 'UserAuthenticationWithPasswordFailure';
  readonly message: Scalars['String'];
};

export type CreateInitialUserInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly email?: Maybe<Scalars['String']>;
  readonly password?: Maybe<Scalars['String']>;
};

export type Query = {
  readonly __typename: 'Query';
  readonly posts: Maybe<ReadonlyArray<Post>>;
  readonly post: Maybe<Post>;
  readonly postsCount: Maybe<Scalars['Int']>;
  readonly labels: Maybe<ReadonlyArray<Label>>;
  readonly label: Maybe<Label>;
  readonly labelsCount: Maybe<Scalars['Int']>;
  readonly polls: Maybe<ReadonlyArray<Poll>>;
  readonly poll: Maybe<Poll>;
  readonly pollsCount: Maybe<Scalars['Int']>;
  readonly pollAnswers: Maybe<ReadonlyArray<PollAnswer>>;
  readonly pollAnswer: Maybe<PollAnswer>;
  readonly pollAnswersCount: Maybe<Scalars['Int']>;
  readonly users: Maybe<ReadonlyArray<User>>;
  readonly user: Maybe<User>;
  readonly usersCount: Maybe<Scalars['Int']>;
  readonly roles: Maybe<ReadonlyArray<Role>>;
  readonly role: Maybe<Role>;
  readonly rolesCount: Maybe<Scalars['Int']>;
  readonly keystone: KeystoneMeta;
  readonly authenticatedItem: Maybe<AuthenticatedItem>;
};


export type QuerypostsArgs = {
  where?: PostWhereInput;
  orderBy?: ReadonlyArray<PostOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QuerypostArgs = {
  where: PostWhereUniqueInput;
};


export type QuerypostsCountArgs = {
  where?: PostWhereInput;
};


export type QuerylabelsArgs = {
  where?: LabelWhereInput;
  orderBy?: ReadonlyArray<LabelOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QuerylabelArgs = {
  where: LabelWhereUniqueInput;
};


export type QuerylabelsCountArgs = {
  where?: LabelWhereInput;
};


export type QuerypollsArgs = {
  where?: PollWhereInput;
  orderBy?: ReadonlyArray<PollOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QuerypollArgs = {
  where: PollWhereUniqueInput;
};


export type QuerypollsCountArgs = {
  where?: PollWhereInput;
};


export type QuerypollAnswersArgs = {
  where?: PollAnswerWhereInput;
  orderBy?: ReadonlyArray<PollAnswerOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QuerypollAnswerArgs = {
  where: PollAnswerWhereUniqueInput;
};


export type QuerypollAnswersCountArgs = {
  where?: PollAnswerWhereInput;
};


export type QueryusersArgs = {
  where?: UserWhereInput;
  orderBy?: ReadonlyArray<UserOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QueryuserArgs = {
  where: UserWhereUniqueInput;
};


export type QueryusersCountArgs = {
  where?: UserWhereInput;
};


export type QueryrolesArgs = {
  where?: RoleWhereInput;
  orderBy?: ReadonlyArray<RoleOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QueryroleArgs = {
  where: RoleWhereUniqueInput;
};


export type QueryrolesCountArgs = {
  where?: RoleWhereInput;
};

export type AuthenticatedItem = User;

export type KeystoneMeta = {
  readonly __typename: 'KeystoneMeta';
  readonly adminMeta: KeystoneAdminMeta;
};

export type KeystoneAdminMeta = {
  readonly __typename: 'KeystoneAdminMeta';
  readonly enableSignout: Scalars['Boolean'];
  readonly enableSessionItem: Scalars['Boolean'];
  readonly lists: ReadonlyArray<KeystoneAdminUIListMeta>;
  readonly list: Maybe<KeystoneAdminUIListMeta>;
};


export type KeystoneAdminMetalistArgs = {
  key: Scalars['String'];
};

export type KeystoneAdminUIListMeta = {
  readonly __typename: 'KeystoneAdminUIListMeta';
  readonly key: Scalars['String'];
  readonly itemQueryName: Scalars['String'];
  readonly listQueryName: Scalars['String'];
  readonly hideCreate: Scalars['Boolean'];
  readonly hideDelete: Scalars['Boolean'];
  readonly path: Scalars['String'];
  readonly label: Scalars['String'];
  readonly singular: Scalars['String'];
  readonly plural: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly initialColumns: ReadonlyArray<Scalars['String']>;
  readonly pageSize: Scalars['Int'];
  readonly labelField: Scalars['String'];
  readonly fields: ReadonlyArray<KeystoneAdminUIFieldMeta>;
  readonly initialSort: Maybe<KeystoneAdminUISort>;
  readonly isHidden: Scalars['Boolean'];
};

export type KeystoneAdminUIFieldMeta = {
  readonly __typename: 'KeystoneAdminUIFieldMeta';
  readonly path: Scalars['String'];
  readonly label: Scalars['String'];
  readonly isOrderable: Scalars['Boolean'];
  readonly isFilterable: Scalars['Boolean'];
  readonly fieldMeta: Maybe<Scalars['JSON']>;
  readonly viewsIndex: Scalars['Int'];
  readonly customViewsIndex: Maybe<Scalars['Int']>;
  readonly createView: KeystoneAdminUIFieldMetaCreateView;
  readonly listView: KeystoneAdminUIFieldMetaListView;
  readonly itemView: Maybe<KeystoneAdminUIFieldMetaItemView>;
  readonly search: Maybe<QueryMode>;
};


export type KeystoneAdminUIFieldMetaitemViewArgs = {
  id: Maybe<Scalars['ID']>;
};

export type KeystoneAdminUIFieldMetaCreateView = {
  readonly __typename: 'KeystoneAdminUIFieldMetaCreateView';
  readonly fieldMode: KeystoneAdminUIFieldMetaCreateViewFieldMode;
};

export type KeystoneAdminUIFieldMetaCreateViewFieldMode =
  | 'edit'
  | 'hidden';

export type KeystoneAdminUIFieldMetaListView = {
  readonly __typename: 'KeystoneAdminUIFieldMetaListView';
  readonly fieldMode: KeystoneAdminUIFieldMetaListViewFieldMode;
};

export type KeystoneAdminUIFieldMetaListViewFieldMode =
  | 'read'
  | 'hidden';

export type KeystoneAdminUIFieldMetaItemView = {
  readonly __typename: 'KeystoneAdminUIFieldMetaItemView';
  readonly fieldMode: Maybe<KeystoneAdminUIFieldMetaItemViewFieldMode>;
};

export type KeystoneAdminUIFieldMetaItemViewFieldMode =
  | 'edit'
  | 'read'
  | 'hidden';

export type KeystoneAdminUISort = {
  readonly __typename: 'KeystoneAdminUISort';
  readonly field: Scalars['String'];
  readonly direction: KeystoneAdminUISortDirection;
};

export type KeystoneAdminUISortDirection =
  | 'ASC'
  | 'DESC';

export interface TSGQLDocuments extends Record<string, import('@ts-gql/tag').TypedDocumentNode<import('@ts-gql/tag').BaseDocumentTypes>> {}

export type TSGQLRequiredFragments<T> = (providedFragments: T) => T;