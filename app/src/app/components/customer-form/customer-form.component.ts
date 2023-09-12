import { makeZodForm } from '@declanprice/ngx-make-zod-form';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { FormGroup } from '@angular/forms';

import { Customer, ICustomer } from '../../models/Customer';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerFormComponent implements OnInit {
  @Input() customer?: ICustomer;

  @Output() onSubmit = new EventEmitter<ICustomer>();

  customerForm?: FormGroup;

  ngOnInit() {
    this.customerForm = makeZodForm(Customer, this.customer);
  }
}
