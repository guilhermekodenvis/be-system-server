import {
	CLOSE_CASHIER_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
	PAY_WITH_DEBIT_MOVIMENT,
} from '../infra/typeorm/entities/Cashier'
import FakeCashiersRepository from '../repositories/fakes/FakeCashiersRepository'
import ICashiersRepository from '../repositories/ICashiersRepository'
import GetAllRegistersSinceLastAppertureService from './GetAllRegistersSinceLastAppertureService'

let getAllRegistersSinceLastApperture: GetAllRegistersSinceLastAppertureService
let fakeCashiersRepository: ICashiersRepository
describe('GetAllRegistersSinceLastApperture', () => {
	beforeEach(() => {
		fakeCashiersRepository = new FakeCashiersRepository()
		getAllRegistersSinceLastApperture = new GetAllRegistersSinceLastAppertureService(
			fakeCashiersRepository,
		)
	})

	it('should be able to get all registers since last apperture', async () => {
		await fakeCashiersRepository.create({
			user_id: 'user-id',
			action: OPEN_CASHIER_MOVIMENT,
			value: 10,
		})
		await fakeCashiersRepository.create({
			user_id: 'user-id',
			action: PAY_WITH_DEBIT_MOVIMENT,
			value: 10,
		})
		await fakeCashiersRepository.create({
			user_id: 'user-id',
			action: PAY_WITH_DEBIT_MOVIMENT,
			value: 10,
		})
		await fakeCashiersRepository.create({
			user_id: 'user-id',
			action: PAY_WITH_DEBIT_MOVIMENT,
			value: 10,
		})

		const cashiers = await getAllRegistersSinceLastApperture.run({
			user_id: 'user-id',
		})

		expect(cashiers.length).toEqual(4)
	})

	it('should not be able to get registers before last apperture', async () => {
		await fakeCashiersRepository.create({
			user_id: 'user-id',
			action: OPEN_CASHIER_MOVIMENT,
			value: 11,
		})

		await fakeCashiersRepository.create({
			user_id: 'user-id',
			action: PAY_WITH_DEBIT_MOVIMENT,
			value: 10,
		})
		await fakeCashiersRepository.create({
			user_id: 'user-id',
			action: PAY_WITH_DEBIT_MOVIMENT,
			value: 10,
		})

		await fakeCashiersRepository.create({
			user_id: 'user-id',
			action: CLOSE_CASHIER_MOVIMENT,
			value: 10,
		})
		setTimeout(async () => {
			await fakeCashiersRepository.create({
				user_id: 'user-id',
				action: OPEN_CASHIER_MOVIMENT,
				value: 12,
			})

			setTimeout(async () => {
				await fakeCashiersRepository.create({
					user_id: 'user-id',
					action: PAY_WITH_DEBIT_MOVIMENT,
					value: 10,
				})
				await fakeCashiersRepository.create({
					user_id: 'user-id',
					action: PAY_WITH_DEBIT_MOVIMENT,
					value: 10,
				})
				await fakeCashiersRepository.create({
					user_id: 'user-id',
					action: PAY_WITH_DEBIT_MOVIMENT,
					value: 10,
				})
			}, 1000)
		}, 500)

		const cashiers = await getAllRegistersSinceLastApperture.run({
			user_id: 'user-id',
		})

		expect(cashiers.length).toEqual(4)
	})
})
