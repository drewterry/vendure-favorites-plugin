import { Product, Customer, RequestContext } from '@vendure/core';
import { Connection } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
export declare class FavoriteEntityResolver {
    private connection;
    constructor(connection: Connection);
    product(favorite: Favorite, ctx: RequestContext): Promise<import("@vendure/core/dist/common/types/locale-types").Translated<Product> | undefined>;
    customer(favorite: Favorite, ctx: RequestContext): Promise<Customer>;
}
