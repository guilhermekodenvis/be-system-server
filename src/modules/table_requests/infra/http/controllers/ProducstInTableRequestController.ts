import FindTableRequestService from '@modules/table_requests/services/FindTableRequestService'
import InsertProductsIntoTableRequestService from '@modules/table_requests/services/InsertProductsIntoTableRequestService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class ProducstInTableRequestController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { table_id, products } = request.body
		const { id } = request.user

		const insertProductsIntoTableRequest = container.resolve(
			InsertProductsIntoTableRequestService,
		)
		const tableRequest = await insertProductsIntoTableRequest.run({
			table_id,
			products,
			user_id: id,
		})

		return response.status(201).json(tableRequest)
	}

	public async show(request: Request, response: Response): Promise<Response> {
		const { id } = request.params

		const findTableRequest = container.resolve(FindTableRequestService)
		const tableRequest = await findTableRequest.run({
			table_id: id,
		})

		return response.status(201).json(tableRequest)
	}
}
