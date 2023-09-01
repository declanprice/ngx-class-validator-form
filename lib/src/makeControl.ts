import { FormControl, Validators } from "@angular/forms";

interface ValidatorOptions {
  required?: boolean;
  minimum?: number;
  maximum?: number;
  maxLength?: number;
  minLength?: number;
}

export const makeControl = (
  value: string | boolean | number | null,
  validators?: ValidatorOptions
) => {
  const formControl = new FormControl({ value, disabled: false });

  if (validators?.required === true) {
    formControl.addValidators(Validators.required);
  }

  if (validators?.minLength !== undefined) {
    formControl.addValidators(Validators.minLength(validators.minLength));
  }

  if (validators?.maxLength !== undefined) {
    formControl.addValidators(Validators.maxLength(validators.maxLength));
  }

  if (validators?.minimum !== undefined) {
    console.log("adding min validator");
    formControl.addValidators(Validators.min(validators.minimum));
  }

  if (validators?.maximum !== undefined) {
    formControl.addValidators(Validators.max(validators.maximum));
  }

  return formControl;
};
