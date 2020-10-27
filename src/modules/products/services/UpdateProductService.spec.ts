import 'reflect-metadata'
import AppError from '@shared/errors/AppError'

// import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository'
import IProductsRepository from '../repositories/IProductsRepository'
import UpdateProductService from './UpdateProductService'

// let fakeCacheProvider: FakeCacheProvider;
let updateProductService: UpdateProductService
let fakeProductsRepository: IProductsRepository
let fakeUsersRepository: FakeUsersRepository

describe('CreateProduct', () => {
	beforeEach(() => {
		fakeProductsRepository = new FakeProductsRepository()
		// fakeCacheProvider = new FakeCacheProvider();
		fakeUsersRepository = new FakeUsersRepository()
		updateProductService = new UpdateProductService(
			fakeProductsRepository,
			fakeUsersRepository,
		)
	})

	it('should be able to change products information', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		const product = await fakeProductsRepository.create({
			name: 'Suco de uva',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		const updatedProduct = await updateProductService.run({
			name: 'Suco de limão',
			category: 'liquidos',
			price: 11.0,
			user_id: user.id,
			product_id: product.id,
			description: 'nova descrição',
			ingredients: 'novos ingredientes',
		})

		expect(updatedProduct.name).toBe('Suco de limão')
	})

	it('should not be able to change products information with wrong user id', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		const product = await fakeProductsRepository.create({
			name: 'Suco de uva',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		await expect(
			updateProductService.run({
				name: 'Suco de limão',
				category: 'liquidos',
				price: 11.0,
				user_id: 'wrong-user-id',
				product_id: product.id,
				description: 'nova descrição',
				ingredients: 'novos ingredientes',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to change products information with wrong product id', async () => {
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

		await expect(
			updateProductService.run({
				name: 'Suco de limão',
				category: 'liquidos',
				price: 11.0,
				user_id: user.id,
				product_id: 'wrong-product-id',
				description: 'nova descrição',
				ingredients: 'novos ingredientes',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to change products information from other user id', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		const otherUser = await fakeUsersRepository.create({
			restaurant_name: 'teste',
			user_name: 'Mãe do Nobrega',
			email: 'teste@teste.com',
			password: '123456',
			cnpj: '12333434555512',
		})

		const product = await fakeProductsRepository.create({
			name: 'Suco de uva',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		await expect(
			updateProductService.run({
				name: 'Suco de limão',
				category: 'liquidos',
				price: 11.0,
				user_id: otherUser.id,
				product_id: product.id,
				description: 'nova descrição',
				ingredients: 'novos ingredientes',
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
