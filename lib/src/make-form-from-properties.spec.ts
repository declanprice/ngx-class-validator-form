import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";

import { Type } from "class-transformer";

import { makeFormFromProperties } from "./make-form-from-properties";

import "reflect-metadata";
describe("makeForm()", () => {
  beforeEach(() => {});

  it("should make FormGroup with expected controls", () => {
    const formGroup = makeFormFromProperties(
      {
        name: {
          type: "string",
        },
        age: {
          type: "string",
        },
        address: {
          type: "object",
          properties: {
            addressLine1: {
              type: "string",
            },
          },
        },
        skills: {
          type: "array",
          minLength: 3,
          maxLength: 50,
        },
        paymentMethods: {
          type: "array",
          properties: {
            sort: {
              type: "string",
              maxLength: 5,
            },
            account: {
              type: "string",
              maxLength: 10,
            },
            payments: {
              type: "array",
              properties: {
                date: {
                  type: "string",
                },
                amount: {
                  type: "number",
                },
              },
            },
          },
        },
      },
      {
        name: "Declan",
        age: "24",
        address: {
          addressLine1: "49 Kilchattan Street",
        },
        skills: ["basketball", "snowboarding"],
        paymentMethods: [
          {
            sort: "sor123",
            account: "acc123",
            payments: [
              {
                date: "this-date",
                amount: 20,
              },
              {
                date: "that-date",
                amount: 100,
              },
            ],
          },
          {
            sort: "acc321",
            account: "sor321",
          },
        ],
      }
    );
  });
});
