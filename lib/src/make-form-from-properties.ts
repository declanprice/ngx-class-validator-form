import { Form, FormArray, FormGroup } from "@angular/forms";

import { getMetadataStorage, MetadataStorage } from "class-validator";

// @ts-ignore
import { defaultMetadataStorage } from "class-transformer/cjs/storage";

import { makeControl } from "./make-control";

import { ValidationMetadata } from "class-validator/types/metadata/ValidationMetadata";

interface FormProperties {
  [propertyName: string]: {
    type: "string" | "number" | "boolean" | "object" | "array";
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    properties?: FormProperties;
  };
}

export const makeFormFromProperties = (
  properties: FormProperties,
  data?: any
) => {
  const formGroup = new FormGroup({});

  const addControlsToGroup = (
    formGroup: FormGroup,
    properties: FormProperties,
    data?: any
  ) => {
    for (const propertyName in properties) {
      const property = properties[propertyName];

      if (
        property.type === "string" ||
        property.type === "number" ||
        property.type === "boolean"
      ) {
        let controlValue = typeof data === "object" ? data[propertyName] : data;

        const control = makeControl(controlValue || undefined, {
          minLength: property.minLength,
          maxLength: property.maxLength,
          required: property.required,
        });

        if (formGroup instanceof FormArray) {
          formGroup.push(control);
        } else {
          formGroup.addControl(propertyName, control);
        }
      }

      if (
        property.type === "object" &&
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
      if (
        property.type === "array" &&
        typeof property.properties === "undefined"
      ) {
        const nestedFormArray = new FormArray<any>([]);

        const arrayData = data ? data[propertyName] : undefined;

        if (Array.isArray(arrayData)) {
          for (const arrayItem of arrayData) {
            const control = makeControl(arrayItem, {
              minLength: property.minLength,
              maxLength: property.maxLength,
              required: property.required,
            });

            nestedFormArray.push(control);
          }
        }

        formGroup.addControl(propertyName, nestedFormArray);
      }

      // handle array of objects
      if (
        property.type === "array" &&
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

        formGroup.addControl(propertyName, nestedFormArray);
      }
    }
  };

  addControlsToGroup(formGroup, properties, data);

  return formGroup;
};

// const validationMetadata = getMetadataStorage();
//
// const targetValidationMetadata =
//     validationMetadata.getTargetValidationMetadatas(clazz, "", true, false);
//
// for (const metadata of targetValidationMetadata) {
//   console.log(metadata);
//
//   // const constraint = validationMetadata.getTargetValidatorConstraints(
//   //   metadata.constraintCls
//   // );
//   //
//   // console.log("constraint", constraint);
// }

const getNestedValidationMetadata = (
  metadataStorage: MetadataStorage,
  metadata: ValidationMetadata
): ValidationMetadata[] => {
  try {
    const reflectedTypeConstructor = defaultMetadataStorage._typeMetadatas
      .get(metadata.target)
      .get(metadata.propertyName).reflectedType;

    const reflectedTypeMetadata = metadataStorage.getTargetValidationMetadatas(
      reflectedTypeConstructor,
      "",
      true,
      false
    );

    return reflectedTypeMetadata;
  } catch (error) {
    throw new Error(
      "failed to get nested validation metadata, ensure you have applied @Type(() => NestedType) decorator"
    );
  }
};
