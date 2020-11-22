import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import FakeCashierMovimentsRepository from '../repositories/fakes/FakeCashierMovimentsRepository'
import ICashierMovimentsRepository from '../repositories/ICashierMovimentsRepository'
import RegisterCashierMovimentService from './RegisterCashierMovimentService'

let registerCashierMoviment: RegisterCashierMovimentService
let fakeCashierMovimentsRepository: ICashierMovimentsRepository
let fakeUsersRepository: IUsersRepository
let fakeHashProvider: IHashProvider

describe('RegisterCashierMovimentService', () => {
	beforeEach(() => {
		fakeCashierMovimentsRepository = new FakeCashierMovimentsRepository()
		fakeUsersRepository = new FakeUsersRepository()
		fakeHashProvider = new FakeHashProvider()
		registerCashierMoviment = new RegisterCashierMovimentService(
			fakeCashierMovimentsRepository,
			fakeUsersRepository,
			fakeHashProvider,
		)
	})

	it('should be able to create a new register', async () => {
		const cashierMoviment = await registerCashierMoviment.run({
			value: 10.0,
			user_id: 'user_id',
			action: 1,
			password: '123123',
		})

		expect(cashierMoviment).toHaveProperty('id')
	})
})
