import "reflect-metadata";

import { FormArray, FormControl } from "@angular/forms";

import { makeFormFromProperties } from "./makeFormFromProperties";

describe("makeForm()", () => {
  it("should make FormGroup with expected controls", () => {
    const formGroup = makeFormFromProperties({
      name: {
        type: "formControl",
        required: false,
      },
      age: {
        type: "formControl",
        required: false,
      },
      address: {
        type: "formGroup",
        properties: {
          addressLine1: {
            type: "formControl",
            required: false,
          },
        },
        required: false,
      },
      skills: {
        type: "formArray",
        minLength: 3,
        maxLength: 50,
        required: false,
      },
      paymentMethods: {
        type: "formArray",
        required: false,

        properties: {
          sort: {
            type: "formControl",
            maxLength: 5,
            required: false,
          },
          account: {
            type: "formControl",
            maxLength: 10,
            required: false,
          },
        },
      },
    });

    const nameControl = formGroup.get("name");
    expect(nameControl).toBeTruthy();

    const ageControl = formGroup.get("age");
    expect(ageControl).toBeTruthy();

    const addressControl = formGroup.get("address");
    expect(addressControl).toBeTruthy();

    const addressLine1Control = addressControl!.get("addressLine1");
    expect(addressLine1Control).toBeTruthy();

    const skillControls = formGroup.get("skills");
    expect(skillControls).toBeTruthy();
    expect((skillControls as FormArray).length).not.toBeUndefined();

    const paymentMethodControls = formGroup.get("paymentMethods");
    expect(paymentMethodControls).toBeTruthy();
  });

  it("should make FormGroup with nested objects and validators", () => {
    const formGroup = makeFormFromProperties({
      customer: {
        type: "formGroup",
        required: false,

        properties: {
          name: {
            type: "formControl",
            required: false,
          },
          address: {
            type: "formGroup",
            required: false,

            properties: {
              addressLine1: {
                type: "formControl",
                maxLength: 5,
                required: false,
              },
              addressLine2: {
                type: "formControl",
                required: false,
              },
              other: {
                type: "formArray",
                required: false,
              },
              otherGroup: {
                type: "formArray",
                properties: {
                  otherProperty: {
                    type: "formControl",
                    required: false,
                  },
                },
                required: false,
              },
            },
          },
          skills: {
            required: false,
            type: "formArray",
          },
        },
      },
    });

    const customer = formGroup.get("customer");
    expect(customer).toBeTruthy();

    const customerAddress = customer!.get("address");
    expect(customer).toBeTruthy();

    const customerAddressLine1 = customerAddress!.get("addressLine1");
    expect(customerAddressLine1).toBeTruthy();

    customerAddressLine1?.patchValue("morethan5");

    customerAddressLine1?.updateValueAndValidity();

    expect(customerAddressLine1?.errors).toEqual({
      maxlength: { requiredLength: 5, actualLength: 9 },
    });

    const customerAddressLine2 = customerAddress!.get("addressLine2");
    expect(customerAddressLine2).toBeTruthy();

    const customerAddressOther = customerAddress!.get("other");
    expect(customerAddressOther).toBeTruthy();
    expect((customerAddressOther as FormArray).length).not.toBeUndefined();

    const skillControls = customer!.get("skills");
    expect(skillControls).toBeTruthy();
    expect((skillControls as FormArray).length).not.toBeUndefined();
  });

  it("should populate complex nested FormGroup with data", () => {
    const data = {
      customer: {
        name: "Declan",
        address: {
          addressLine1: "address line 1",
          addressLine2: "address line 2",
          other: ["one", "two", "three"],
          otherGroup: [{ otherProperty: "other property" }],
        },
        skills: ["snowboarding", "basketball"],
      },
    };

    const formGroup = makeFormFromProperties(
      {
        customer: {
          type: "formGroup",
          required: false,

          properties: {
            name: {
              type: "formControl",
              required: false,
            },
            address: {
              type: "formGroup",
              required: false,

              properties: {
                addressLine1: {
                  type: "formControl",
                  required: false,

                  maxLength: 5,
                },
                addressLine2: {
                  type: "formControl",
                  required: false,
                },
                other: {
                  type: "formArray",
                  required: false,
                },
                otherGroup: {
                  type: "formArray",
                  required: false,

                  properties: {
                    otherProperty: {
                      type: "formControl",
                      required: false,
                    },
                  },
                },
              },
            },
            skills: {
              type: "formArray",
              required: false,
            },
          },
        },
      },
      data
    );

    expect(formGroup.value).toEqual(data);
  });

  it("should populate FormArrays with correct FormControls", () => {
    const data = {
      address: {
        addressLine1: "morethan5",
      },
      skills: ["snowboarding", "basketball", "ski"],
      paymentMethods: [
        {
          sort: "040004",
          account: 200000,
        },
        {
          sort: "03030303",
          account: 2000000,
        },
      ],
    };

    const formGroup = makeFormFromProperties(
      {
        address: {
          type: "formGroup",
          required: false,
          properties: {
            addressLine1: {
              type: "formControl",
              required: false,
              maxLength: 5,
            },
          },
        },
        skills: {
          type: "formArray",
          required: false,
          minLength: 5,
          maximum: 50,
        },
        paymentMethods: {
          type: "formArray",
          required: false,
          properties: {
            sort: {
              type: "formControl",
              required: false,
              minLength: 6,
              maxLength: 6,
            },
            account: {
              type: "formControl",
              required: false,
              minimum: 100000,
              maximum: 999999,
            },
          },
        },
      },
      data
    );

    expect(formGroup.value).toEqual(data);

    const addressControl = formGroup.get("address");
    expect(addressControl).toBeTruthy();
    expect(addressControl!.valid).toEqual(false);

    const addressLine1Control = addressControl!.get("addressLine1");
    expect(addressLine1Control).toBeTruthy();
    expect(addressLine1Control!.valid).toEqual(false);

    const skillControls = formGroup.get("skills") as FormArray;
    expect(skillControls.length).toEqual(3);
    expect(skillControls.valid).toEqual(false);
    expect(skillControls.invalid).toEqual(true);

    const snowboardingSkill = skillControls.at(0);
    const basketballSkill = skillControls.at(1);
    const skiSkill = skillControls.at(2);

    expect(snowboardingSkill).toBeTruthy();
    expect(basketballSkill).toBeTruthy();
    expect(skiSkill).toBeTruthy();

    expect(snowboardingSkill.value).toEqual("snowboarding");
    expect(snowboardingSkill.errors).toEqual(null);
    expect(basketballSkill.value).toEqual("basketball");
    expect(basketballSkill.errors).toEqual(null);
    expect(skiSkill.value).toEqual("ski");
    expect(skiSkill.errors).toEqual({
      minlength: { requiredLength: 5, actualLength: 3 },
    });

    const paymentMethodControls = formGroup.get("paymentMethods") as FormArray;
    expect(paymentMethodControls.valid).toEqual(false);
    expect(paymentMethodControls.length).toEqual(2);
    expect(paymentMethodControls).toBeTruthy();

    const paymentMethod1 = paymentMethodControls.at(0);
    expect(paymentMethod1.valid).toEqual(true);

    const paymentMethod2 = paymentMethodControls.at(1);
    expect(paymentMethod2.valid).toEqual(false);

    const paymentMethod2Sort = paymentMethod2.get("sort");
    expect(paymentMethod2Sort).toBeTruthy();
    expect(paymentMethod2Sort?.errors).toEqual({
      maxlength: { requiredLength: 6, actualLength: 8 },
    });

    const paymentMethod2Account = paymentMethod2.get("account");
    expect(paymentMethod2Account).toBeTruthy();
    expect(paymentMethod2Account?.errors).toEqual({
      max: { max: 999999, actual: 2000000 },
    });
  });

  it("should should only add known properties to the FormGroup", () => {
    const formGroup = makeFormFromProperties(
      {
        name: {
          type: "formControl",
          required: true,
        },
        paymentMethods: {
          type: "formArray",
          required: false,

          properties: {
            sort: {
              type: "formControl",
              required: false,
            },
            account: {
              type: "formControl",
              required: false,
            },
          },
        },
      },
      {
        name: "Declan",
        nameUnknown: "Declan",
        paymentMethods: [
          {
            sort: 2,
            account: 2,
          },
          {
            sort: 2,
            account: 2,
            accounts: 2,
          },
        ],
      }
    );

    expect(formGroup.value).toEqual({
      name: "Declan",
      paymentMethods: [
        {
          sort: 2,
          account: 2,
        },
        {
          sort: 2,
          account: 2,
        },
      ],
    });
  });

  it("should set default values as undefined", () => {
    const formGroup = makeFormFromProperties(
      {
        name: {
          type: "formControl",
          required: true,
        },
        paymentMethods: {
          type: "formArray",
          required: false,
          properties: {
            sort: {
              type: "formControl",
              required: false,
            },
            account: {
              type: "formControl",
              required: false,
            },
          },
        },
      },
      {
        paymentMethods: [
          {
            sort: 2,
          },
        ],
      }
    );

    expect(formGroup.value).toEqual({
      name: undefined,
      paymentMethods: [
        {
          sort: 2,
          account: undefined,
        },
      ],
    });
  });

  it("should support array value as FormControl instead of FormArray", () => {
    const formGroup = makeFormFromProperties(
      {
        paymentMethods: {
          type: "formControl",
          required: false,
        },
      },
      {
        paymentMethods: [
          {
            sort: 2,
            account: 2,
          },
          {
            sort: 2,
            account: 2,
          },
        ],
      }
    );

    const paymentMethods = formGroup.get("paymentMethods") as FormControl;
    expect(paymentMethods).toBeTruthy();
    expect((paymentMethods as any)["length"]).toBeUndefined();
    expect(paymentMethods.value).toEqual([
      {
        sort: 2,
        account: 2,
      },
      {
        sort: 2,
        account: 2,
      },
    ]);

    expect(formGroup.value).toEqual({
      paymentMethods: [
        {
          sort: 2,
          account: 2,
        },
        {
          sort: 2,
          account: 2,
        },
      ],
    });
  });

  it("should make name FormControl with expected [required] validator", () => {
    const formGroup = makeFormFromProperties({
      name: {
        type: "formControl",
        required: true,
      },
    });

    const name = formGroup.get("name");

    name?.updateValueAndValidity();

    expect(name?.errors).toEqual({ required: true });
  });

  it("should make name FormControl with expected [minLength] validator", () => {
    const formGroup = makeFormFromProperties({
      name: {
        type: "formControl",
        required: false,
        minLength: 5,
      },
    });

    const name = formGroup.get("name");

    name?.patchValue("hel");

    name?.updateValueAndValidity();

    expect(name?.errors).toEqual({
      minlength: { requiredLength: 5, actualLength: 3 },
    });
  });

  it("should make name FormControl with expected [maxLength] validator", () => {
    const formGroup = makeFormFromProperties({
      name: {
        type: "formControl",
        required: false,
        maxLength: 5,
      },
    });

    const name = formGroup.get("name");

    name?.patchValue("morethan5");

    name?.updateValueAndValidity();

    expect(name?.errors).toEqual({
      maxlength: { requiredLength: 5, actualLength: 9 },
    });
  });

  it("should make name FormControl with expected [minimum] validator", () => {
    const formGroup = makeFormFromProperties({
      age: {
        type: "formControl",
        required: false,
        minimum: 5,
      },
    });

    const age = formGroup.get("age");

    age?.patchValue(2);

    age?.updateValueAndValidity();

    expect(age?.errors).toEqual({
      min: { min: 5, actual: 2 },
    });
  });

  it("should make name FormControl with expected [maximum] validator", () => {
    const formGroup = makeFormFromProperties({
      age: {
        type: "formControl",
        required: false,
        maximum: 5,
      },
    });

    const age = formGroup.get("age");

    age?.patchValue(10);

    age?.updateValueAndValidity();

    expect(age?.errors).toEqual({
      max: { max: 5, actual: 10 },
    });
  });

  it("should make name FormControl with expected [minLength, maxLength, required] validators", () => {
    const formGroup = makeFormFromProperties({
      name: {
        type: "formControl",
        required: true,
        minLength: 5,
        maxLength: 10,
      },
    });

    const name = formGroup.get("name");

    name?.updateValueAndValidity();

    expect(name?.errors).toEqual({
      required: true,
    });

    name?.patchValue("dec");

    name?.updateValueAndValidity();

    expect(name?.errors).toEqual({
      minlength: { requiredLength: 5, actualLength: 3 },
    });

    name?.patchValue("iammorethan10");

    name?.updateValueAndValidity();

    expect(name?.errors).toEqual({
      maxlength: { requiredLength: 10, actualLength: 13 },
    });
  });
});
