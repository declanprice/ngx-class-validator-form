import { JoiSchema } from "joi-class-decorators";
import * as Joi from "joi";
import { makeForm } from "./makeForm";
import { FormArray } from "@angular/forms";

describe("makeForm()", () => {
  class Address {
    @JoiSchema(Joi.string().required())
    addressLine1!: string;
  }

  class PaymentMethod {
    @JoiSchema(Joi.string().min(6).max(6).required())
    sort!: string;

    @JoiSchema(Joi.number().min(8).max(8).required())
    account!: number;

    @JoiSchema(Joi.array().items(Joi.number().required()).required())
    ibans!: number[];
  }

  class Customer {
    @JoiSchema(Joi.string().min(5).max(10).required())
    name!: string;

    @JoiSchema(Joi.string().optional())
    dateOfBirth?: string;

    @JoiSchema(Joi.number().min(0).max(120))
    age!: number;

    @JoiSchema(Joi.boolean().required())
    isMember!: boolean;

    @JoiSchema(Address, (schema) => schema.required())
    address!: Address;

    @JoiSchema(Joi.array().required())
    skills!: string[];

    @JoiSchema([PaymentMethod], (arraySchema) => arraySchema.required())
    paymentMethods!: PaymentMethod[];
  }

  it("should convert class into form group", () => {
    const formGroup = makeForm(Customer);
    const name = formGroup.get("name");
    expect(name).toBeTruthy();
    const dateOfBirth = formGroup.get("dateOfBirth");
    expect(dateOfBirth).toBeTruthy();
    const age = formGroup.get("age");
    expect(age).toBeTruthy();
    const isMember = formGroup.get("isMember");
    expect(isMember).toBeTruthy();
    const address = formGroup.get("address");
    expect(address).toBeTruthy();
    const addressLine1 = address!.get("addressLine1");
    expect(addressLine1).toBeTruthy();
    const skills = formGroup.get("skills");
    expect(skills).toBeTruthy();
    const skills2 = formGroup.get("skills2");
    expect(skills2).toBeTruthy();
    expect((skills2 as FormArray).length).not.toBeUndefined();
    const paymentMethods = formGroup.get("paymentMethods");
    expect(paymentMethods).toBeTruthy();
    expect((paymentMethods as FormArray).length).not.toBeUndefined();
  });

  it("should convert class into pre-populated form group", () => {
    const data = {
      name: "Declan",
      dateOfBirth: "1999-04-01",
      age: 22,
      isMember: true,
      address: {
        addressLine1: "address line 1",
      },
      skills: ["1", "2", "3"],
      paymentMethods: [
        {
          sort: "123",
          account: 123,
          ibans: [],
        },
        {
          sort: "123",
          account: 123,
          ibans: [],
        },
      ],
    };

    const formGroup = makeForm(Customer, data);

    expect(formGroup.value).toEqual(data);
  });
});
