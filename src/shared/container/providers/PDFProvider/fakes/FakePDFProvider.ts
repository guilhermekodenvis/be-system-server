import IGeneratePDFDTO from '../dtos/IGeneratePDFDTO'
import IPDFProvider from '../models/IPDFProvider'

export default class FakePDFProvider implements IPDFProvider {
	public async generatePDF(data: IGeneratePDFDTO): Promise<string> {
		return 'pdf-name'
	}
}
