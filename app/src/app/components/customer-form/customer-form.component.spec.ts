import { fireEvent, render } from '@testing-library/angular';
import { CustomerFormComponent } from './customer-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

describe('CustomerFormComponent', () => {
  const customer = {
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
  };

  it('should have a basic info heading', async () => {
    const { getByRole } = await render(CustomerFormComponent, {
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
      ],
    });

    expect(getByRole('heading', { name: 'Basic Info' })).toBeInTheDocument();
  });

  it('should have a submit button', async () => {
    const { getByRole } = await render(CustomerFormComponent, {
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
      ],
    });

    const submitBtn = getByRole('button', { name: 'Submit' });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it('should have basic info form fields', async () => {
    const { getByLabelText } = await render(CustomerFormComponent, {
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
      ],
    });

    const nameInput = getByLabelText('Name');
    const dobInput = getByLabelText('Date Of Birth');

    expect(nameInput).toBeInTheDocument();
    expect(dobInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Bob' } });
    fireEvent.change(dobInput, { target: { value: '1995-06-06' } });

    expect(nameInput).toHaveValue('Bob');
    expect(dobInput).toHaveValue('1995-06-06');
  });

  it('should have basic info required fields', async () => {
    const { getByLabelText } = await render(CustomerFormComponent, {
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
      ],
    });

    const nameInput = getByLabelText('Name');
    const dobInput = getByLabelText('Date Of Birth');

    expect(nameInput).toHaveAttribute('required');
    expect(dobInput).toHaveAttribute('required');
  });

  it('should have an empty customer form', async () => {
    const { getByLabelText } = await render(CustomerFormComponent, {
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
      ],
      componentInputs: {
        customer: undefined,
      },
    });

    const nameInput = getByLabelText('Name');
    const dobInput = getByLabelText('Date Of Birth');

    expect(nameInput).toHaveValue('');
    expect(dobInput).toHaveValue('');
  });

  it('should have a populated customer form', async () => {
    const { getByLabelText } = await render(CustomerFormComponent, {
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
      ],
      componentInputs: {
        customer,
      },
    });

    const nameInput = getByLabelText('Name');
    const dobInput = getByLabelText('Date Of Birth');

    expect(nameInput).toHaveValue(customer.name);
    expect(dobInput).toHaveValue(customer.dateOfBirth);
  });

  it('should not be able to submit an invalid customer form', async () => {
    let submitSpy = jest.fn();

    const { getByRole } = await render(CustomerFormComponent, {
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
      ],
      componentInputs: {
        customer: undefined,
      },
      componentOutputs: {
        onSubmit: {
          emit: submitSpy,
        } as any,
      },
    });

    const submitBtn = getByRole('button', { name: 'Submit' });

    expect(submitBtn).toBeDisabled();

    fireEvent.click(submitBtn);

    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('should submit a valid customer', async () => {
    let submitSpy = jest.fn();

    const { getByRole } = await render(CustomerFormComponent, {
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
      ],
      componentInputs: {
        customer,
      },
      componentOutputs: {
        onSubmit: {
          emit: submitSpy,
        } as any,
      },
    });

    const submitBtn = getByRole('button', { name: 'Submit' });

    expect(submitBtn).toBeEnabled();

    fireEvent.click(submitBtn);

    expect(submitSpy).toHaveBeenCalledTimes(1);
    expect(submitSpy).toHaveBeenCalledWith(customer);
  });
});
