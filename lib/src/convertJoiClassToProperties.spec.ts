import { JoiSchema } from "joi-class-decorators";

import * as Joi from "joi";

import { convertJoiClassToProperties } from "./convertJoiClassToProperties";

import { FormProperties } from "./makeFormFromProperties";

describe("convertMetadataToProperties()", () => {
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

    @JoiSchema(
      Joi.array().items(Joi.string().min(5).max(5).required()).required()
    )
    skills2!: string[];

    @JoiSchema([PaymentMethod], (arraySchema) => arraySchema.required())
    paymentMethods!: PaymentMethod[];
  }

  it("should convert complex nested Customer metadata to valid FormProperties object", () => {
    const formProperties: FormProperties = {
      name: {
        type: "formControl",
        minLength: 5,
        maxLength: 10,
        required: true,
      },
      dateOfBirth: {
        type: "formControl",
        required: false,
      },
      age: {
        type: "formControl",
        minimum: 0,
        maximum: 120,
        required: false,
      },
      isMember: {
        type: "formControl",
        required: true,
      },
      address: {
        type: "formGroup",
        properties: {
          addressLine1: {
            type: "formControl",
            required: true,
          },
        },
      },
      skills: {
        type: "formArray",
      },
      skills2: {
        type: "formArray",
        minLength: 5,
        maxLength: 5,
        required: true,
      },
      paymentMethods: {
        type: "formArray",
        properties: {
          sort: {
            type: "formControl",
            minLength: 6,
            maxLength: 6,
            required: true,
          },
          account: {
            type: "formControl",
            minimum: 8,
            maximum: 8,
            required: true,
          },
          ibans: {
            type: "formArray",
            required: true,
          },
        },
      },
    };

    const properties = convertJoiClassToProperties(Customer);

    expect(properties).toEqual(formProperties);
  });
});
