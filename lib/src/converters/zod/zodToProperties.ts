import { FormProperties } from "../../makeFormFromProperties";

import {
  ZodAny,
  ZodArray,
  ZodBoolean,
  ZodNumber,
  ZodNumberDef,
  ZodObject,
  ZodOptional,
  ZodString,
  ZodStringDef,
} from "zod";

import { ValidatorOptions } from "../../makeControl";

export const zodToProperties = (zodSchema: ZodObject<any>): FormProperties => {
  const zodShape = zodSchema._def.shape();

  let formProperties: FormProperties = {};

  const getValidators = (
    property: ZodString | ZodNumber | ZodBoolean | ZodAny
  ) => {
    const validators: ValidatorOptions = {};

    if (!(property._def as any)?.checks) return validators;

    const parseStringDef = (def: ZodStringDef) => {
      for (const check of def.checks) {
        switch (check.kind) {
          case "min":
            validators.minLength = check.value;
            break;
          case "max":
            validators.maxLength = check.value;
            break;
        }
      }
    };

    const parseNumberDef = (def: ZodNumberDef) => {
      for (const check of def.checks) {
        switch (check.kind) {
          case "min":
            validators.minimum = check.value;
            break;
          case "max":
            validators.maximum = check.value;
            break;
        }
      }
    };

    if (property._def.typeName === "ZodString") {
      validators.required = true;
      parseStringDef(property._def);
    }

    if (property._def.typeName === "ZodNumber") {
      validators.required = true;
      parseNumberDef(property._def);
    }

    return validators;
  };

  const addToFormProperties = (
    formProperties: FormProperties,
    zodShape: any
  ) => {
    for (const propertyName in zodShape) {
      const zodProperty = zodShape[propertyName];

      if (
        zodProperty._def.typeName === "ZodString" ||
        zodProperty._def.typeName === "ZodNumber" ||
        zodProperty._def.typeName === "ZodBoolean" ||
        zodProperty._def.typeName === "ZodAny"
      ) {
        formProperties[propertyName] = {
          type: "formControl",
          ...getValidators(zodProperty),
          required: true,
        };
      }

      const handleObjectProperty = (
        zodProperty: ZodObject<any>,
        required: boolean
      ) => {
        let nestedFormProperties: FormProperties = {};
        addToFormProperties(nestedFormProperties, zodProperty.shape);
        formProperties[propertyName] = {
          type: "formGroup",
          properties: nestedFormProperties,
          required,
        };
      };

      const handleArrayProperty = (
        zodProperty: ZodArray<any>,
        required: boolean
      ) => {
        const arrayType = zodProperty._def.type;

        if (
          arrayType._def.typeName === "ZodString" ||
          arrayType._def.typeName === "ZodNumber" ||
          arrayType._def.typeName === "ZodBoolean" ||
          arrayType._def.typeName === "ZodAny"
        ) {
          formProperties[propertyName] = {
            type: "formArray",
            ...getValidators(arrayType),
            required,
          };
        }

        if (arrayType._def.typeName === "ZodObject") {
          let nestedFormProperties: FormProperties = {};
          addToFormProperties(nestedFormProperties, arrayType.shape);
          formProperties[propertyName] = {
            type: "formArray",
            properties: nestedFormProperties,
            required,
          };
        }
      };

      if (zodProperty._def.typeName === "ZodObject") {
        handleObjectProperty(zodProperty, true);
      }

      if (zodProperty._def.typeName === "ZodArray") {
        handleArrayProperty(zodProperty, true);
      }

      if (zodProperty._def.typeName === "ZodOptional") {
        const innerType = zodProperty._def.innerType;

        if (
          innerType._def.typeName === "ZodString" ||
          innerType._def.typeName === "ZodNumber" ||
          innerType._def.typeName === "ZodBoolean" ||
          innerType._def.typeName === "ZodAny"
        ) {
          formProperties[propertyName] = {
            type: "formControl",
            ...getValidators(innerType),
            required: false,
          };
        }

        if (innerType._def.typeName === "ZodObject") {
          handleObjectProperty(innerType, false);
        }

        if (innerType._def.typeName === "ZodArray") {
          handleArrayProperty(innerType, false);
        }
      }
    }
  };

  addToFormProperties(formProperties, zodShape);

  return formProperties;
};
