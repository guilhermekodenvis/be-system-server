import CreateProductService from '@modules/products/services/CreateProductService'
import DeleteProductService from '@modules/products/services/DeleteProductService'
import GetCategoriesService from '@modules/products/services/GetCategoriesService'
import GetProductsFromUserService from '@modules/products/services/GetProductsFromUserService'
import ShowProductService from '@modules/products/services/ShowProductService'
import UpdateProductService from '@modules/products/services/UpdateProductService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class ProductsController {
	public async index(request: Request, response: Response): Promise<Response> {
		const listProductsService = container.resolve(GetProductsFromUserService)
		const { id: user_id } = request.user

		const products = await listProductsService.run({ user_id })

		return response.json(products)
	}

	public async create(request: Request, response: Response): Promise<Response> {
		const { name, category, price, ingredients, description } = request.body
		const { id: user_id } = request.user

		const createProductService = container.resolve(CreateProductService)

		const product = await createProductService.run({
			name,
			category,
			price,
			user_id,
			description,
			ingredients,
		})

		return response.json(product).status(201)
	}

	public async update(request: Request, response: Response): Promise<Response> {
		const { name, category, price, ingredients, description } = request.body
		const { id: user_id } = request.user
		const { product_id } = request.params
		const updateProductService = container.resolve(UpdateProductService)

		const product = await updateProductService.run({
			name,
			category,
			price,
			ingredients,
			description,
			product_id,
			user_id,
		})

		return response.json(product)
	}

	public async delete(request: Request, response: Response): Promise<Response> {
		const { product_id } = request.params
		const { id: user_id } = request.user

		const deleteProductService = container.resolve(DeleteProductService)

		const deletedProducts = await deleteProductService.run({
			product_id,
			user_id,
		})

		return response
			.status(200)
			.json({ message: 'Produto deletado com sucesso!', deletedProducts })
	}

	public async show(request: Request, response: Response): Promise<Response> {
		const { product_id } = request.params
		const { id: user_id } = request.user

		const showProductService = container.resolve(ShowProductService)
		const product = await showProductService.run({
			product_id,
			user_id,
		})

		return response.json(product)
	}
}

export default ProductsController
