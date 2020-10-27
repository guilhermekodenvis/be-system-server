import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import ResetPasswordService from './ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeHashProvider: FakeHashProvider
let resetPassword: ResetPasswordService

describe('ResetPasswordService', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository()
		fakeUserTokensRepository = new FakeUserTokensRepository()
		fakeHashProvider = new FakeHashProvider()

		resetPassword = new ResetPasswordService(
			fakeUsersRepository,
			fakeUserTokensRepository,
			fakeHashProvider,
		)
	})

	it('should be able to reset the password', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		const { token } = await fakeUserTokensRepository.generate(user.id)

		const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

		await resetPassword.run({
			password: '123123',
			token,
		})

		const updatedUser = await fakeUsersRepository.findById(user.id)

		expect(generateHash).toHaveBeenCalledWith('123123')
		expect(updatedUser?.password).toBe('123123')
	})

	it('should not be able to reset the password with non-existing token', async () => {
		await expect(
			resetPassword.run({
				token: 'non-existing-token',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to reset the password with non-existing user', async () => {
		const { token } = await fakeUserTokensRepository.generate(
			'non-existing-user',
		)

		await expect(
			resetPassword.run({
				token,
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to reset password if passed more than 2 hours', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})
		const { token } = await fakeUserTokensRepository.generate(user.id)

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			const customDate = new Date()

			return customDate.setHours(customDate.getHours() + 3)
		})

		await expect(
			resetPassword.run({
				password: '123123',
				token,
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
