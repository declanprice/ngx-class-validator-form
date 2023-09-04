import { FormProperties } from "../../makeFormFromProperties";

import { zodToProperties } from "./zodToProperties";

import { z } from "zod";

describe("zodToProperties()", () => {
  const zod = z.object({
    name: z.string().min(5).max(10),
    dateOfBirth: z.string().optional(),
    age: z.number().min(0).max(120),
    isMember: z.boolean().optional(),
    address: z.object({
      addressLine1: z.string(),
    }),
    skills: z.array(z.string()),
    skills2: z.array(z.string().min(5).max(5)),
    paymentMethods: z
      .array(
        z.object({
          sort: z.string().min(6).max(6),
          account: z.number().min(8).max(8),
          ibans: z.array(z.string()),
        })
      )
      .optional(),
  });

  it("should convert complex nested zod Customer object to valid FormProperties object", () => {
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
        required: true,
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

    const properties = zodToProperties(zod);

    expect(properties).toEqual(formProperties);
  });
});
