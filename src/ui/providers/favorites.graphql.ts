import gql from 'graphql-tag';

export const GET_CUSTOMER_FAVORITES = gql`
    query GetCustomerFavorites($customerId: ID!, $options: FavoriteListOptions, $productNameFilter: String) {
        customer(id: $customerId) {
            id
            favorites(options: $options, productNameFilter: $productNameFilter) {
                items {
                    id
                    product {
                        id
                        name
                        featuredAsset {
                          id
                          preview
                          focalPoint {
                              x
                              y
                          }
                        }
                    }
                }
                totalItems
            }
        }
    }
`;
