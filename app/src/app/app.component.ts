import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { ICustomer } from './models/Customer';

import { CustomerService } from './services/customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @Input() fetchOnInit: boolean = true;

  constructor(public customerService: CustomerService) {}

  ngOnInit() {
    if (this.fetchOnInit) {
      this.customerService.fetch();
    }
  }

  submit(value: ICustomer) {
    console.log('submitted customer form', value);
  }
}
