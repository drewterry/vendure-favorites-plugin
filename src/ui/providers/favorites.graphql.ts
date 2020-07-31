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
