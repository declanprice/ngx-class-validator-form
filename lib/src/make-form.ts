import { FormArray, FormGroup } from "@angular/forms";

import { validationMetadatasToSchemas } from "class-validator-jsonschema";

// @ts-ignore
import { defaultMetadataStorage } from "class-transformer/cjs/storage";

import { makeControl } from "./make-control";

export const makeForm = (
  commandClass: { new (...params: any): any },
  initialData?: any
): FormGroup => {
  const commandName = commandClass.name;

  const jsonSchemas = validationMetadatasToSchemas({
    classTransformerMetadataStorage: defaultMetadataStorage,
    refPointerPrefix: "",
  });

  const commandSchema = jsonSchemas[commandName];

  if (!commandSchema || commandSchema.type !== "object") {
    throw new Error("invalid command schema, cannot create form");
  }

  const formGroup = new FormGroup({});

  const addControlsToGroup = (
    formGroup: FormGroup | FormArray,
    schemaProperties: any,
    requiredProperties: string[] | undefined,
    data?: any
  ) => {
    for (const prop in schemaProperties) {
      const schemaProperty = schemaProperties?.type
        ? schemaProperties
        : schemaProperties[prop];

      if (
        schemaProperty.type === "string" ||
        schemaProperty.type === "number" ||
        schemaProperty.type === "integer" ||
        schemaProperty.type === "boolean"
      ) {
        let controlValue = typeof data === "object" ? data[prop] : data;

        const control = makeControl(controlValue || null, {
          minLength: schemaProperty.minLength,
          maxLength: schemaProperty.maxLength,
          required: requiredProperties?.includes(prop),
        });

        if (formGroup instanceof FormArray) {
          formGroup.push(control);
        } else {
          formGroup.addControl(prop, control);
        }
      } else if (schemaProperty.type === "object") {
        const nestedFormGroup = new FormGroup({});

        const nestedSchemaProperties = jsonSchemas[schemaProperty["$ref"]];

        if (!nestedSchemaProperties) {
          throw new Error(
            `could not find ${schemaProperty} class-validator metadata`
          );
        }

        addControlsToGroup(
          nestedFormGroup,
          nestedSchemaProperties.properties,
          nestedSchemaProperties.required,
          data ? data[prop] || undefined : undefined
        );

        if (formGroup instanceof FormArray) {
          formGroup.push(nestedFormGroup);
        } else {
          formGroup.addControl(prop, nestedFormGroup);
        }
      } else if (schemaProperty.type === "array") {
        const nestedFormArray = new FormArray<any>([]);

        const arrayData = data ? data[prop] || undefined : undefined;

        if (Array.isArray(arrayData)) {
          for (const itemData of arrayData) {
            if (schemaProperty.items.type) {
              addControlsToGroup(
                nestedFormArray,
                schemaProperty.items,
                itemData
              );
            } else {
              const nestedFormGroup = new FormGroup({});

              const nestedSchemaProperties =
                jsonSchemas[schemaProperty.items["$ref"]];

              if (!nestedSchemaProperties) {
                throw new Error(
                  `could not find ${schemaProperty} class-validator metadata`
                );
              }

              addControlsToGroup(
                nestedFormGroup,
                nestedSchemaProperties.properties,
                nestedSchemaProperties.required,
                itemData
              );

              nestedFormArray.push(nestedFormGroup);
            }
          }
        }

        if (formGroup instanceof FormArray) {
          formGroup.push(nestedFormArray);
        } else {
          formGroup.addControl(prop, nestedFormArray);
        }
      }
    }
  };

  addControlsToGroup(
    formGroup,
    commandSchema.properties,
    commandSchema.required,
    initialData
  );

  return formGroup;
};
