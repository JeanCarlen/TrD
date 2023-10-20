import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('achievments')
export class Achievments extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({example: 1, description: 'The ID of the Achievment.'})
  id: number;

  @Column({ type: 'varchar', length: 32 })
  @ApiProperty({example: '42', description: 'The name of the Achievment.'})
  title: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({example: '42', description: 'The description of the Achievment.'})
  description: string;

  @Column({ type: 'int4' })
  @ApiProperty({example: 42, description: 'The objective of the Achievment.'})
  objective: number;
}
