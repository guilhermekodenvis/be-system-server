import 'reflect-metadata'
import AppError from '@shared/errors/AppError'

// import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository'
import CreateProductService from './CreateProductService'
import IProductsRepository from '../repositories/IProductsRepository'

// let fakeCacheProvider: FakeCacheProvider;
let createProductService: CreateProductService
let fakeProductsRepository: IProductsRepository
let fakeUsersRepository: FakeUsersRepository

describe('CreateProduct', () => {
	beforeEach(() => {
		fakeProductsRepository = new FakeProductsRepository()
		// fakeCacheProvider = new FakeCacheProvider();
		fakeUsersRepository = new FakeUsersRepository()
		createProductService = new CreateProductService(
			fakeProductsRepository,
			fakeUsersRepository,
		)
	})

	it('should be able to create a new product', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		const product = await createProductService.run({
			name: 'Suco de uva',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		expect(product).toHaveProperty('id')
	})

	it('should not be able to create a new product with a wrong user id', async () => {
		await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		await expect(
			createProductService.run({
				name: 'Suco de uva',
				category: 'liquidos',
				price: 10.0,
				user_id: 'wrong-user-id',
				description: 'descrição muito massa',
				ingredients: 'vários ingredientes',
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
