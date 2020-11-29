import AppError from '@shared/errors/AppError'
import FakeTablesRepository from '../repositories/fakes/FakeTableRequestsRepository'
import ITablesRepository from '../repositories/ITableRequestsRepository'
import FindTableService from './FindTableService'

let fakeTablesRepository: ITablesRepository
let findTable: FindTableService

describe('CreateTable', () => {
	beforeEach(() => {
		fakeTablesRepository = new FakeTablesRepository()
		findTable = new FindTableService(fakeTablesRepository)
	})

	it('should be able to get an existant table', async () => {
		const table = await fakeTablesRepository.createTable({
			table_number: 10,
			user_id: 'user-id',
		})

		const foundTable = await findTable.run({
			table_id: table.id.toString(),
		})

		expect(foundTable.id).toEqual(table.id)
	})

	it('should not be able to get a table when the table is not found', async () => {
		await expect(
			findTable.run({
				table_id: 'non-existant-id',
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
