import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository'
import IProductsRepository from '../repositories/IProductsRepository'
import GetCategoriesService from './GetCategoriesService'

let getCategories: GetCategoriesService
let fakeProductsRepository: IProductsRepository

describe('GetCategories', () => {
	beforeEach(() => {
		fakeProductsRepository = new FakeProductsRepository()
		getCategories = new GetCategoriesService(fakeProductsRepository)
	})

	it('should be able to get all categories from a specific user', async () => {
		await fakeProductsRepository.create({
			name: 'fake-product',
			category: 'fake-category',
			price: 10,
			user_id: 'user-id',
			description: 'fake-description',
			ingredients: 'none',
		})

		const categories = await getCategories.run({ user_id: 'user-id' })

		expect(categories).toContain('fake-category')
	})

	it('should be able to get [] if has no categories yet', async () => {
		const categories = await getCategories.run({ user_id: 'user-id' })

		expect(categories).toEqual([])
	})

	it('should be able to show unduplicated categories', async () => {
		await fakeProductsRepository.create({
			name: 'fake-product',
			category: 'fake-category',
			price: 10,
			user_id: 'user-id',
			description: 'fake-description',
			ingredients: 'none',
		})
		await fakeProductsRepository.create({
			name: 'fake-product',
			category: 'fake-category',
			price: 10,
			user_id: 'user-id',
			description: 'fake-description',
			ingredients: 'none',
		})
		await fakeProductsRepository.create({
			name: 'fake-product',
			category: 'fake-category-2',
			price: 10,
			user_id: 'user-id',
			description: 'fake-description',
			ingredients: 'none',
		})

		const categories = await getCategories.run({ user_id: 'user-id' })

		expect(categories.length).toBe(2)
	})
})
