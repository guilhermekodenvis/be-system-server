import FindAcctualWorkingDateService from '@modules/cashiers/services/FindAcctualWorkingDateService'
import FinishPaymentService from '@modules/cashiers/services/FinishPaymentService'
import GetCashierSituationService from '@modules/cashiers/services/GetCashierSituationService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import uploadConfig from '@config/upload'

export default class CashiersController {
	public async show(request: Request, response: Response): Promise<Response> {
		const { id } = request.user

		const getCashierSituation = container.resolve(GetCashierSituationService)

		const isOpen = await getCashierSituation.run({ user_id: id })

		return response.status(200).json({ isOpen })
	}

	public async index(request: Request, response: Response): Promise<Response> {
		const { id: user_id } = request.user

		const findAcctualWorkingDate = container.resolve(
			FindAcctualWorkingDateService,
		)

		const workingDate = await findAcctualWorkingDate.run(user_id)

		return response.json(workingDate)
	}

	public async finish(request: Request, response: Response): Promise<Response> {
		const { payments, table, total } = request.body

		const finishPayment = container.resolve(FinishPaymentService)

		const invoiceLink = await finishPayment.run({ payments, table, total })

		return response.status(200).json({
			invoice: `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${invoiceLink}`,
		})
	}
}
