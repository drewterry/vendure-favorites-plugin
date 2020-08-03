import gql from 'graphql-tag';

export const commonApiExtensions = gql`
  type Favorite implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    product: Product
    customer: Customer!
  }

  type FavoriteList implements PaginatedList {
    items: [Favorite!]!
    totalItems: Int!
  }

  extend type Customer {
    favorites(options: FavoriteListOptions, productNameFilter: String): FavoriteList!
  }

  # Auto-generated at runtime
  input FavoriteListOptions
`;

export const adminApiExtensions = gql`
  ${commonApiExtensions}
  
  extend type Query {
    favorite(id: ID!): Favorite
  }
`;

export const shopApiExtensions = gql`
  ${commonApiExtensions}

  extend type Mutation {
    toggleFavorite(productId: ID!): FavoriteList!
  }
`;