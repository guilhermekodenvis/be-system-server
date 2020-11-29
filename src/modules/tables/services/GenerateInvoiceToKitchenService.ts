import { inject, injectable } from 'tsyringe'
import IPDFProvider from '@shared/container/providers/PDFProvider/models/IPDFProvider'
import AppError from '@shared/errors/AppError'
import Product from '../infra/typeorm/schemas/Product'

interface IGenerateDTO {
	products: Product[]
	table_number: number
}

@injectable()
export default class GenerateInvoiceToKitchenService {
	constructor(
		@inject('PDFProvider')
		private pdfProvider: IPDFProvider,
	) {}

	public async run({ products, table_number }: IGenerateDTO): Promise<string> {
		if (products.length === 0) {
			throw new AppError('Insira produtos para poder imprimir')
		}
		const productsFormatted = products.map(
			product =>
				`${product.quantity}x - ${product.product_name}\n${
					product.observation || ''
				}\n--------------------------\n\n`,
		)

		const productText = productsFormatted.reduce((a, b) => a + b)

		const text = `--------------------------\n\nProdutos da mesa - ${table_number}\n\n${productText}`

		const fileName = await this.pdfProvider.generatePDF({ text })

		return fileName
	}
}
