import { CustomerAddressFieldComponent } from './customer-address-field.component';
import { fireEvent, render } from '@testing-library/angular';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

describe('CustomerAddressFieldComponent', () => {
  let addressForm: FormGroup;
  let addressFormDirective: FormGroupDirective;

  beforeEach(() => {
    addressForm = new FormGroup({
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      postcode: new FormControl(''),
      city: new FormControl(''),
    });

    addressFormDirective = new FormGroupDirective([], []);

    addressFormDirective.form = addressForm;
  });

  it('should have address heading', async () => {
    const { getByRole } = await render(CustomerAddressFieldComponent, {
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
      ],
      providers: [
        { provide: ControlContainer, useValue: addressFormDirective },
      ],
    });

    expect(getByRole('heading', { name: 'Address' })).toBeInTheDocument();
  });

  it('should have address form fields', async () => {
    const { getByText, getByLabelText } = await render(
      CustomerAddressFieldComponent,
      {
        imports: [
          ReactiveFormsModule,
          MatFormFieldModule,
          MatButtonModule,
          MatInputModule,
        ],
        providers: [
          { provide: ControlContainer, useValue: addressFormDirective },
        ],
      }
    );

    expect(getByLabelText('Address Line 1')).toBeInTheDocument();
    expect(getByLabelText('Address Line 2')).toBeInTheDocument();
    expect(getByLabelText('City')).toBeInTheDocument();
    expect(getByLabelText('Postcode')).toBeInTheDocument();
  });

  it('should have required fields', async () => {
    const { getByText, getByLabelText } = await render(
      CustomerAddressFieldComponent,
      {
        imports: [
          ReactiveFormsModule,
          MatFormFieldModule,
          MatButtonModule,
          MatInputModule,
        ],
        providers: [
          { provide: ControlContainer, useValue: addressFormDirective },
        ],
      }
    );

    const addressLine1Input = getByLabelText('Address Line 1');
    const addressLine2Input = getByLabelText('Address Line 2');
    const cityInput = getByLabelText('City');
    const postcodeInput = getByLabelText('Postcode');

    expect(addressLine1Input).toHaveAttribute('required');
    expect(addressLine2Input).toHaveAttribute('required');
    expect(cityInput).toHaveAttribute('required');
    expect(postcodeInput).toHaveAttribute('required');
  });

  it('should have valid text input fields', async () => {
    const { getByLabelText } = await render(CustomerAddressFieldComponent, {
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
      ],
      providers: [
        { provide: ControlContainer, useValue: addressFormDirective },
      ],
    });

    const addressLine1Input = getByLabelText('Address Line 1');
    const addressLine2Input = getByLabelText('Address Line 2');
    const cityInput = getByLabelText('City');
    const postcodeInput = getByLabelText('Postcode');

    fireEvent.change(addressLine1Input, { target: { value: '1/1' } });
    fireEvent.change(addressLine2Input, { target: { value: '955 Test Road' } });
    fireEvent.change(cityInput, { target: { value: 'Glasgow' } });
    fireEvent.change(postcodeInput, { target: { value: 'G345QW' } });

    expect(addressLine1Input).toHaveValue('1/1');
    expect(addressLine2Input).toHaveValue('955 Test Road');
    expect(cityInput).toHaveValue('Glasgow');
    expect(postcodeInput).toHaveValue('G345QW');
  });
});
