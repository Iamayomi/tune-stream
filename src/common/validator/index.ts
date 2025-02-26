import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@ValidatorConstraint({ name: 'IsPhoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return false;
    const phoneNumber = parsePhoneNumberFromString(value);
    return phoneNumber ? phoneNumber.isValid() : false;
  }

  defaultMessage() {
    return 'Phone number must be valid.';
  }
}

@ValidatorConstraint({ name: 'IsTrue', async: false })
export class IsTrueConstraint implements ValidatorConstraintInterface {
  validate(value: boolean) {
    return value === true;
  }

  defaultMessage() {
    return 'Terms of service must be accepted.';
  }
}

/**
 * Multi-purpose custom validator
 * @param validatorClass - The validator constraint class to use
 * @param validationOptions - Optional validation options
 */

export function CustomValidator(
  validatorClass: new () => ValidatorConstraintInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: validatorClass,
    });
  };
}
