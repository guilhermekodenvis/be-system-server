/* eslint-disable indent */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm'
import uploadConfig from '@config/upload'

import { Exclude, Expose } from 'class-transformer'

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

	@Column()
	avatar: string

	@Expose({ name: 'avatar_url' })
	getAvatarUrl(): string | null {
		if (!this.avatar) {
			return 'https://www.albertaaviationmuseum.com/wp-content/uploads/2014/11/logo-placeholder-generic.200x200.png'
		}

		switch (uploadConfig.driver) {
			case 'disk':
				return `${process.env.APP_API_URL}/images/${this.avatar}`
			case 's3':
				return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`
			default:
				return 'https://www.albertaaviationmuseum.com/wp-content/uploads/2014/11/logo-placeholder-generic.200x200.png'
		}
	}
}

export default User
