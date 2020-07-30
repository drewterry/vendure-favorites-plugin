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

export const GET_CUSTOMER = gql`
    query GetCustomer($customerId: ID!) {
        customer(id: $customerId) {
            id
            emailAddress
        }
    }
`;
