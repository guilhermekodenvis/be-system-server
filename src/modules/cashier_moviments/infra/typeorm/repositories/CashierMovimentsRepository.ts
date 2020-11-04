import IGetMovimentsDTO from '@modules/cashier_moviments/dtos/IGetMovimentsDTO'
import ICashierMovimentDTO from '@modules/cashier_moviments/dtos/IRegisterCashierMovimentDTO'
import ICashierMovimentsRepository from '@modules/cashier_moviments/repositories/ICashierMovimentsRepository'
import { getRepository, Raw, Repository } from 'typeorm'
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

	public async getAllMovimentsOfTheDay({
		date,
		user_id,
	}: IGetMovimentsDTO): Promise<CashierMoviment[]> {
		const { day, month, year } = date
		const parsedDay = String(day).padStart(2, '0')
		const parsedMonth = String(month + 1).padStart(2, '0')

		const cashierMoviments = await this.ormRepository.find({
			where: {
				user_id,
				created_at: Raw(
					dateFieldName =>
						`to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
				),
			},
		})

		return cashierMoviments
	}
}
