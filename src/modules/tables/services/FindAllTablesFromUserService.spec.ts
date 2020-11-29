import FakeTablesRepository from '../repositories/fakes/FakeTableRequestsRepository'
import ITablesRepository from '../repositories/ITableRequestsRepository'
import FindAllTablesFromUserService from './FindAllTablesFromUserService'

let fakeTablesRepository: ITablesRepository
let findAllTablesFromUser: FindAllTablesFromUserService

describe('CreateTable', () => {
	beforeEach(() => {
		fakeTablesRepository = new FakeTablesRepository()
		findAllTablesFromUser = new FindAllTablesFromUserService(
			fakeTablesRepository,
		)
	})

	it('should be able to get all tables', async () => {
		await fakeTablesRepository.createTable({
			table_number: 10,
			user_id: 'user-id',
		})
		await fakeTablesRepository.createTable({
			table_number: 11,
			user_id: 'user-id',
		})
		await fakeTablesRepository.createTable({
			table_number: 12,
			user_id: 'user-id',
		})

		const allTables = await findAllTablesFromUser.run({
			user_id: 'user-id',
		})

		expect(allTables.length).toEqual(3)
	})

	it('should be able to get none when the user has no table at all', async () => {
		const allTables = await findAllTablesFromUser.run({
			user_id: 'user-id',
		})

		expect(allTables.length).toEqual(0)
	})
})
