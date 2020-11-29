import {
	ObjectID,
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ObjectIdColumn,
} from 'typeorm'
import Product from './Product'

@Entity('table_requests')
class Table {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	number: number

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@Column(type => Product)
	products: Product[]

	@Column('uuid')
	user_id: string

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}

export default Table
