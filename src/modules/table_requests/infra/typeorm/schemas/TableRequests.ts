import {
	ObjectID,
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ObjectIdColumn,
} from 'typeorm'
import ProductsInTable from './ProductsInTable'

@Entity('table_requests')
class TableRequests {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	number: number

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@Column(type => ProductsInTable)
	products: ProductsInTable[]

	@Column('uuid')
	user_id: string

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}

export default TableRequests
