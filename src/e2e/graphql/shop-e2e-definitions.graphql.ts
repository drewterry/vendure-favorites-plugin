import gql from 'graphql-tag';

export const GET_OWN_FAVORITES = gql`
    query GetOwnFavorites {
        activeCustomer{
            id
            favorites {
                items {
                    product {
                        id
                    }
                }
            }
        }
    }
`;

export const TOGGLE_FAVORITE = gql`
    mutation ToggleFavorite($productId: ID!) {
        toggleFavorite(productId: $productId) {
            items {
                id
                product {
                    id
                }
            }
        }
    }
`;