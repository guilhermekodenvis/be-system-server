import { Empresa, NFCeDocumento, NFeDocumento } from 'node-dfe'

export default interface IGenerateNFCe {
	company: Empresa
	nfce: NFeDocumento
}
