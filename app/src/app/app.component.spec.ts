import { AppComponent } from './app.component';

import { render } from '@testing-library/angular';
import { CustomerService } from './services/customer.service';

import {
  Component,
  EventEmitter,
  NO_ERRORS_SCHEMA,
  Output,
} from '@angular/core';

describe('AppComponent', () => {
  let service: CustomerService;

  beforeEach(() => {
    service = new CustomerService();

    service.fetch = jest.fn();
  });

  it('should fetch customer on init', async () => {
    await render(AppComponent, {
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: CustomerService,
          useValue: service,
        },
      ],
      componentInputs: {
        fetchOnInit: true,
      },
    });

    expect(service.fetch).toHaveBeenCalledTimes(1);
  });

  it('should not fetch customer on init', async () => {
    await render(AppComponent, {
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: CustomerService,
          useValue: service,
        },
      ],
      componentInputs: {
        fetchOnInit: false,
      },
    });

    expect(service.fetch).not.toHaveBeenCalled();
  });

  it('should submit a value when app-customer-form onSubmit is emitted', async () => {
    const onCustomerFormSubmit = new EventEmitter();

    const consoleSpy = jest.spyOn(console, 'log');

    @Component({
      selector: 'app-customer-form',
      template: '<p>Mock Product Editor Component</p>',
    })
    class MockCustomerFormComponent {
      @Output() onSubmit = onCustomerFormSubmit;
    }

    await render(AppComponent, {
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MockCustomerFormComponent],
      providers: [
        {
          provide: CustomerService,
          useValue: service,
        },
      ],
      componentInputs: {
        fetchOnInit: true,
      },
    });

    onCustomerFormSubmit.emit('test value');

    expect(consoleSpy).toHaveBeenCalledWith(
      'submitted customer form',
      'test value'
    );
  });
});
