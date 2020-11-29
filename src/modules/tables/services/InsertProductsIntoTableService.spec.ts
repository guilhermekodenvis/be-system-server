import 'reflect-metadata'
import AppError from '@shared/errors/AppError'
import InsertProductsIntoTableService from './InsertProductsIntoTableService'
import FakeTablesRepository from '../repositories/fakes/FakeTableRequestsRepository'
import ITablesRepository from '../repositories/ITableRequestsRepository'

let insertProductsIntoTable: InsertProductsIntoTableService
let fakeTablesRepository: ITablesRepository

describe('InsertProductsIntoTable', () => {
	beforeEach(() => {
		fakeTablesRepository = new FakeTablesRepository()
		insertProductsIntoTable = new InsertProductsIntoTableService(
			fakeTablesRepository,
		)
	})

	it('should be able to insert all products in table request', async () => {
		const table = await fakeTablesRepository.createTable({
			table_number: 10,
			user_id: 'user-id',
		})

		const tableWithProducts = await insertProductsIntoTable.run({
			products: [
				{
					product_id: 'product-id-1',
					product_name: 'fake-product-1',
					product_price: 10,
					quantity: 1,
					observation: '',
				},
				{
					product_id: 'product-id-2',
					product_name: 'fake-product-2',
					product_price: 10,
					quantity: 1,
					observation: 'fake-observation',
				},
			],
			table_id: table.id.toString(),
			user_id: 'user-id',
		})

		expect(tableWithProducts.products.length).toEqual(2)
	})

	it('should not be able to insert products in wrong table id', async () => {
		await expect(
			insertProductsIntoTable.run({
				products: [
					{
						product_id: 'product-id-1',
						product_name: 'fake-product-1',
						product_price: 10,
						quantity: 1,
						observation: '',
					},
					{
						product_id: 'product-id-2',
						product_name: 'fake-product-2',
						product_price: 10,
						quantity: 1,
						observation: 'fake-observation',
					},
				],
				table_id: 'wrong-table-id',
				user_id: 'user-id',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should be able to insert all products in table request with products', async () => {
		const table = await fakeTablesRepository.createTable({
			table_number: 10,
			user_id: 'user-id',
		})

		fakeTablesRepository.update({
			tableRequest: {
				...table,
				products: [
					{
						product_id: 'id',
						observation: 'obs',
						product_name: 'name',
						product_price: 10,
						quantity: 2,
					},
				],
			},
		})

		const tableWithProducts = await insertProductsIntoTable.run({
			products: [
				{
					product_id: 'product-id-1',
					product_name: 'fake-product-1',
					product_price: 10,
					quantity: 1,
					observation: '',
				},
				{
					product_id: 'product-id-2',
					product_name: 'fake-product-2',
					product_price: 10,
					quantity: 1,
					observation: 'fake-observation',
				},
			],
			table_id: table.id.toString(),
			user_id: 'user-id',
		})

		expect(tableWithProducts.products.length).toEqual(3)
	})
})
