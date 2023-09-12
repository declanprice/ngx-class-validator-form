import {
  ControlContainer,
  FormArray,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { fireEvent, render } from '@testing-library/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CustomerPaymentMethodsFieldComponent } from './customer-payment-methods-field.component';
import { CustomerPaymentMethod } from '../../../models/Customer';
import { makeZodForm } from '@declanprice/ngx-make-zod-form';
import userEvent from '@testing-library/user-event';

describe('CustomerPaymentMethodsFieldComponent', () => {
  let paymentMethodsForm: FormArray;
  let paymentMethodsFormDirective: FormGroupDirective;

  beforeEach(() => {
    paymentMethodsForm = new FormArray<FormGroup>([]);

    paymentMethodsFormDirective = new FormGroupDirective([], []);

    paymentMethodsFormDirective.form = paymentMethodsForm as any;
  });

  it('should have payment method heading', async () => {
    const { getByRole } = await render(CustomerPaymentMethodsFieldComponent, {
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
      ],
      providers: [
        { provide: ControlContainer, useValue: paymentMethodsFormDirective },
      ],
    });

    expect(
      getByRole('heading', { name: 'Payment Methods' })
    ).toBeInTheDocument();
  });

  it('should have add payment method button', async () => {
    const { getByRole } = await render(CustomerPaymentMethodsFieldComponent, {
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
      ],
      providers: [
        { provide: ControlContainer, useValue: paymentMethodsFormDirective },
      ],
    });

    expect(getByRole('button', { name: 'Add New' })).toBeInTheDocument();
  });

  it('should have no payment methods', async () => {
    const { queryAllByLabelText } = await render(
      CustomerPaymentMethodsFieldComponent,
      {
        imports: [
          ReactiveFormsModule,
          MatFormFieldModule,
          MatButtonModule,
          MatInputModule,
        ],
        providers: [
          { provide: ControlContainer, useValue: paymentMethodsFormDirective },
        ],
      }
    );

    expect(queryAllByLabelText('Sort').length).toEqual(0);
    expect(queryAllByLabelText('Account').length).toEqual(0);
  });

  it('should have two payment methods', async () => {
    paymentMethodsForm.push(
      makeZodForm(CustomerPaymentMethod, { sort: '123', account: '123' })
    );

    paymentMethodsForm.push(
      makeZodForm(CustomerPaymentMethod, { sort: '321', account: '321' })
    );

    const { queryAllByLabelText } = await render(
      CustomerPaymentMethodsFieldComponent,
      {
        imports: [
          ReactiveFormsModule,
          MatFormFieldModule,
          MatButtonModule,
          MatInputModule,
        ],
        providers: [
          { provide: ControlContainer, useValue: paymentMethodsFormDirective },
        ],
      }
    );

    const sortInputs = queryAllByLabelText('Sort');
    const accountInputs = queryAllByLabelText('Account');

    expect(queryAllByLabelText('Sort').length).toEqual(2);
    expect(queryAllByLabelText('Account').length).toEqual(2);

    expect(sortInputs[0]).toHaveValue('123');
    expect(accountInputs[0]).toHaveValue('123');

    expect(sortInputs[1]).toHaveValue('321');
    expect(accountInputs[1]).toHaveValue('321');
  });

  it('should be able to add a payment method', async () => {
    const { getByRole, queryAllByLabelText } = await render(
      CustomerPaymentMethodsFieldComponent,
      {
        imports: [
          ReactiveFormsModule,
          MatFormFieldModule,
          MatButtonModule,
          MatInputModule,
        ],
        providers: [
          { provide: ControlContainer, useValue: paymentMethodsFormDirective },
        ],
      }
    );

    const addNewButton = getByRole('button', { name: 'Add New' });

    expect(queryAllByLabelText('Sort').length).toEqual(0);

    fireEvent.click(addNewButton);

    expect(queryAllByLabelText('Sort').length).toEqual(1);
  });

  it('should be able to remove a payment method', async () => {
    paymentMethodsForm.push(
      makeZodForm(CustomerPaymentMethod, { sort: '123', account: '123' })
    );

    const { queryAllByRole, queryAllByLabelText } = await render(
      CustomerPaymentMethodsFieldComponent,
      {
        imports: [
          ReactiveFormsModule,
          MatFormFieldModule,
          MatButtonModule,
          MatInputModule,
        ],
        providers: [
          { provide: ControlContainer, useValue: paymentMethodsFormDirective },
        ],
      }
    );

    expect(queryAllByLabelText('Sort').length).toEqual(1);

    const removeButtons = queryAllByRole('button', { name: 'Remove' });

    fireEvent.click(removeButtons[0]);

    expect(queryAllByLabelText('Sort').length).toEqual(0);
  });

  it('should have payment method form fields fields', async () => {
    paymentMethodsForm.push(
      makeZodForm(CustomerPaymentMethod, { sort: '123', account: '123' })
    );

    const { getByLabelText } = await render(
      CustomerPaymentMethodsFieldComponent,
      {
        imports: [
          ReactiveFormsModule,
          MatFormFieldModule,
          MatButtonModule,
          MatInputModule,
        ],
        providers: [
          { provide: ControlContainer, useValue: paymentMethodsFormDirective },
        ],
      }
    );

    const sortInput = getByLabelText('Sort');
    const accountInput = getByLabelText('Account');

    expect(sortInput).toHaveValue('123');
    expect(accountInput).toHaveValue('123');

    fireEvent.change(sortInput, { target: { value: '321' } });
    fireEvent.change(accountInput, { target: { value: '321' } });

    expect(sortInput).toHaveValue('321');
    expect(accountInput).toHaveValue('321');
  });

  it('should have required fields', async () => {
    paymentMethodsForm.push(
      makeZodForm(CustomerPaymentMethod, { sort: '123', account: '123' })
    );

    const { getByLabelText } = await render(
      CustomerPaymentMethodsFieldComponent,
      {
        imports: [
          ReactiveFormsModule,
          MatFormFieldModule,
          MatButtonModule,
          MatInputModule,
        ],
        providers: [
          { provide: ControlContainer, useValue: paymentMethodsFormDirective },
        ],
      }
    );

    const sortInput = getByLabelText('Sort');
    const accountInput = getByLabelText('Account');

    expect(sortInput).toHaveAttribute('required');
    expect(accountInput).toHaveAttribute('required');
  });
});
