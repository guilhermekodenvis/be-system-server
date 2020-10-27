import AppError from '@shared/errors/AppError'

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateProfileService from './UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfile: UpdateProfileService

describe('UpdateProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository()
		fakeHashProvider = new FakeHashProvider()

		updateProfile = new UpdateProfileService(
			fakeUsersRepository,
			fakeHashProvider,
		)
	})

	it('should be able update the profile', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		const updatedUser = await updateProfile.run({
			user_id: user.id,
			restaurant_name: 'John Trê',
			email: 'johntre@example.com',
			cnpj: '12333444555512',
			user_name: 'testando',
		})

		expect(updatedUser.restaurant_name).toBe('John Trê')
		expect(updatedUser.email).toBe('johntre@example.com')
		expect(updatedUser.cnpj).toBe('12333444555512')
		expect(updatedUser.user_name).toBe('testando')
	})

	it('should not be able update the profile from non-existing user', async () => {
		expect(
			updateProfile.run({
				user_id: 'non-existing-user-id',
				restaurant_name: 'John Trê',
				email: 'johntre@example.com',
				cnpj: '12333444555512',
				user_name: 'testando',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to change to another user email', async () => {
		await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		const user = await fakeUsersRepository.create({
			restaurant_name: 'Teste',
			user_name: 'Testando',
			email: 'teste@do.nobrega',
			password: '123123',
			cnpj: '12333144555512',
		})

		await expect(
			updateProfile.run({
				user_id: user.id,
				email: 'mae@do.nobrega',
				user_name: 'teste',
				restaurant_name: 'teste',
				cnpj: '12333144555512',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should be able to update the password', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		const updatedUser = await updateProfile.run({
			user_id: user.id,
			restaurant_name: 'John Trê',
			cnpj: '12333444555512',
			user_name: 'comidinhas brasilian',
			email: 'johntre@example.com',
			old_password: '123456',
			password: '123123',
		})

		expect(updatedUser.password).toBe('123123')
	})

	it('should not be able to update the password without old password', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		await expect(
			updateProfile.run({
				user_id: user.id,
				restaurant_name: 'John Trê',
				cnpj: '12333444555512',
				user_name: 'comidinhas brasilian',
				email: 'johntre@example.com',
				password: '123123',
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
			updateProfile.run({
				user_id: user.id,
				restaurant_name: 'John Trê',
				cnpj: '12333444555512',
				user_name: 'comidinhas brasilian',
				email: 'johntre@example.com',
				password: '123123',
				old_password: 'wrong-password',
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
