import GetCategoriesService from '@modules/products/services/GetCategoriesService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class CategoriesController {
	public async index(request: Request, response: Response): Promise<Response> {
		const { id: user_id } = request.user
		const getCategories = container.resolve(GetCategoriesService)
		const categories = await getCategories.run({
			user_id,
		})

		return response.json(categories)
	}
}
