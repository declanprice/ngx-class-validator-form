import { makeZodForm } from "./makeForm";
import { FormArray } from "@angular/forms";
import { z } from "zod";

import * as makeFormFromProperties from "../src/makeFormFromProperties";

describe("makeZodForm()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const schema = z.object({
    name: z.string().min(5).max(10),
    dateOfBirth: z.string().optional(),
    age: z.number().min(0).max(120),
    isMember: z.boolean().optional(),
    address: z.object({
      addressLine1: z.string(),
    }),
    skills: z.array(z.string()),
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

  it("should convert class into form group", () => {
    const formGroup = makeZodForm(schema);
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

    const formGroup = makeZodForm(schema, data);

    expect(formGroup.value).toEqual(data);
  });

  it("should throw an error if fail to make zod form", () => {
    const makeFormSpy = jest
      .spyOn(makeFormFromProperties, "makeFormFromProperties")
      .mockImplementation(() => {
        throw new Error("something went wrong");
      });

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

    expect(() => {
      makeZodForm(schema, data);
    }).toThrow("failed to make zod form");
  });
});
