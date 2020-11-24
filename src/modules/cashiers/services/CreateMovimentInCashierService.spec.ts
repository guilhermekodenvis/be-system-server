import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import Cashier, {
	CLOSE_CASHIER_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
	PAY_WITH_DEBIT_MOVIMENT,
} from '../infra/typeorm/entities/Cashier'
import FakeCashiersRepository from '../repositories/fakes/FakeCashiersRepository'
import ICashiersRepository from '../repositories/ICashiersRepository'
import CreateMovimentInCashierService from './CreateMovimentInCashierService'

let createMovimentInCashier: CreateMovimentInCashierService
let fakeCashierMovimentsRepository: ICashiersRepository
let fakeHashProvider: IHashProvider
let fakeUsersRepository: IUsersRepository

describe('CreateMovimentInCashier', () => {
	beforeEach(() => {
		fakeCashierMovimentsRepository = new FakeCashiersRepository()
		fakeHashProvider = new FakeHashProvider()
		fakeUsersRepository = new FakeUsersRepository()
		createMovimentInCashier = new CreateMovimentInCashierService(
			fakeCashierMovimentsRepository,
			fakeHashProvider,
			fakeUsersRepository,
		)
	})

	it('should be able to create a cashier moviment', async () => {
		const user = await fakeUsersRepository.create({
			user_name: 'user-name',
			restaurant_name: 'restaurant-name',
			cnpj: '11222333444456',
			email: 'teste@teste.com',
			password: '123123',
		})

		const cashierMoviment = await createMovimentInCashier.run({
			action: PAY_WITH_DEBIT_MOVIMENT,
			user_id: user.id,
			value: 10,
		})

		expect(cashierMoviment).toBeInstanceOf(Cashier)
		expect(cashierMoviment.value).toEqual(10)
	})

	it('should not be able to open cashier without password', async () => {
		await expect(
			createMovimentInCashier.run({
				action: OPEN_CASHIER_MOVIMENT,
				user_id: 'user-id',
				value: 10,
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to close cashier without password', async () => {
		await expect(
			createMovimentInCashier.run({
				action: CLOSE_CASHIER_MOVIMENT,
				user_id: 'user-id',
				value: 10,
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to open cashier with invalid password', async () => {
		const user = await fakeUsersRepository.create({
			user_name: 'user-name',
			restaurant_name: 'restaurant-name',
			cnpj: '11222333444456',
			email: 'teste@teste.com',
			password: '123123',
		})

		await expect(
			createMovimentInCashier.run({
				action: OPEN_CASHIER_MOVIMENT,
				user_id: user.id,
				value: 10,
				password: 'wrong-password',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to close cashier with invalid password', async () => {
		const user = await fakeUsersRepository.create({
			user_name: 'user-name',
			restaurant_name: 'restaurant-name',
			cnpj: '11222333444456',
			email: 'teste@teste.com',
			password: '123123',
		})

		await expect(
			createMovimentInCashier.run({
				action: CLOSE_CASHIER_MOVIMENT,
				user_id: user.id,
				value: 10,
				password: 'wrong-password',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should be able to open cashier with a valid password', async () => {
		const user = await fakeUsersRepository.create({
			user_name: 'user-name',
			restaurant_name: 'restaurant-name',
			cnpj: '11222333444456',
			email: 'teste@teste.com',
			password: '123123',
		})

		const cashierMoviment = await createMovimentInCashier.run({
			action: OPEN_CASHIER_MOVIMENT,
			user_id: user.id,
			value: 10,
			password: '123123',
		})

		expect(cashierMoviment).toBeInstanceOf(Cashier)
		expect(cashierMoviment.value).toEqual(10)
	})

	it('should be able to close cashier with a valid password', async () => {
		const user = await fakeUsersRepository.create({
			user_name: 'user-name',
			restaurant_name: 'restaurant-name',
			cnpj: '11222333444456',
			email: 'teste@teste.com',
			password: '123123',
		})

		const cashierMoviment = await createMovimentInCashier.run({
			action: CLOSE_CASHIER_MOVIMENT,
			user_id: user.id,
			value: 10,
			password: '123123',
		})

		expect(cashierMoviment).toBeInstanceOf(Cashier)
		expect(cashierMoviment.value).toEqual(10)
	})

	it('should not be able to create a moviment with cashier close', async () => {})(
		'should not be able to open/close cashier with no password',
		async () => {},
	)
})
