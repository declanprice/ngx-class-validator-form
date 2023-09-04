import { Schema } from "joi";
import { FormProperties } from "../../makeFormFromProperties";
import { ValidatorOptions } from "../../makeControl";

export const joiToProperties = (joiSchema: Schema): FormProperties => {
  if (joiSchema.type !== "object") {
    throw new Error("can only convert classes with with @JoiSchema properties");
  }

  let formProperties: FormProperties = {};

  const getValidators = (rules: any[]) => {
    const validators: ValidatorOptions = {};

    for (const rule of rules) {
      if (rule.name === "min") {
        if (rule.method === "length") {
          validators.minLength = rule.args.limit;
        }
        if (rule.method === "compare") {
          validators.minimum = rule.args.limit;
        }
      }

      if (rule.name === "max") {
        if (rule.method === "length") {
          validators.maxLength = rule.args.limit;
        }
        if (rule.method === "compare") {
          validators.maximum = rule.args.limit;
        }
      }
    }

    return validators;
  };

  const addToFormProperties = (formProperties: FormProperties, schema: any) => {
    for (const objectKey of schema["_ids"]["_byKey"].keys()) {
      const objectSchema = schema["_ids"]["_byKey"].get(objectKey).schema;

      if (
        objectSchema.type === "string" ||
        objectSchema.type === "number" ||
        objectSchema.type === "boolean" ||
        objectSchema.type === "any"
      ) {
        formProperties[objectKey] = {
          type: "formControl",
          ...getValidators(objectSchema["_rules"]),
          required: objectSchema?._flags?.presence === "required",
        };
      }

      if (objectSchema.type === "object") {
        let nestedFormProperties: FormProperties = {};
        addToFormProperties(nestedFormProperties, objectSchema);
        formProperties[objectKey] = {
          type: "formGroup",
          properties: nestedFormProperties,
          required: objectSchema?._flags?.presence === "required",
        };
      }

      if (objectSchema.type === "array") {
        const items = objectSchema["$_terms"]["items"];

        if (items.length === 0) {
          formProperties[objectKey] = {
            type: "formArray",
            required: objectSchema?._flags?.presence === "required",
          };
        }

        if (items.length >= 1) {
          const nestedSchema = items[0];

          if (
            nestedSchema.type === "string" ||
            nestedSchema.type === "number" ||
            nestedSchema.type === "boolean" ||
            objectSchema.type === "any"
          ) {
            formProperties[objectKey] = {
              type: "formArray",
              ...getValidators(nestedSchema["_rules"]),
              required: nestedSchema?._flags?.presence === "required",
            };
          }

          if (nestedSchema.type === "object") {
            let nestedFormProperties: FormProperties = {};
            addToFormProperties(nestedFormProperties, nestedSchema);
            formProperties[objectKey] = {
              type: "formArray",
              properties: nestedFormProperties,
              required: objectSchema?._flags?.presence === "required",
            };
          }
        }
      }
    }
  };

  addToFormProperties(formProperties, joiSchema);

  return formProperties;
};
