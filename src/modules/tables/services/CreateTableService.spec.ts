import AppError from '@shared/errors/AppError'
import FakeTablesRepository from '../repositories/fakes/FakeTableRequestsRepository'
import ITablesRepository from '../repositories/ITableRequestsRepository'
import CreateTableService from './CreateTableService'

let fakeTablesRepository: ITablesRepository
let createTable: CreateTableService

describe('CreateTable', () => {
	beforeEach(() => {
		fakeTablesRepository = new FakeTablesRepository()
		createTable = new CreateTableService(fakeTablesRepository)
	})

	it('should be able to create a Table', async () => {
		const table = await createTable.run({
			table_number: 10,
			user_id: 'user-id',
		})

		expect(table.number).toEqual(10)
	})

	it('should not be able to create a Table if the table is not avialable', async () => {
		await fakeTablesRepository.createTable({
			table_number: 10,
			user_id: 'user-id',
		})

		await expect(
			createTable.run({
				table_number: 10,
				user_id: 'user-id',
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
