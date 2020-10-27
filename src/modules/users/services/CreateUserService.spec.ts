import 'reflect-metadata'
import AppError from '@shared/errors/AppError'

// import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
// let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService

describe('CreateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository()
		fakeHashProvider = new FakeHashProvider()
		// fakeCacheProvider = new FakeCacheProvider();
		createUser = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
			// fakeCacheProvider,
		)
	})

	it('should be able to create a new user', async () => {
		const user = await createUser.run({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		expect(user).toHaveProperty('id')
	})

	it('should not be able to create a new user with same email from another', async () => {
		await createUser.run({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		await expect(
			createUser.run({
				restaurant_name: 'Comidinhas Vinhedo',
				user_name: 'Mãe do Nobrega',
				email: 'mae@do.nobrega',
				password: '123123',
				cnpj: '12333444255512',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to create a new user with the same cnpj', async () => {
		await createUser.run({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123123',
			cnpj: '12333444555512',
		})

		await expect(
			createUser.run({
				restaurant_name: 'Comidinhas Vinhedo',
				user_name: 'Mãe do Nobrega',
				email: 'maqe@do.nobrega',
				password: '123123',
				cnpj: '12333444555512',
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
