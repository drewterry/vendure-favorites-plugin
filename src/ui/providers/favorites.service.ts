import { Injectable } from '@angular/core';
import { DataService } from '@vendure/admin-ui/core';
import { GET_CUSTOMER_FAVORITES } from './favorites.graphql';
import { GetCustomerFavorites } from '../generated-types'

@Injectable()
export class FavoritesService {
    constructor(private dataService: DataService) {}

    getFavoritesList(customerId: string, take: number = 10, skip: number = 0, filterTerm?: string)  {
        return this.dataService.query<
            GetCustomerFavorites.Query, 
            GetCustomerFavorites.Variables
        >(
            GET_CUSTOMER_FAVORITES,
            {
                customerId,
                options: {
                    take,
                    skip,
                },
                productNameFilter: filterTerm
            },
        );
    }
}