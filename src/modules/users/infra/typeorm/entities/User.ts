import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm'
// import uploadConfig from '@config/upload';

import { Exclude /* Expose */ } from 'class-transformer'

@Entity('users')
class User {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	restaurant_name: string

	@Column()
	user_name: string

	@Column()
	email: string

	@Exclude()
	@Column()
	password: string

	@Column()
	cnpj: string

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	// @Expose({ name: 'avatar_url' })
	// getAvatarUrl(): string | null {
	//   if (!this.avatar) {
	//     return null;
	//   }

	//   switch (uploadConfig.driver) {
	//     case 'disk':
	//       return `${process.env.APP_API_URL}/files/${this.avatar}`;
	//     case 's3':
	//       return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
	//     default:
	//       return null;
	//   }
	// }
}

export default User
