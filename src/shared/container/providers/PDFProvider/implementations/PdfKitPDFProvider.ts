import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import uploadConfig from '@config/upload'
import IPDFProvider from '../models/IPDFProvider'
import IGeneratePDFDTO from '../dtos/IGeneratePDFDTO'

export default class PdfKitPDFProvider implements IPDFProvider {
	private document: PDFKit.PDFDocument

	private uploadPath: string

	constructor() {
		this.uploadPath = uploadConfig.pdfsFolder
	}

	public async generatePDF({ text }: IGeneratePDFDTO): Promise<string> {
		this.document = new PDFDocument({
			size: [300, 400],
			margins: { top: 15, left: 15, right: 15, bottom: 15 },
		})
		const fileName = `${Date.now()}.pdf`

		this.document.pipe(
			fs.createWriteStream(path.resolve(`${this.uploadPath}`, fileName)),
		)

		this.document.fontSize(16).font('Courier').text(text, {
			align: 'left',
			columns: 1,
		})

		// this.document.text(text)

		this.document.end()

		return fileName
	}
}
