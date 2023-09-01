import { makeControl } from "./make-control";

describe("makeControl()", () => {
  it("should make FormControl with maxLength string validator", () => {
    const formControl = makeControl("hello", { maxLength: 3 });
    formControl.updateValueAndValidity();
    expect(formControl.errors).toBeTruthy();
    expect(formControl.errors!["maxlength"]).toEqual({
      requiredLength: 3,
      actualLength: 5,
    });
  });

  it("should make FormControl with [maxLength] validators", () => {
    const formControl = makeControl("hello", { minLength: 10 });
    formControl.updateValueAndValidity();
    expect(formControl.errors).toBeTruthy();
    expect(formControl.errors!["minlength"]).toEqual({
      requiredLength: 10,
      actualLength: 5,
    });
  });

  it("should make FormControl with [required] validators", () => {
    const formControl = makeControl("", { required: true });
    formControl.updateValueAndValidity();
    expect(formControl.errors).toBeTruthy();
    expect(formControl.errors!["required"]).toEqual(true);
  });

  it("should make FormControl with [minLength, required] validators", () => {
    const formControl = makeControl("", { required: true, minLength: 5 });
    formControl.updateValueAndValidity();
    expect(formControl.errors).toBeTruthy();
    expect(formControl.errors!["required"]).toEqual(true);
    formControl.patchValue("hel");
    formControl.updateValueAndValidity();
    expect(formControl.errors!["minlength"]).toEqual({
      requiredLength: 5,
      actualLength: 3,
    });
  });
});
