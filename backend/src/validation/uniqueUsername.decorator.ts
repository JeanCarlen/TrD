import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from 'class-validator';
import { Users } from "src/users/entities/users.entity";
import { Repository } from "typeorm";

export function IsUniqueUsername(validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: UniquePasswordValidation
		})
	}
}

@ValidatorConstraint({name: 'unique-username', async: true})
@Injectable()
export class UniquePasswordValidation implements ValidatorConstraintInterface {
	constructor(
		@InjectRepository(Users)
		private repo: Repository<Users>
	) {}

	async validate(value: string, args: ValidationArguments): Promise<boolean> {
		const found = await this.repo.find({where: { username: value }})
		if (found.length != 0)
			throw new BadRequestException(
				[`${args.value} ${args.property} is not unique.`],
				{
					cause: new Error(),
					description: `${args.value} ${args.property} is not unique.`
				}
			)
		return true
	}
}