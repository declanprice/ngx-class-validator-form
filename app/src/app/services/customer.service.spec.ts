import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(() => {
    service = new CustomerService();
  });

  it('should start with an undefined customer', () => {
    expect(service.customer()).toBeUndefined();
  });

  it('should fetch customer', () => {
    expect(service.customer()).toBeUndefined();

    service.fetch();

    expect(service.customer()).toEqual({
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
  });
});
