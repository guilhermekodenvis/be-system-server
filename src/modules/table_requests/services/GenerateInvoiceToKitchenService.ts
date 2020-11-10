import { inject, injectable } from 'tsyringe'
import IPDFProvider from '@shared/container/providers/PDFProvider/models/IPDFProvider'
import TableRequest from '../infra/typeorm/schemas/TableRequests'

interface IGenerateDTO {
	tableRequest: TableRequest
}

@injectable()
export default class GenerateInvoiceToKitchenService {
	constructor(
		@inject('PDFProvider')
		private pdfProvider: IPDFProvider,
	) {}

	public async run({ tableRequest }: IGenerateDTO): Promise<string> {
		const productsFormatted = tableRequest.products.map(
			product =>
				`${product.quantity}x - ${product.product_name}\n${product.observation}\n--------------------------\n\n`,
		)

		const productText = productsFormatted.reduce((a, b) => a + b)

		const text = `--------------------------\n\nProdutos da mesa - ${tableRequest.number}\n\n${productText}`

		const fileName = await this.pdfProvider.generatePDF({ text })

		return fileName
	}
}
