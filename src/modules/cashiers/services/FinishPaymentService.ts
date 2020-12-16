import IPDFProvider from '@shared/container/providers/PDFProvider/models/IPDFProvider'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'
import { inject, injectable } from 'tsyringe'
import IFinishPaymentDTO from '../dtos/IFinishPaymentDTO'
import actionToActionName from '../enums/actionToActionName'
import convertNumberToBRLCurrency from '../enums/convertNumberToBRLCurrency'

@injectable()
export default class FinishPaymentService {
	constructor(
		@inject('PDFProvider')
		private pdfProvider: IPDFProvider,

		@inject('StorageProvider')
		private storageProvider: IStorageProvider,
	) {}

	public async run({
		payments,
		table,
		total,
	}: IFinishPaymentDTO): Promise<string> {
		// gerar a nota
		const paymentFormatted = payments.map(
			payment =>
				`${actionToActionName(payment.action)} - ${convertNumberToBRLCurrency(
					payment.value,
				)}\n--------------------------\n\n`,
		)

		const paymentInText = paymentFormatted.reduce((a, b) => a + b)
		const text = `xxxxxxxxxxxxxxxxxxxxxxxxxx\n\nPagamento da mesa - ${
			table.number
		}\n\n${paymentInText}\n\nValor total final: ${convertNumberToBRLCurrency(
			total,
		)}`

		const fileName = await this.pdfProvider.generatePDF({ text })

		const finalPath = await this.storageProvider.saveFile(`pdfs/${fileName}`)

		return finalPath
	}
}
