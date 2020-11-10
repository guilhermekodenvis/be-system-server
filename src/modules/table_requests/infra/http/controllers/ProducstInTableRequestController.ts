import FindTableRequestService from '@modules/table_requests/services/FindTableRequestService'
import InsertProductsIntoTableRequestService from '@modules/table_requests/services/InsertProductsIntoTableRequestService'
import GenerateInvoiceToKitchenService from '@modules/table_requests/services/GenerateInvoiceToKitchenService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class ProducstInTableRequestController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { table_id, products } = request.body
		const { id } = request.user

		const insertProductsIntoTableRequest = container.resolve(
			InsertProductsIntoTableRequestService,
		)

		const generateInvoiceToKitchen = container.resolve(
			GenerateInvoiceToKitchenService,
		)

		const tableRequest = await insertProductsIntoTableRequest.run({
			table_id,
			products,
			user_id: id,
		})

		const fileName = await generateInvoiceToKitchen.run({ tableRequest })

		return response
			.status(201)
			.json({ download: `${process.env.APP_API_URL}/files/${fileName}` })
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
