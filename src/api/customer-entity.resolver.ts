import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectConnection } from '@nestjs/typeorm';
import { ListQueryBuilder, Customer } from '@vendure/core';
import { Connection } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';

@Resolver('Customer')
export class CustomerEntityResolver {
  constructor(
      private listQueryBuilder: ListQueryBuilder
  ) {}

  @ResolveField()
  favorites(@Parent() customer: Customer) {
    return this.listQueryBuilder
      .build(Favorite, undefined, {
        where: {
          customer,
        },
        relations: ['product', 'product.featuredAsset'],
      })
      .getManyAndCount()
      .then(([items, totalItems]) => ({
        items,
        totalItems,
      }));
  }
}
