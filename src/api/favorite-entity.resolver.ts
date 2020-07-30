import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectConnection } from '@nestjs/typeorm';
import { Ctx, Product, Customer, RequestContext, translateDeep } from '@vendure/core';
import { Connection } from 'typeorm';

import { Favorite } from '../entities/favorite.entity';

@Resolver('Favorite')
export class FavoriteEntityResolver {
    constructor(@InjectConnection() private connection: Connection) {}

    @ResolveField()
    async product(@Parent() favorite: Favorite, @Ctx() ctx: RequestContext) {
        let product: Product | null = favorite.product;
        if (!product) {
            const favoriteWithProduct = await this.connection.getRepository(Favorite).findOne(favorite.id, {
                relations: ['product'],
            });
            if (favoriteWithProduct) {
                product = favoriteWithProduct.product;
            }
        }
        if (product) {
            return translateDeep(product, ctx.languageCode);
        }
    }

    @ResolveField()
    async customer(@Parent() favorite: Favorite, @Ctx() ctx: RequestContext) {
        let customer: Customer | null = favorite.customer;
        if (!customer) {
            const favoriteWithCustomer = await this.connection
                .getRepository(Favorite)
                .findOne(favorite.id, {
                    relations: ['customer'],
                });
            if (favoriteWithCustomer) {
                customer = favoriteWithCustomer.customer;
            }
        }
        return customer
    }
}
