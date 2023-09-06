import { z } from 'zod';

export interface ICustomerAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
}

export interface ICustomerPaymentMethod {
  sort: string;
  account: string;
}

export interface ICustomer {
  name: string;
  dateOfBirth: string;
  address: ICustomerAddress;
  paymentMethods: ICustomerPaymentMethod[];
}

export const CustomerAddress = z.object({
  addressLine1: z.string(),
  addressLine2: z.string(),
  city: z.string(),
  postcode: z.string(),
});

export const CustomerPaymentMethod = z.object({
  sort: z.string(),
  account: z.string(),
});

export const Customer = z.object({
  name: z.string().min(2).max(20),
  dateOfBirth: z.string(),
  address: CustomerAddress,
  paymentMethods: z.array(CustomerPaymentMethod),
});
