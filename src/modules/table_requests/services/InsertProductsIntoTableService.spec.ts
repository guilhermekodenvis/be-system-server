import 'reflect-metadata'
import AppError from '@shared/errors/AppError'
import { ObjectID } from 'typeorm'
import InsertProductsIntoTable from './InsertProductsIntoTableService'
import FakeTableRequestsRepository from '../repositories/fakes/FakeTableRequestsRepository'

let insertProductsIntoTable: InsertProductsIntoTable

describe('CreateProduct', () => {
	beforeEach(() => {
		insertProductsIntoTable = new InsertProductsIntoTable(
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
			table_id: undefined,
			table_number: 7,
		})

		expect(tableRequest).toHaveProperty('id')
	})
})
