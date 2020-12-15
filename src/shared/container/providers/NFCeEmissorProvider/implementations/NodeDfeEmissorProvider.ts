import AppError from '@shared/errors/AppError'
import { NFeProcessor } from 'node-dfe'
import IGenerateNFCe from '../dtos/IGenerateNFCe'
import INFCeEmissorProvider from '../models/INFCeEmissorProvider'

export default class NodeDfeEmissorProvider implements INFCeEmissorProvider {
	public async generateNFCe({ company, nfce }: IGenerateNFCe): Promise<string> {
		const nfeProcessor = new NFeProcessor(company)
		const docEmitido = await nfeProcessor.processarDocumento(nfce)

		if (!docEmitido.success) {
			throw new AppError('deu ruim hihihi')
		} else {
			const env = docEmitido.envioNF
			console.log(env.xml_recebido)
			// console.log(env.data.retEnviNFe.protNFe.infProt.nProt)
		}
		return ''
	}
}
