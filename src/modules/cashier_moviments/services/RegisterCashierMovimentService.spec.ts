import FakeCashierMovimentsRepository from '../repositories/fakes/FakeCashierMovimentsRepository'
import ICashierMovimentsRepository from '../repositories/ICashierMovimentsRepository'
import RegisterCashierMovimentService from './RegisterCashierMovimentService'

let registerCashierMoviment: RegisterCashierMovimentService
let fakeCashierMovimentsRepository: ICashierMovimentsRepository

describe('RegisterCashierMovimentService', () => {
	beforeEach(() => {
		fakeCashierMovimentsRepository = new FakeCashierMovimentsRepository()
		registerCashierMoviment = new RegisterCashierMovimentService(
			fakeCashierMovimentsRepository,
		)
	})

	it('should be able to create a new register', async () => {
		const cashierMoviment = await registerCashierMoviment.run({
			value: 10.0,
			user_id: 'user_id',
			action: 1,
		})

		expect(cashierMoviment).toHaveProperty('id')
	})
})
