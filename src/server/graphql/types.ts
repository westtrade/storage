import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type CredentialsInput = {
  login: Scalars['String'],
  password: Scalars['String'],
};

export type Mutation = {
   __typename?: 'Mutation',
  signIn: User,
  signUp: User,
  createStorage: Storage,
  editStorage: Storage,
  deleteStorage: Scalars['Boolean'],
  createProduct: Product,
  editProduct: Product,
  deleteProduct?: Maybe<Scalars['Boolean']>,
  moveProducts: Array<Maybe<Storage>>,
};


export type MutationSignInArgs = {
  credentials: CredentialsInput
};


export type MutationSignUpArgs = {
  credentials: CredentialsInput
};


export type MutationCreateStorageArgs = {
  storage: StorageInput
};


export type MutationEditStorageArgs = {
  id: Scalars['ID'],
  storage: StorageInput
};


export type MutationDeleteStorageArgs = {
  id: Scalars['ID']
};


export type MutationCreateProductArgs = {
  product: ProductInput
};


export type MutationEditProductArgs = {
  id: Scalars['ID'],
  product: ProductInput
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']
};


export type MutationMoveProductsArgs = {
  transfer: TransferOperationInput
};

export type PageInfo = {
   __typename?: 'PageInfo',
  limit: Scalars['Int'],
  total: Scalars['Int'],
  offset: Scalars['Int'],
};

export type PagerInput = {
  offset?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
};

export type Product = {
   __typename?: 'Product',
  id: Scalars['ID'],
  storages: Array<Maybe<ProductStorage>>,
  name: Scalars['String'],
  quantity?: Maybe<Scalars['Int']>,
  total: Scalars['Int'],
  used: Scalars['Int'],
  owner: User,
};

export type ProductInput = {
  id?: Maybe<Scalars['String']>,
  name: Scalars['String'],
  quantity?: Maybe<Scalars['Int']>,
  total?: Maybe<Scalars['Int']>,
};

export type Products = {
   __typename?: 'Products',
  list: Array<Maybe<Product>>,
  pageInfo: PageInfo,
};

export type ProductStorage = {
   __typename?: 'ProductStorage',
  storage: Storage,
  quantity: Scalars['Int'],
};

export type Query = {
   __typename?: 'Query',
  me: User,
  storages: Storages,
  products: Products,
};


export type QueryStoragesArgs = {
  pager?: Maybe<PagerInput>
};


export type QueryProductsArgs = {
  pager?: Maybe<PagerInput>
};

export type Storage = {
   __typename?: 'Storage',
  id: Scalars['ID'],
  name: Scalars['String'],
  products: Products,
  owner: User,
};

export type StorageInput = {
  name: Scalars['String'],
  products?: Maybe<Array<ProductInput>>,
};

export type Storages = {
   __typename?: 'Storages',
  list: Array<Maybe<Storage>>,
  pageInfo: PageInfo,
};

export type TransferOperationInput = {
  from: Scalars['ID'],
  to?: Maybe<Scalars['ID']>,
  product: Scalars['ID'],
  quantity: Scalars['Int'],
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  token?: Maybe<Scalars['String']>,
  login: Scalars['String'],
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  User: ResolverTypeWrapper<User>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  PagerInput: PagerInput,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Storages: ResolverTypeWrapper<Storages>,
  Storage: ResolverTypeWrapper<Storage>,
  Products: ResolverTypeWrapper<Products>,
  Product: ResolverTypeWrapper<Product>,
  ProductStorage: ResolverTypeWrapper<ProductStorage>,
  PageInfo: ResolverTypeWrapper<PageInfo>,
  Mutation: ResolverTypeWrapper<{}>,
  CredentialsInput: CredentialsInput,
  StorageInput: StorageInput,
  ProductInput: ProductInput,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  TransferOperationInput: TransferOperationInput,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  User: User,
  ID: Scalars['ID'],
  String: Scalars['String'],
  PagerInput: PagerInput,
  Int: Scalars['Int'],
  Storages: Storages,
  Storage: Storage,
  Products: Products,
  Product: Product,
  ProductStorage: ProductStorage,
  PageInfo: PageInfo,
  Mutation: {},
  CredentialsInput: CredentialsInput,
  StorageInput: StorageInput,
  ProductInput: ProductInput,
  Boolean: Scalars['Boolean'],
  TransferOperationInput: TransferOperationInput,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  signIn?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSignInArgs, 'credentials'>>,
  signUp?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'credentials'>>,
  createStorage?: Resolver<ResolversTypes['Storage'], ParentType, ContextType, RequireFields<MutationCreateStorageArgs, 'storage'>>,
  editStorage?: Resolver<ResolversTypes['Storage'], ParentType, ContextType, RequireFields<MutationEditStorageArgs, 'id' | 'storage'>>,
  deleteStorage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteStorageArgs, 'id'>>,
  createProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'product'>>,
  editProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationEditProductArgs, 'id' | 'product'>>,
  deleteProduct?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'id'>>,
  moveProducts?: Resolver<Array<Maybe<ResolversTypes['Storage']>>, ParentType, ContextType, RequireFields<MutationMoveProductsArgs, 'transfer'>>,
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  storages?: Resolver<Array<Maybe<ResolversTypes['ProductStorage']>>, ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  used?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
};

export type ProductsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Products'] = ResolversParentTypes['Products']> = {
  list?: Resolver<Array<Maybe<ResolversTypes['Product']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
};

export type ProductStorageResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductStorage'] = ResolversParentTypes['ProductStorage']> = {
  storage?: Resolver<ResolversTypes['Storage'], ParentType, ContextType>,
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  storages?: Resolver<ResolversTypes['Storages'], ParentType, ContextType, QueryStoragesArgs>,
  products?: Resolver<ResolversTypes['Products'], ParentType, ContextType, QueryProductsArgs>,
};

export type StorageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Storage'] = ResolversParentTypes['Storage']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  products?: Resolver<ResolversTypes['Products'], ParentType, ContextType>,
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
};

export type StoragesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Storages'] = ResolversParentTypes['Storages']> = {
  list?: Resolver<Array<Maybe<ResolversTypes['Storage']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  login?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>,
  PageInfo?: PageInfoResolvers<ContextType>,
  Product?: ProductResolvers<ContextType>,
  Products?: ProductsResolvers<ContextType>,
  ProductStorage?: ProductStorageResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Storage?: StorageResolvers<ContextType>,
  Storages?: StoragesResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
