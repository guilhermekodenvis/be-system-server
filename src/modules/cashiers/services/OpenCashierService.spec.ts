import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import FakeCashiersRepository from '../repositories/fakes/FakeCashiersRepository'
import ICashiersRepository from '../repositories/ICashiersRepository'
import OpenCashierService from './OpenCashierService'

let openCashier: OpenCashierService
let fakeCashiersRepository: ICashiersRepository
let fakeUsersRepository: IUsersRepository
let fakeHashProvider: IHashProvider

describe('OpenCashier', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository()
		fakeHashProvider = new FakeHashProvider()
		fakeCashiersRepository = new FakeCashiersRepository()
		openCashier = new OpenCashierService(
			fakeCashiersRepository,
			fakeHashProvider,
			fakeUsersRepository,
		)
	})

	it('should be able to open the cashier', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		const cashier = await openCashier.run({
			value: 10,
			password: '123123',
			user_id: user.id,
		})

		expect(cashier.user_id).toBe(user.id)
		expect(cashier.is_open).toBe(true)
	})

	it('should not be able to open the cashier with wrong password', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		await expect(
			openCashier.run({
				value: 10,
				password: 'wrong-password',
				user_id: user.id,
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to open the cashier if the cashier is already open', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		await openCashier.run({
			value: 10,
			password: '123123',
			user_id: user.id,
		})

		await expect(
			openCashier.run({
				value: 10,
				password: '123123',
				user_id: user.id,
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to open the cashier with non existant user', async () => {
		await expect(
			openCashier.run({
				value: 10,
				password: '123123',
				user_id: 'non-existant-user',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should create a register of start cashier value', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		const cashier = await openCashier.run({
			value: 10,
			password: '123123',
			user_id: user.id,
		})

		expect(cashier.working_dates.length).toEqual(1)
		expect(cashier.working_dates[0].registers.length).toEqual(1)
	})
})
