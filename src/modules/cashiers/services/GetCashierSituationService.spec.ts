import FakeCashiersRepository from '../repositories/fakes/FakeCashiersRepository'
import ICashiersRepository from '../repositories/ICashiersRepository'
import GetCashierSituationService from './GetCashierSituationService'

let getCashierSituation: GetCashierSituationService
let fakeCashiersRepository: ICashiersRepository
describe('ShowCashierMovimentsDetails', () => {
	beforeEach(() => {
		fakeCashiersRepository = new FakeCashiersRepository()
		getCashierSituation = new GetCashierSituationService(fakeCashiersRepository)
	})
	it('should be able to get the situation of a cashier', async () => {})
})
