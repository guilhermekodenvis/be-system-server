import FindTableRequestService from '@modules/tables/services/FindTableService'
import InsertProductsIntoTableService from '@modules/tables/services/InsertProductsIntoTableService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import uploadConfig from '@config/upload'

export default class ProducstInTableRequestController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { table_id, products } = request.body
		const { id } = request.user

		const insertProductsIntoTableRequest = container.resolve(
			InsertProductsIntoTableService,
		)

		const donwloadInvoiceLink = await insertProductsIntoTableRequest.run({
			table_id,
			products,
			user_id: id,
		})

		return response.status(201).json({
			download: `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${donwloadInvoiceLink}`,
		})
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
