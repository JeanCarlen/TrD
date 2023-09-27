import { BadRequestException, Injectable } from "@nestjs/common";
import {
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
  } from 'class-validator';

// At least one capital letter (A-Z)
// At least one lowercase letter (a-z)
// At least one number (0-9)
// Minimum length of 8 characters

  export function IsValidPassword(validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: PasswordValidation
		})
	}
  }

  @ValidatorConstraint({name: 'password', async: false})
  @Injectable()
  export class PasswordValidation implements ValidatorConstraintInterface {
	constructor() {}

	validate(value: string, args: ValidationArguments): boolean {
		if (value.length < 8)
			throw new BadRequestException(
				[`${args.property} length must be at least 8 characters.`],
				{
				cause: new Error(),
				description: `${args.property} length must be at least 8 characters, got ${value.length}.`,
				},
			);
		if (!/\d/.test(value))
			throw new BadRequestException(
				[`${args.property}  must contain at least one number.`],
				{
				cause: new Error(),
				description: `${args.property}  must contain at least one number`,
				},
			);
		if (!/[A-Z]/.test(value))
			throw new BadRequestException(
				[`${args.property} must contain at least one uppercase letter.`],
				{
				cause: new Error(),
				description: `${args.property}  must contain at least one uppercase letter.`,
				},
			);
		if (!/[a-z]/.test(value))
			throw new BadRequestException(
				[`${args.property}  must contain at least one lowercase letter.`],
				{
				cause: new Error(),
				description: `${args.property}  must contain at least one lowercase letter.`,
				},
			);
		return true
	}
  }