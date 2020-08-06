import { VendurePlugin, PluginCommonModule, LanguageCode } from '@vendure/core';
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import path from 'path';

import { Favorite } from './entities/favorite.entity'
import { adminApiExtensions } from './api/api-extensions';
import { shopApiExtensions } from './api/api-extensions';
import { CustomerEntityResolver } from './api/customer-entity.resolver';
import { FavoriteEntityResolver } from './api/favorite-entity.resolver';
import { FavoriteShopResolver } from './api/favorite-shop.resolver';
import { PLUGIN_INIT_OPTIONS } from './constants'
import { PluginInitOptions } from './types';

/**
 * A Vendure plugin to give customers the ability to favorite products.
 *
 * @example
 * ```TypeScript
 * export const config: VendureConfig = {
 *   //...
 *   plugins: [
 *     FavoritesPlugin.init({
 *       trackHistory: true
 *     }),
 *   ]
 * }
 * ```
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [Favorite],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [CustomerEntityResolver, FavoriteEntityResolver],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [CustomerEntityResolver, FavoriteEntityResolver, FavoriteShopResolver],
  },
  providers: [
    // By definiting the `PLUGIN_INIT_OPTIONS` symbol as a provider, we can then inject the
    // user-defined options into other classes, such as the {@link ExampleService}.
    { provide: PLUGIN_INIT_OPTIONS, useFactory: () => FavoritesPlugin.options },
  ],
  configuration: config => {
    config.customFields.Customer.push({
      type: 'boolean',
      name: 'favorites',
      label: [
        {
          languageCode: LanguageCode.en,
          value: 'Favorites'
        }
      ],
      public: false,
    });
    return config;
  }
})
export class FavoritesPlugin {
  static options: PluginInitOptions = {
    trackHistory: false
  };
  
  /**
   * The static `init()` method is a convention used by Vendure plugins which allows options
   * to be configured by the user.
   */
  static init(options: PluginInitOptions) {
    this.options = options;
    return FavoritesPlugin;
  }
  
  
  static uiExtensions: AdminUiExtension = {
    translations: {
      en: path.join(__dirname, 'ui/translations/en.json'),
      pt_BR: path.join(__dirname, 'ui/translations/pt_BR.json'),
    },
    extensionPath: path.join(__dirname, 'ui'),
    ngModules: [
      {
        type: 'shared' as const,
        ngModuleFileName: 'favorites-ui-extension.module.ts',
        ngModuleName: 'FavoritesUiExtensionModule',
      }
    ],
  };
}
