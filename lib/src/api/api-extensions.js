"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopApiExtensions = exports.adminApiExtensions = exports.commonApiExtensions = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.commonApiExtensions = graphql_tag_1.default `
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
    favorites(options: FavoriteListOptions): FavoriteList!
  }

  # Auto-generated at runtime
  input FavoriteListOptions
`;
exports.adminApiExtensions = graphql_tag_1.default `
  ${exports.commonApiExtensions}
  
  extend type Query {
    favorite(id: ID!): Favorite
  }
`;
exports.shopApiExtensions = graphql_tag_1.default `
  ${exports.commonApiExtensions}

  extend type Mutation {
    toggleFavorite(productId: ID!): FavoriteList!
  }
`;
//# sourceMappingURL=api-extensions.js.map