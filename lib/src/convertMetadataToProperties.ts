import { MetadataStorage } from "class-validator";

// @ts-ignore
import { defaultMetadataStorage } from "class-transformer/cjs/storage";

import { ValidationMetadata } from "class-validator/types/metadata/ValidationMetadata";

// const validationMetadata = getMetadataStorage();
//
// const targetValidationMetadata =
//     validationMetadata.getTargetValidationMetadatas(clazz, "", true, false);
//
// for (const metadata of targetValidationMetadata) {
//   console.log(metadata);
//
//   // const constraint = validationMetadata.getTargetValidatorConstraints(
//   //   metadata.constraintCls
//   // );
//   //
//   // console.log("constraint", constraint);
// }

const getNestedValidationMetadata = (
  metadataStorage: MetadataStorage,
  metadata: ValidationMetadata
): ValidationMetadata[] => {
  try {
    const reflectedTypeConstructor = defaultMetadataStorage._typeMetadatas
      .get(metadata.target)
      .get(metadata.propertyName).reflectedType;

    const reflectedTypeMetadata = metadataStorage.getTargetValidationMetadatas(
      reflectedTypeConstructor,
      "",
      true,
      false
    );

    return reflectedTypeMetadata;
  } catch (error) {
    throw new Error(
      "failed to get nested validation metadata, ensure you have applied @Type(() => NestedType) decorator"
    );
  }
};
