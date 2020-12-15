import IPDFProvider from '@shared/container/providers/PDFProvider/models/IPDFProvider'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IRequestCreateRegisterInTableDTO from '../dtos/IRequestCreateRegisterInTableDTO'
import ITablesRepository from '../repositories/ITableRequestsRepository'

@injectable()
export default class InsertProductsIntoTableService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITablesRepository,

		@inject('PDFProvider')
		private pdfProvider: IPDFProvider,

		@inject('StorageProvider')
		private storageProvider: IStorageProvider,
	) {}

	public async run({
		table_id,
		products,
		user_id,
	}: IRequestCreateRegisterInTableDTO): Promise<string> {
		const tableRequest = await this.tableRequestsRepository.findOneByTableId(
			table_id,
		)

		if (!tableRequest) {
			throw new AppError('invalid table id')
		}

		products.forEach(product => {
			if (tableRequest.products) {
				tableRequest.products.push(product)
			} else {
				tableRequest.products = [product]
			}
		})
		await this.tableRequestsRepository.update({ tableRequest })

		const productsFormatted = products.map(
			product =>
				`${product.quantity}x - ${product.product_name}\n${
					product.observation || ''
				}\n--------------------------\n\n`,
		)

		const productText = productsFormatted.reduce((a, b) => a + b)

		const text = `xxxxxxxxxxxxxxxxxxxxxxxxxx\n\nProdutos da mesa - ${tableRequest.number}\n\n${productText}`

		const fileName = await this.pdfProvider.generatePDF({ text })

		const finalPath = await this.storageProvider.saveFile(`pdfs/${fileName}`)

		return finalPath
	}
}
