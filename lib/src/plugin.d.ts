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
 *       // options
 *     }),
 *   ]
 * }
 * ```
 */
export declare class FavoritesPlugin {
    static options: PluginInitOptions;
    /**
       * The static `init()` method is a convention used by Vendure plugins which allows options
       * to be configured by the user.
       */
    static init(options: PluginInitOptions): typeof FavoritesPlugin;
}
