import 'reflect-metadata'
import AppError from '@shared/errors/AppError'

// import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository'
import IProductsRepository from '../repositories/IProductsRepository'
import ListProductsService from './ListProductsService'

// let fakeCacheProvider: FakeCacheProvider;
let listProducts: ListProductsService
let fakeProductsRepository: IProductsRepository
let fakeUsersRepository: FakeUsersRepository

describe('CreateProduct', () => {
	beforeEach(() => {
		fakeProductsRepository = new FakeProductsRepository()
		// fakeCacheProvider = new FakeCacheProvider();
		fakeUsersRepository = new FakeUsersRepository()
		listProducts = new ListProductsService(
			fakeProductsRepository,
			fakeUsersRepository,
		)
	})

	it('should be able to see the product list', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		await fakeProductsRepository.create({
			name: 'Suco de uva',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		await fakeProductsRepository.create({
			name: 'Suco de salada',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		const products = await listProducts.run({ user_id: user.id })

		expect(products?.length).toBe(2)
	})

	it('should not be able to see the product list with wrong user id', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		await fakeProductsRepository.create({
			name: 'Suco de uva',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		await fakeProductsRepository.create({
			name: 'Suco de salada',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		await expect(
			listProducts.run({ user_id: 'wrong-user-id' }),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to user see products from other user', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		const otherUser = await fakeUsersRepository.create({
			restaurant_name: 'Outro user',
			user_name: 'Mãe do Nobrega',
			email: 'teste@teste.com',
			password: '123456',
			cnpj: '12313444555512',
		})

		await fakeProductsRepository.create({
			name: 'Suco de uva',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		await fakeProductsRepository.create({
			name: 'Suco de salada',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		const productsList = await listProducts.run({ user_id: otherUser.id })

		expect(productsList?.length).toBe(0)
	})
})
