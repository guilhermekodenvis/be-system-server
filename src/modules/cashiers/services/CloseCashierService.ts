import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IPDFProvider from '@shared/container/providers/PDFProvider/models/IPDFProvider'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import uploadConfig from '@config/upload'
import { v4 } from 'uuid'
import ICloseCashierDTO from '../dtos/ICloseCashierDTO'
import { CLOSE_CASHIER_MOVIMENT } from '../enums/cashierMovimentActions'
import Cashier from '../infra/typeorm/schemas/Cashier'
import ICashiersRepository from '../repositories/ICashiersRepository'

interface ISendCashierOpenDTO {
	cashier: Cashier
	invoice: string
}
@injectable()
export default class CloseCashierService {
	constructor(
		@inject('CashiersRepository')
		private cashiersRepository: ICashiersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,

		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('PDFProvider')
		private pdfProvider: IPDFProvider,

		@inject('StorageProvider')
		private storageProvider: IStorageProvider,
	) {}

	public async run({
		user_id,
		password,
	}: ICloseCashierDTO): Promise<ISendCashierOpenDTO> {
		const user = await this.usersRepository.findById(user_id)
		if (!user) {
			throw new AppError('Usuário não encontrado')
		}

		const passwordVerify = await this.hashProvider.compareHash(
			password,
			user.password,
		)

		if (!passwordVerify) {
			throw new AppError('A senha não corresponde')
		}

		const cashier = await this.cashiersRepository.findCashierByUserId(user_id)

		if (!cashier) {
			throw new AppError('Caixa não encontrado')
		}

		if (!cashier.is_open) {
			throw new AppError('Não será possível fechar um caixa já fechado.')
		}

		cashier.is_open = false
		cashier.working_dates[cashier.working_dates.length - 1].registers.push({
			action: CLOSE_CASHIER_MOVIMENT,
			key: v4(),
			value: 0,
		})
		await this.cashiersRepository.update(cashier)

		const openCashierText =
			'xxxxxxxxxxxxxxxxxxxxxxxxxx\n\nFechamento do caixa\n\n'

		const fileName = await this.pdfProvider.generatePDF({
			text: openCashierText,
		})

		const finalPath = await this.storageProvider.saveFile(`pdfs/${fileName}`)

		return {
			cashier,
			invoice: `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${finalPath}`,
		}
	}
}
