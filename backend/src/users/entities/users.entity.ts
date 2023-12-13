import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({example: 1, description: 'The ID of the User.'})
  id: number;

  @Column({ type: 'integer', nullable: false })
  @ApiProperty({example: 1, description: 'The status of the User. (0=> off, 1=> on, 2=> ingame)'})
  status: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiPropertyOptional({example: 'saeby', description: 'The 42 Login of the User.'})
  login42: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({example: 'laendrun', description: 'The username of the User.'})
  username: string;

  @Column({ type: 'boolean', nullable: true })
  @ApiProperty({example: true, description: 'Is two factor authentication activated.'})
  twofaenabled: boolean;

  @Column({ type: 'char', length: 256, nullable: true })
  @ApiProperty({example: 'GM2TE2T3BFKHWUZA', description: 'The secret used to generate the 2FA code (when activated).'})
  twofasecret: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  @ApiProperty({example: 'http://10.12.2.5:8080/images/default.png', description: 'Path to the user\'s avatar.'})
  avatar: string;

  @Column({ type: 'boolean', nullable: true })
  @ApiProperty({example: true, description: 'Is the user connected with 42 login.'})
  is42: boolean;

  @Column({ type: 'varchar', length: 72, nullable: true })
  @ApiProperty({example: '$2b$10$BBholHyB/JuhRrtQ3zl.Ce9x1CqftJNrGINCmu07.id3zE.rr6o5m', description: 'Hash of the user\'s password.'})
  password: string;
}
