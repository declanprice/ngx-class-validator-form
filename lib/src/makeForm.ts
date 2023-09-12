import { ZodObject } from "zod";

import { makeFormFromProperties } from "./makeFormFromProperties";

import { zodToProperties } from "./converters/zod/zodToProperties";

export const makeZodForm = (schema: ZodObject<any>, data?: any) => {
  try {
    const formProperties = zodToProperties(schema);
    return makeFormFromProperties(formProperties, data);
  } catch (error) {
    throw new Error("failed to make zod form");
  }
};
