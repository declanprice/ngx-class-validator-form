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

describe("convertMetadataToProperties()", () => {
  class Customer {
    @IsString()
    @MaxLength(200)
    name!: string;

    @IsString()
    dateOfBirth!: string;

    @IsNumber()
    age!: number;

    @IsArray()
    @IsString({ each: true })
    skills!: string[];

    @IsObject()
    @ValidateNested()
    @Type(() => Address)
    address!: Address;
  }

  class Address {
    @IsString()
    postcode!: string;
  }

  it("should convert complex nested Customer metadata to valid FormProperties object", () => {});
});
