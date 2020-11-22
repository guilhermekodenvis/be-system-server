import 'reflect-metadata'
import InsertProductsIntoTableRequestService from './InsertProductsIntoTableRequestService'
import FakeTableRequestsRepository from '../repositories/fakes/FakeTableRequestsRepository'

let insertProductsIntoTable: InsertProductsIntoTableRequestService

describe('CreateProduct', () => {
	beforeEach(() => {
		insertProductsIntoTable = new InsertProductsIntoTableRequestService(
			new FakeTableRequestsRepository(),
		)
	})

	it('should be able to create a new table request', async () => {
		const tableRequest = await insertProductsIntoTable.run({
			products: [
				{
					observation: '',
					product_id: 'product-id',
					product_name: 'product-name',
					product_price: 10,
					quantity: 1,
				},
			],
			user_id: 'user-id',
			table_id: '',
		})

		expect(tableRequest).toHaveProperty('id')
	})
})
