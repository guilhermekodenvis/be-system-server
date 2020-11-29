import 'reflect-metadata'
import FakePDFProvider from '@shared/container/providers/PDFProvider/fakes/FakePDFProvider'
import IPDFProvider from '@shared/container/providers/PDFProvider/models/IPDFProvider'
import AppError from '@shared/errors/AppError'
import GenerateInvoiceToKitchenService from './GenerateInvoiceToKitchenService'
import Product from '../infra/typeorm/schemas/Product'

let generateInvoiceToKitchen: GenerateInvoiceToKitchenService
let fakePdfProvider: IPDFProvider

describe('GenerateInvoiceToKitchen', () => {
	beforeEach(() => {
		fakePdfProvider = new FakePDFProvider()
		generateInvoiceToKitchen = new GenerateInvoiceToKitchenService(
			fakePdfProvider,
		)
	})

	it('should be able to generate an invoice', async () => {
		const invoiceName = await generateInvoiceToKitchen.run({
			products: [
				{
					product_id: 'id',
					product_name: 'name',
					product_price: 10,
					observation: 'obs',
					quantity: 2,
				},
				{
					product_id: 'id',
					product_name: 'name',
					product_price: 10,
					quantity: 2,
				} as Product,
			],
			table_number: 10,
		})

		expect(typeof invoiceName).toBe('string')
	})

	it('should not be able to insert products with empty array', async () => {
		await expect(
			generateInvoiceToKitchen.run({
				products: [],
				table_number: 10,
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
