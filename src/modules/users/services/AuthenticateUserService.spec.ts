import 'dotenv/config'
import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let authenticateUser: AuthenticateUserService

describe('AuthenticateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository()
		fakeHashProvider = new FakeHashProvider()

		authenticateUser = new AuthenticateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		)
	})

	it('should be able to authenticate', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		const response = await authenticateUser.run({
			email: 'mae@do.nobrega',
			password: '123123',
		})

		expect(response).toHaveProperty('token')
		expect(response.user).toEqual(user)
	})

	it('should not be able to authenticate with non existing user', async () => {
		await expect(
			authenticateUser.run({
				email: 'mae@do.nobrega',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		await expect(
			authenticateUser.run({
				email: 'mae@do.nobrega',
				password: 'wrong-password',
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
