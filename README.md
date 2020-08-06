# Vendure Favorites Plugin

This is a plugin for the [Vendure e-commerce framework](https://www.vendure.io/) designed for allowing customers to save favorite products.

It's two main functions are allowing a customer to toggle a product as a favorite, and return a list of favorites for a customer entity.

## Getting Started

After initializing your vendure project, you can add this plugin via yarn or npm install:

```yarn add vendure-favorites-plugin```

or

```npm install vendure-favorites-plugin```

and then include it in the vendure-config as below:

```typescript
import { FavoritesPlugin } from "vendure-favorites-plugin";

export const config: VendureConfig = {
  ...
  plugins: [
    ...,
    FavoritesPlugin
  ]
}
```

This plugin includes an optional Admin UI Extension.

```ts
AdminUiPlugin.init({
  ...
  app: compileUiExtensions({
    ...
    extensions: [
      ...
      FavoritesPlugin.uiExtensions,
      ...
    ]
  }),
  ...
})
```

## Plugin Options

To configure the plugin, use the init function instead of providing the class in the VendureConfig:

```ts
import { FavoritesPlugin } from "vendure-favorites-plugin";

export const config: VendureConfig = {
  ...
  plugins: [
    ...,
    FavoritesPlugin.init({
      // options
    })
  ]
}
```

Valid options include:

`trackHistory` (default: false): This boolean controls when the customer's favorites are recorded as events in their history.

## API Extensions

This plugin implements the following extensions to the API.

### Favorite Entity

```typescript
type Favorite implements Node {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  product: Product
  customer: Customer!
}
```

### Types

```typescript
type FavoriteList implements PaginatedList {
  items: [Favorite!]!
  totalItems: Int!
}
```

### Customer Query

```typescript
extend type Customer {
  favorites(options: FavoriteListOptions, productNameFilter: String): FavoriteList!
}
```

### Shop API

```typescript
extend type Mutation {
  toggleFavorite(productId: ID!): FavoriteList!
}
```

### Admin API

```typescript
extend type Query {
  favorite(id: ID!): Favorite
}
```

## Admin UI

The Admin UI extension adds a favorites field to the customer detail page, allowing the user to view a list of the customer's favorites.

![hidden-favorites](https://github.com/drewterry/vendure-favorites-plugin/blob/master/docs/hidden-favorites.png?raw=true)

![show-favorites](https://github.com/drewterry/vendure-favorites-plugin/blob/master/docs/show-favorites.png?raw=true)

## Development Server

A development server is configured in the `dev-server` folder, using [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) to spin up a Postgres database, as well as a server and worker.  This is used to test the plugin during development.

To start the server, run:

```bash
yarn run:dev
```

To populate or reset the database, run the following command:

```bash
yarn populate
```

## GraphQL Type Generation

Some types are generated automatically using [`graphql-codegen`]().  To re-generate types after a change, make sure the development server is running, and use the command:

```bash
yarn generate-types
```
