import IGenerateNFCe from '../dtos/IGenerateNFCe'

export default interface INFCeEmissorProvider {
	generateNFCe(data: IGenerateNFCe): Promise<string>
}
