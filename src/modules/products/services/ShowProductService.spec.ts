import 'reflect-metadata'
import AppError from '@shared/errors/AppError'

// import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository'
import IProductsRepository from '../repositories/IProductsRepository'
import ShowProductService from './ShowProductService'

// let fakeCacheProvider: FakeCacheProvider;
let showProductService: ShowProductService
let fakeProductsRepository: IProductsRepository
let fakeUsersRepository: FakeUsersRepository

describe('CreateProduct', () => {
	beforeEach(() => {
		fakeProductsRepository = new FakeProductsRepository()
		// fakeCacheProvider = new FakeCacheProvider();
		fakeUsersRepository = new FakeUsersRepository()
		showProductService = new ShowProductService(
			fakeProductsRepository,
			fakeUsersRepository,
		)
	})

	it('should be able to see the right product', async () => {
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

		await fakeProductsRepository.create({
			name: 'Suco de salada',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		const findProduct = await showProductService.run({
			product_id: product.id,
			user_id: user.id,
		})

		expect(findProduct).toMatchObject(product)
	})

	it('should not be able to see the product from wrong user id', async () => {
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

		await fakeProductsRepository.create({
			name: 'Suco de salada',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		await expect(
			showProductService.run({
				product_id: product.id,
				user_id: 'wrong-user-id',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to see the product from wrong product id', async () => {
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
			showProductService.run({
				product_id: 'wrong-product-id',
				user_id: user.id,
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to see the product from other user id', async () => {
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

		await fakeProductsRepository.create({
			name: 'Suco de salada',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		await expect(
			showProductService.run({
				product_id: product.id,
				user_id: otherUser.id,
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
