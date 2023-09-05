import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('achievments')
export class Achievments extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	title: string;

	@Column({ type: 'varchar' })
	description: string;

	@Column({ type: 'int4' })
	objective: number;
}
