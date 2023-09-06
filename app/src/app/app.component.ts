import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ICustomer } from './models/Customer';

import { CustomerService } from './services/customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(public customerService: CustomerService) {}

  ngOnInit() {
    this.customerService.fetch();
  }

  submit(value: ICustomer) {
    console.log('submitted customer form', value);
  }
}
