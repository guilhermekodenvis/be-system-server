import FakeTablesRepository from '../repositories/fakes/FakeTableRequestsRepository'
import ITablesRepository from '../repositories/ITableRequestsRepository'
import CheckTableAviabilityService from './CheckTableAviabilityService'

let fakeTablesRepository: ITablesRepository
let checkTableAviability: CheckTableAviabilityService

describe('CheckTableAviability', () => {
	beforeEach(() => {
		fakeTablesRepository = new FakeTablesRepository()
		checkTableAviability = new CheckTableAviabilityService(fakeTablesRepository)
	})

	it('should be able to get the correct aviability from a specific table', async () => {
		await fakeTablesRepository.createTable({
			table_number: 5,
			user_id: 'user-id',
		})

		const falsyAviability = await checkTableAviability.run({
			number: 5,
			user_id: 'user-id',
		})

		expect(falsyAviability).toBeFalsy()

		const truthyAviabilityA = await checkTableAviability.run({
			number: 4,
			user_id: 'user-id',
		})

		expect(truthyAviabilityA).toBeTruthy()

		const truthyAviabilityB = await checkTableAviability.run({
			number: 5,
			user_id: 'other-user-id',
		})

		expect(truthyAviabilityB).toBeTruthy()

		const truthyAviabilityC = await checkTableAviability.run({
			number: 3,
			user_id: 'other-user-id',
		})

		expect(truthyAviabilityC).toBeTruthy()
	})
})
