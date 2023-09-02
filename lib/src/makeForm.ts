import { convertJoiClassToProperties } from "./convertJoiClassToProperties";

import { makeFormFromProperties } from "./makeFormFromProperties";

export const makeForm = (clazz: { new (...props: any): any }, data?: any) => {
  try {
    const formProperties = convertJoiClassToProperties(clazz);
    return makeFormFromProperties(formProperties, data);
  } catch (error) {
    throw new Error("failed to make form");
  }
};
