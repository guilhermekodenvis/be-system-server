import CreateTableRequestService from '@modules/table_requests/services/CreateTableRequestService'
import FindTableRequestsService from '@modules/table_requests/services/FindTableRequestsService'
// import InsertProductsIntoTable from '@modules/table_requests/services/InsertProductsIntoTableService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class TableRequestsController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { table_number } = request.body
		const { id } = request.user

		const createTableRequest = container.resolve(CreateTableRequestService)
		const table = await createTableRequest.run({
			table_number,
			user_id: id,
		})

		return response.status(201).json(table)
	}

	public async index(request: Request, response: Response): Promise<Response> {
		const { id } = request.user
		const findTableRequests = container.resolve(FindTableRequestsService)
		const tableRequests = await findTableRequests.run({ user_id: id })
		return response.json(tableRequests)
	}
}
