import IGeneratePDFDTO from '../dtos/IGeneratePDFDTO'

export default interface IPDFProvider {
	generatePDF(data: IGeneratePDFDTO): Promise<string>
}
