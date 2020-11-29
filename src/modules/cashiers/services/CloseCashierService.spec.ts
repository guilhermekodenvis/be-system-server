import User from '@modules/users/infra/typeorm/entities/User'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { getDate, getMonth, getYear } from 'date-fns'
import { OPEN_CASHIER_MOVIMENT } from '../enums/cashierMovimentActions'
import FakeCashiersRepository from '../repositories/fakes/FakeCashiersRepository'
import ICashiersRepository from '../repositories/ICashiersRepository'
import CloseCashierService from './CloseCashierService'

let closeCashier: CloseCashierService
let fakeCashiersRepository: ICashiersRepository
let fakeUsersRepository: IUsersRepository
let fakeHashProvider: IHashProvider
let user: User
describe('CloseCashierService', () => {
	beforeEach(async () => {
		fakeUsersRepository = new FakeUsersRepository()
		fakeHashProvider = new FakeHashProvider()
		fakeCashiersRepository = new FakeCashiersRepository()
		closeCashier = new CloseCashierService(
			fakeCashiersRepository,
			fakeHashProvider,
			fakeUsersRepository,
		)
		user = await fakeUsersRepository.create({
			cnpj: '11222333444401',
			email: 'gui.sartori96@gmail.com',
			password: '123123',
			restaurant_name: 'comidinhas',
			user_name: 'comidinhas',
		})

		await fakeCashiersRepository.openCashier({
			user_id: user.id,
			value: 10,
		})

		const actualDate = Date.now()

		const workingDate = await fakeCashiersRepository.startNewWorkingDate({
			day: getDate(actualDate),
			month: getMonth(actualDate),
			year: getYear(actualDate),
			user_id: user.id,
		})

		await fakeCashiersRepository.createRegisterInCashierWorkingDate({
			user_id: user.id,
			action: OPEN_CASHIER_MOVIMENT,
			value: 10,
			working_date_id: workingDate.id,
		})
	})

	it('should be able to close the cashier', async () => {
		const cashier = await closeCashier.run({
			user_id: user.id,
			password: '123123',
		})

		expect(cashier.is_open).not.toBeTruthy()
	})

	it('should not be able to close the cashier if its closed', async () => {
		await closeCashier.run({
			user_id: user.id,
			password: '123123',
		})

		await expect(
			closeCashier.run({
				user_id: user.id,
				password: '123123',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to close the cashier with wrong password', async () => {
		await expect(
			closeCashier.run({
				user_id: user.id,
				password: 'wrong-password',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to close the cashier with wrong userid', async () => {
		await expect(
			closeCashier.run({
				user_id: 'wrong-user-id',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
