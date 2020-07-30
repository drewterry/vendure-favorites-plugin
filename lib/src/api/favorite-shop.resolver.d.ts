import { ListQueryBuilder, RequestContext, CustomerService } from '@vendure/core';
import { Connection } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
export declare class FavoriteShopResolver {
    private connection;
    private listQueryBuilder;
    private customerService;
    constructor(connection: Connection, listQueryBuilder: ListQueryBuilder, customerService: CustomerService);
    toggleFavorite(ctx: RequestContext, args: any): Promise<{
        items: Favorite[];
        totalItems: number;
    }>;
    /**
     * Returns the Customer entity associated with the current user.
     */
    private getCustomerForOwner;
}
