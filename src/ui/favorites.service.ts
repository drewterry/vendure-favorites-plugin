import { Injectable } from '@angular/core';
import { DataService } from '@vendure/admin-ui/core';
import gql from 'graphql-tag';

export const GET_CUSTOMER_FAVORITES = gql`
    query GetCustomerFavorites($customerId: ID!) {
        customer(id: $customerId) {
            id
            favorites {
                items {
                    id
                    product {
                        id
                    }
                }
            }
        }
    }
`;

@Injectable()
export class FavoritesService {
    constructor(private dataService: DataService) {}

    getFavoritesList(customerId: string, take: number = 10, skip: number = 0, filterTerm?: string)  {
        const filter = filterTerm
            ? {
                    filter: {
                        emailAddress: {
                            contains: filterTerm,
                        },
                    },
                }
            : {};
        return this.dataService.query<
            GetFavoritesList.Query, 
            GetFavoritesList.Variables
        >(
            GET_FAVORITES_LIST,
            {
                options: {
                    take,
                    skip,
                    ...filter,
                },
            },
        );

        // return this.dataService
        //     .query<GetProductName.Query, GetProductName.Variables>(GET_PRODUCT_NAME, {
        //         id: route.paramMap.get('id') || '',
        //     })
        //     .mapSingle(data => data.product);
    }
}