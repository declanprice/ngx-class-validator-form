import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlContainer, FormArray, FormGroup } from '@angular/forms';
import { CustomerPaymentMethod } from '../../../models/Customer';
import { makeZodForm } from '@declanprice/ngx-make-zod-form';

@Component({
  selector: 'app-customer-payment-methods-field',
  templateUrl: './customer-payment-methods-field.component.html',
  styleUrls: ['./customer-payment-methods-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerPaymentMethodsFieldComponent {
  constructor(public controlContainer: ControlContainer) {}

  get formArray(): FormArray<FormGroup> {
    return this.controlContainer.control as FormArray<FormGroup>;
  }

  add() {
    this.formArray.push(makeZodForm(CustomerPaymentMethod));
  }

  remove(index: number) {
    this.formArray.removeAt(index);
  }
}
