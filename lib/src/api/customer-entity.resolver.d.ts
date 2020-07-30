import { ListQueryBuilder, Customer } from '@vendure/core';
import { Favorite } from '../entities/favorite.entity';
export declare class CustomerEntityResolver {
    private listQueryBuilder;
    constructor(listQueryBuilder: ListQueryBuilder);
    favorites(customer: Customer): Promise<{
        items: Favorite[];
        totalItems: number;
    }>;
}
