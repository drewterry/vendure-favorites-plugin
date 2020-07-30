import { VendureEntity, DeepPartial, Product, Customer } from '@vendure/core';
export declare class Favorite extends VendureEntity {
    constructor(input?: DeepPartial<Favorite>);
    customer: Customer;
    product: Product;
}
