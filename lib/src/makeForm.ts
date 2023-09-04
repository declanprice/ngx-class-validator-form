import { Schema } from "joi";
import { ZodObject } from "zod";

import { makeFormFromProperties } from "./makeFormFromProperties";
import { zodToProperties } from "./converters/zod/zodToProperties";
import { joiToProperties } from "./converters/joi/joiToProperties";

export const makeJoiForm = (schema: Schema, data?: any) => {
  try {
    const formProperties = joiToProperties(schema);
    return makeFormFromProperties(formProperties, data);
  } catch (error) {
    throw new Error("failed to make joi form");
  }
};

export const makeZodForm = (schema: ZodObject<any>, data?: any) => {
  try {
    const formProperties = zodToProperties(schema);
    return makeFormFromProperties(formProperties, data);
  } catch (error) {
    throw new Error("failed to make zod form");
  }
};
