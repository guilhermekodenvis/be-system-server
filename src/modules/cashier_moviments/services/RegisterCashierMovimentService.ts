import { inject, injectable } from 'tsyringe'
import IRegisterCashierMovimentDTO from '../dtos/IRegisterCashierMovimentDTO'
import CashierMoviment from '../infra/typeorm/entities/CashierMoviment'
import ICashierMovimentsRepository from '../repositories/ICashierMovimentsRepository'

@injectable()
export default class RegisterCashierMovimentService {
	constructor(
		@inject('CashierMovimentsRepository')
		private cashierMovimentsRepository: ICashierMovimentsRepository,
	) {}

	public async run({
		value,
		user_id,
		action,
	}: IRegisterCashierMovimentDTO): Promise<CashierMoviment> {
		return this.cashierMovimentsRepository.create({
			value,
			user_id,
			action,
		})
	}
}
