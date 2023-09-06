import { Injectable, signal, WritableSignal } from '@angular/core';

import { ICustomer } from '../models/Customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  customer: WritableSignal<ICustomer | undefined> = signal(undefined);

  fetch() {
    this.customer.set({
      name: 'Declan',
      dateOfBirth: '1999-02-09',
      address: {
        addressLine1: '2/3',
        addressLine2: '111 Form Street',
        postcode: 'G232SD',
        city: 'Glasgow',
      },
      paymentMethods: [
        {
          account: '123',
          sort: '123',
        },
        {
          account: '321',
          sort: '321',
        },
      ],
    });
  }
}
