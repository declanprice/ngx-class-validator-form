import * as Joi from "joi";

import { joiToProperties } from "./joiToProperties";

import { FormProperties } from "../../makeFormFromProperties";

describe("joiToProperties()", () => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(10).required(),
    dateOfBirth: Joi.string(),
    age: Joi.number().min(0).max(120).required(),
    isMember: Joi.boolean(),
    address: Joi.object({
      addressLine1: Joi.string().required(),
    }),
    skills: Joi.array().required(),
    skills2: Joi.array()
      .items(Joi.string().min(5).max(5).required())
      .required(),
    paymentMethods: Joi.array().items(
      Joi.object({
        sort: Joi.string().min(6).max(6).required(),
        account: Joi.number().min(8).max(8).required(),
        ibans: Joi.array().items(Joi.number().required()).required(),
      })
    ),
  });

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
        required: true,
      },
      isMember: {
        type: "formControl",
        required: false,
      },
      address: {
        type: "formGroup",
        properties: {
          addressLine1: {
            type: "formControl",
            required: true,
          },
        },
        required: false,
      },
      skills: {
        type: "formArray",
        required: true,
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
        required: false,
      },
    };

    const properties = joiToProperties(schema);

    expect(properties).toEqual(formProperties);
  });
});
