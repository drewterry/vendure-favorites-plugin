import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectConnection } from '@nestjs/typeorm';
import {
    Allow,
    Ctx,
    ListQueryBuilder,
    Permission,
    RequestContext,
    Customer,
    ForbiddenError,
    InternalServerError,
    CustomerService,
    ProductService
} from '@vendure/core';
import { Inject } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { HistoryService } from '@vendure/core/dist/service/services/history.service';
import { HistoryEntryType } from '@vendure/common/lib/generated-types';
import { PLUGIN_INIT_OPTIONS } from '../constants';
import { PluginInitOptions } from '../types';

@Resolver()
export class FavoriteShopResolver {
  constructor(
      @InjectConnection() private connection: Connection,
      @Inject(PLUGIN_INIT_OPTIONS) private options: PluginInitOptions,
      private listQueryBuilder: ListQueryBuilder,
      private customerService: CustomerService,
      private productService: ProductService,
      private historyService: HistoryService
  ) {
    console.log(options)
  }

  @Mutation()
  @Allow(Permission.Owner)
  async toggleFavorite(
    @Ctx() ctx: RequestContext,
    @Args() args: any,
  ) {
    const favoriteRepo = this.connection.getRepository(Favorite)
    const customerId = await (await this.getCustomerForOwner(ctx)).id
    const { productId } = args

    const favorite = await favoriteRepo.findOne({
      where: { 
        product: { id: productId }, 
        customer: { id: customerId } 
      },
      relations: ['customer', 'product'],
    })

    if (favorite) {
      await favoriteRepo.remove(favorite)
    } else {
      await favoriteRepo.insert({ 
        customer: { id: customerId }, 
        product: { id: productId }
      })
    }
    
    if (this.options.trackHistory) {

      let productName = favorite?.product.name

      if (!productName) {
        const res = await this.productService.findOne(ctx, productId)
        productName = res?.name
      }

      const note = favorite ? `removed ${productName} from` : `added ${productName} to`
      this.historyService.createHistoryEntryForCustomer({
          ctx,
          customerId,
          type: HistoryEntryType.CUSTOMER_NOTE,
          data: {
              note: `Customer ${note} favorites.`,
          },
        },
        false
      )
    }

    return this.listQueryBuilder
      .build(Favorite, args.options || undefined, {
          relations: ['product'],
          where: { customer: { id: customerId } }
      })
      .getManyAndCount()
      .then(([items, totalItems]) => ({
          items,
          totalItems,
      }));
  }

  /**
   * Returns the Customer entity associated with the current user.
   */
  private async getCustomerForOwner(ctx: RequestContext): Promise<Customer> {
    const userId = ctx.activeUserId;
    if (!userId) {
        throw new ForbiddenError();
    }
    const customer = await this.customerService.findOneByUserId(userId);
    if (!customer) {
        throw new InternalServerError(`error.no-customer-found-for-current-user`);
    }
    return customer;
  }
}
