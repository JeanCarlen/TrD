import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('mutedusers')
export class MutedUsers extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int4' })
	user_id: number;

	@Column({ type: 'int4' })
	chat_id: number;

	@Column({ type: 'date' })
	until: Date;
}
