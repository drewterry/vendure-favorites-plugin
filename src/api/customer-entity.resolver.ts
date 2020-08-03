import { Parent, Args, ResolveField, Resolver } from '@nestjs/graphql';
import { ListQueryBuilder, Customer } from '@vendure/core';
import { Favorite } from '../entities/favorite.entity';
import { CustomerFavoritesArgs } from '../generated-shop-types'

@Resolver('Customer')
export class CustomerEntityResolver {
  constructor(
      private listQueryBuilder: ListQueryBuilder
  ) {}

  @ResolveField()
  favorites(@Parent() customer: Customer, @Args() args: CustomerFavoritesArgs) {    
    const sql = this.listQueryBuilder
      .build(Favorite, args.options || undefined, {
        where: {
          customer,
        },
        relations: ['product', 'product.featuredAsset'],
      })
    
    const filter = args.productNameFilter
    if (filter) {
      sql.andWhere('LOWER(favorite__product_translations.name) LIKE :name', { name: `%${filter.toLowerCase().trim()}%` })
    }

    return sql
      .getManyAndCount()
      .then(([items, totalItems]) => ({
        items,
        totalItems,
      }));
  }
}
