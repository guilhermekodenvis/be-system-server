import User from '@modules/users/infra/typeorm/entities/User'
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity('products')
class Product {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	name: string

	@Column()
	category: string

	@Column('decimal', { precision: 5, scale: 2 })
	price: number

	@Column()
	ingredients: string

	@Column('text')
	description: string

	@Column()
	user_id: string

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}

export default Product
