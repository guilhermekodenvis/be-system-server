import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import IUsersRepository from '../repositories/IUsersRepository'
import UpdatePasswordService from './UpdatePasswordService'

let fakeUsersRepository: IUsersRepository
let fakeHashProvider: IHashProvider
let updatePassword: UpdatePasswordService

describe('UpdatePassword', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository()
		fakeHashProvider = new FakeHashProvider()

		updatePassword = new UpdatePasswordService(
			fakeUsersRepository,
			fakeHashProvider,
		)
	})

	it('should be able to update the password', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		const updatedUser = await updatePassword.run({
			user_id: user.id,
			old_password: '123456',
			password: '123123',
		})

		expect(updatedUser?.password).toBe('123123')
	})

	it('should not be able to update the password without new password', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		await expect(
			updatePassword.run({
				password: '123123',
				old_password: '',
				user_id: user.id,
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to update the password with wrong old password', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		await expect(
			updatePassword.run({
				user_id: user.id,
				password: '123123',
				old_password: 'wrong-password',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to update with non existent user', async () => {
		await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		await expect(
			updatePassword.run({
				user_id: 'wrong-user-id',
				password: '123123',
				old_password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
