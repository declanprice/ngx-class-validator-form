import { FormArray, FormGroup } from "@angular/forms";

import { makeControl } from "./makeControl";

interface FormProperties {
  [propertyName: string]: {
    type: "formControl" | "formGroup" | "formArray";
    minLength?: number;
    maxLength?: number;
    maximum?: number;
    minimum?: number;
    required?: boolean;
    properties?: FormProperties;
  };
}

export const makeFormFromProperties = (
  properties: FormProperties,
  data?: any
): FormGroup => {
  const formGroup = new FormGroup({});

  const addControlsToGroup = (
    formGroup: FormGroup,
    properties: FormProperties,
    data?: any
  ) => {
    for (const propertyName in properties) {
      console.log(propertyName);

      const property = properties[propertyName];

      if (property.type === "formControl") {
        let controlValue = typeof data === "object" ? data[propertyName] : data;

        const control = makeControl(controlValue || undefined, {
          minLength: property.minLength,
          maxLength: property.maxLength,
          maximum: property.maximum,
          minimum: property.minimum,
          required: property.required,
        });

        control.updateValueAndValidity();

        formGroup.addControl(propertyName, control);
      }

      //
      else if (
        property.type === "formGroup" &&
        typeof property.properties === "object"
      ) {
        const nestedFormGroup = new FormGroup({});

        addControlsToGroup(
          nestedFormGroup,
          property.properties,
          data ? data[propertyName] : undefined
        );

        formGroup.addControl(propertyName, nestedFormGroup);
      }

      // handle array of primitive types
      else if (
        property.type === "formArray" &&
        typeof property.properties === "undefined"
      ) {
        const nestedFormArray = new FormArray<any>([]);

        const arrayData = data ? data[propertyName] : undefined;

        if (Array.isArray(arrayData)) {
          for (const arrayItem of arrayData) {
            const control = makeControl(arrayItem, {
              minLength: property.minLength,
              maxLength: property.maxLength,
              maximum: property.maximum,
              minimum: property.minimum,
              required: property.required,
            });

            control.updateValueAndValidity();

            nestedFormArray.push(control);
          }
        }

        formGroup.updateValueAndValidity();
        formGroup.addControl(propertyName, nestedFormArray);
      }

      // handle array of objects
      else if (
        property.type === "formArray" &&
        typeof property.properties === "object"
      ) {
        const nestedFormArray = new FormArray<any>([]);

        const arrayData = data ? data[propertyName] || undefined : undefined;

        if (Array.isArray(arrayData)) {
          for (const arrayItem of arrayData) {
            const nestedFormGroup = new FormGroup({});
            addControlsToGroup(nestedFormGroup, property.properties, arrayItem);
            nestedFormArray.push(nestedFormGroup);
          }
        }

        formGroup.updateValueAndValidity();
        formGroup.addControl(propertyName, nestedFormArray);
      }
    }
  };

  addControlsToGroup(formGroup, properties, data);

  return formGroup;
};
