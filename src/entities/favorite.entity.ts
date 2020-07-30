import { VendureEntity, DeepPartial, Product, Customer } from '@vendure/core';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class Favorite extends VendureEntity {
  constructor(input?: DeepPartial<Favorite>) {
    super(input);
  }

  @ManyToOne(type => Customer)
  customer!: Customer;

  @ManyToOne(type => Product)
  product!: Product;
}