import { BadRequestException, Injectable } from "@nestjs/common";
import {
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from 'class-validator';

export function IsMatching(property: string, validationOptions?: ValidationOptions){
	return function (object: any, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: MatchValidation,
			constraints: [property]
		})
	}
}

@ValidatorConstraint({name: 'matching-password', async: false})
@Injectable()
export class MatchValidation implements ValidatorConstraintInterface {
	constructor() {}

	validate(value: string, args: ValidationArguments): boolean {
		const [relatedPropertyName] = args.constraints;
		const relatedValue = (args.object as any)[relatedPropertyName]
		if (value !== relatedValue)
			throw new BadRequestException(
				[`${args.property} must match ${relatedPropertyName}.`],
				{
					cause: new Error(),
					description: `${args.property} must match ${relatedPropertyName}.`,
				},
			)
		return true
	}
}