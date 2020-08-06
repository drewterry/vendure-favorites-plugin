/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createTestEnvironment, registerInitializer, SqljsInitializer } from '@vendure/testing';
import path from 'path';

import { FavoritesPlugin } from '../plugin';

import { GET_CUSTOMER_FAVORITES, GET_CUSTOMER, } from './graphql/admin-e2e-definitions.graphql';
import { GET_OWN_FAVORITES, TOGGLE_FAVORITE } from './graphql/shop-e2e-definitions.graphql';
import { GetCustomerFavorites, GetCustomer } from './types/generated-admin-types'
import { TEST_SETUP_TIMEOUT_MS, testConfig } from './config/test-config';
import { initialData } from './config/e2e-initial-data';
import { GetOwnFavorites, ToggleFavorite } from './types/generated-shop-types';

registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__')));

describe('favorites plugin', () => {
    const CUSTOMER_ID = '1'
    const FAVORITE_PRODUCT_ID = '5'

    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        plugins: [FavoritesPlugin],
    });

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'config/e2e-products.csv'),
            customerCount: 1,
            logging: true
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('shop api', () => {
        beforeAll(async () => await setActiveCustomer(CUSTOMER_ID))

        it('returns favorites with customer', async () => {
            const { activeCustomer } = await shopClient.query<
                GetOwnFavorites.Query,
                GetOwnFavorites.Variables
            >(GET_OWN_FAVORITES)        

            expect(activeCustomer?.favorites.items).toHaveLength(0)
        })

        it('can favorite a product', async () => {
            const { toggleFavorite } = await shopClient.query<
                ToggleFavorite.Mutation,
                ToggleFavorite.Variables
            >(TOGGLE_FAVORITE, {
                productId: FAVORITE_PRODUCT_ID
            })

            expect(toggleFavorite.items).toHaveLength(1)
            expect(toggleFavorite.items[0].product?.id).toEqual(`T_${FAVORITE_PRODUCT_ID}`)

            const { activeCustomer } = await shopClient.query<
                GetOwnFavorites.Query,
                GetOwnFavorites.Variables
            >(GET_OWN_FAVORITES)        

            expect(activeCustomer?.favorites.items).toHaveLength(1)
            expect(activeCustomer?.favorites.items[0].product?.id).toEqual(`T_${FAVORITE_PRODUCT_ID}`)
        })

        it('adds a history event for customer favorite', async () => {
            const { customer: { history: { items: history } } } = await adminClient.query<
                GetCustomer.Query,
                GetCustomer.Variables
            >(GET_CUSTOMER, {
                customerId: CUSTOMER_ID
            })

            const favoriteEvent = history.pop()

            expect(favoriteEvent.data.note).toMatch('Customer added')
        })

        it('can unfavorite a product', async () => {
            const { toggleFavorite } = await shopClient.query<
                ToggleFavorite.Mutation,
                ToggleFavorite.Variables
            >(TOGGLE_FAVORITE, {
                productId: FAVORITE_PRODUCT_ID
            })

            expect(toggleFavorite.items).toHaveLength(0)

            const { activeCustomer } = await shopClient.query<
                GetOwnFavorites.Query,
                GetOwnFavorites.Variables
            >(GET_OWN_FAVORITES)        

            expect(activeCustomer?.favorites.items).toHaveLength(0)
        })

        it('adds a history event for customer unfavorite', async () => {
            const { customer: { history: { items: history } } } = await adminClient.query<
                GetCustomer.Query,
                GetCustomer.Variables
            >(GET_CUSTOMER, {
                customerId: CUSTOMER_ID
            })

            const favoriteEvent = history.pop()

            expect(favoriteEvent.data.note).toMatch('Customer removed')
        })
    })

    describe('admin api', () => {
        it('returns favorites with customer', async () => {
            const { customer } = await adminClient.query<
                GetCustomerFavorites.Query,
                GetCustomerFavorites.Variables
            >(GET_CUSTOMER_FAVORITES, {
                customerId: CUSTOMER_ID
            })

        
            expect(customer?.favorites.items).toHaveLength(0)
        })
    })

    async function setActiveCustomer(customerId: string): Promise<void> {
        const { customer } = await adminClient.query<
            GetCustomer.Query,
            GetCustomer.Variables
        >(GET_CUSTOMER, {
            customerId
        })

        if (customer) {
            await shopClient.asUserWithCredentials(customer.emailAddress, 'test')
        }
    }
});
