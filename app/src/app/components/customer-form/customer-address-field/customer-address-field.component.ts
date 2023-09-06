import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-address-field',
  templateUrl: './customer-address-field.component.html',
  styleUrls: ['./customer-address-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerAddressFieldComponent {
  constructor(public controlContainer: ControlContainer) {}

  get addressFormGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }
}
