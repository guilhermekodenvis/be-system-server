import { Column } from 'typeorm'

class Product {
	@Column('uuid')
	product_id: string

	@Column()
	quantity: number

	@Column()
	observation: string

	@Column('decimal', { precision: 5, scale: 2 })
	product_price: number

	@Column()
	product_name: string
}

export default Product
