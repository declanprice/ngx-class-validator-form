import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { makeForm } from "./make-form";

describe("makeForm()", () => {
  let initialData: any;

  beforeEach(() => {
    initialData = {
      name: "Declan",
      dateOfBirth: "1998-04-1",
      currentAge: 22,
      skills: ["1", "2", "3"],
      currentAddress: {
        postcode: "G2241Q",
      },
      addresses: [{ postcode: "A2241A" }, { postcode: "B2241B" }],
    };
  });

  class EditCustomerCommand {
    @IsString()
    @MaxLength(200)
    name!: string;

    @IsString()
    dateOfBirth!: string;

    @IsNumber()
    currentAge!: number;

    @IsArray()
    @IsString({ each: true })
    skills!: string[];

    @IsObject()
    @ValidateNested()
    @Type(() => Address)
    currentAddress!: Address;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Address)
    addresses!: Address;
  }

  class Address {
    @IsString()
    postcode!: string;
  }

  it("should create FormGroup with expected controls", () => {
    const formGroup = makeForm(EditCustomerCommand);

    const nameControl = formGroup.get("name");
    const dateOfBirth = formGroup.get("dateOfBirth");
    const currentAge = formGroup.get("currentAge");
    const currentAddress = formGroup.get("currentAddress");
    const currentAddressPostCode = currentAddress?.get("postcode");

    expect(nameControl).toBeTruthy();
    expect(dateOfBirth).toBeTruthy();
    expect(currentAge).toBeTruthy();
    expect(currentAddress).toBeTruthy();
    expect(currentAddressPostCode).toBeTruthy();
    expect(formGroup.value).toEqual({
      name: null,
      dateOfBirth: null,
      currentAge: null,
      currentAddress: { postcode: null },
      skills: [],
      addresses: [],
    });
  });

  it("should create FormGroup with expected value", () => {
    const formGroup = makeForm(EditCustomerCommand, initialData);

    console.log(formGroup.value);

    // expect(formGroup.value).toEqual(initialData);
  });
});
