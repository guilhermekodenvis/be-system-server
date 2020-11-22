import 'reflect-metadata'
import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository'
import IProductsRepository from '../repositories/IProductsRepository'
import DeleteProductService from './DeleteProductService'

let deleteProductService: DeleteProductService
let fakeProductsRepository: IProductsRepository
let fakeUsersRepository: FakeUsersRepository

describe('CreateProduct', () => {
	beforeEach(() => {
		fakeProductsRepository = new FakeProductsRepository()
		fakeUsersRepository = new FakeUsersRepository()
		deleteProductService = new DeleteProductService(fakeProductsRepository)
	})

	it('should be able to delete an existant product', async () => {
		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		const { id } = await fakeProductsRepository.create({
			name: 'Suco de uva',
			category: 'liquidos',
			price: 10.0,
			user_id: user.id,
			description: 'descrição muito massa',
			ingredients: 'vários ingredientes',
		})

		await deleteProductService.run({ product_id: id, user_id: user.id })

		const deletedProduct = await fakeProductsRepository.getProductById(id)

		expect(deletedProduct).toBe(undefined)
	})

	it('should not be able to delete a product with a wrong id', async () => {
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
			deleteProductService.run({
				product_id: 'wrong-product-id',
				user_id: user.id,
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should not be able to delete a product with wrong user-id', async () => {
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
			deleteProductService.run({
				product_id: product.id,
				user_id: 'wrong-user-id',
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
