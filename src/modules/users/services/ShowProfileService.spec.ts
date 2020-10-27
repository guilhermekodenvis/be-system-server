import AppError from '@shared/errors/AppError'
import 'reflect-metadata'
import User from '../infra/typeorm/entities/User'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import ShowProfileService from './ShowProfileService'

let fakeUsersRepository: FakeUsersRepository

let showProfile: ShowProfileService

describe('ShowProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository()
		showProfile = new ShowProfileService(fakeUsersRepository)
	})

	it('should be able to show user profile', async () => {
		const { id } = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		const user = await showProfile.run({ user_id: id })

		expect(user).toBeInstanceOf(User)
	})

	it('should not be able to show profile from user that doesnt exists', async () => {
		await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		await expect(
			showProfile.run({ user_id: 'wrong-id' }),
		).rejects.toBeInstanceOf(AppError)
	})
})
