import ICashierMovimentDTO from '@modules/cashier_moviments/dtos/IRegisterCashierMovimentDTO'
import ICashierMovimentsRepository from '@modules/cashier_moviments/repositories/ICashierMovimentsRepository'
import { getRepository, Repository } from 'typeorm'
import CashierMoviment from '../entities/CashierMoviment'

// eslint-disable-next-line prettier/prettier
export default class CashierMovimentsRepository implements ICashierMovimentsRepository {

	private ormRepository: Repository<CashierMoviment>

	constructor() {
		this.ormRepository = getRepository(CashierMoviment)
	}

	public async create({
		action,
		user_id,
		value,
	}: ICashierMovimentDTO): Promise<CashierMoviment> {
		const cashierMoviment = this.ormRepository.create({
			value,
			user_id,
			action,
		})

		await this.ormRepository.save(cashierMoviment)

		return cashierMoviment
	}
}
