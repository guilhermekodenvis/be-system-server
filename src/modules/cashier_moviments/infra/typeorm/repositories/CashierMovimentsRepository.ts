import IGetCashierSituation from '@modules/cashier_moviments/dtos/IGetCashierSituation'
import IGetMovimentsDTO from '@modules/cashier_moviments/dtos/IGetMovimentsDTO'
import ICashierMovimentDTO from '@modules/cashier_moviments/dtos/IRegisterCashierMovimentDTO'
import ICashierMovimentsRepository from '@modules/cashier_moviments/repositories/ICashierMovimentsRepository'
import { getRepository, Raw, Repository } from 'typeorm'
import CashierMoviment, {
	CLOSE_CASHIER_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
} from '../entities/CashierMoviment'

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

	public async getLastApperture({
		user_id,
	}: IGetCashierSituation): Promise<CashierMoviment | undefined> {
		const lastApperture = await this.ormRepository.findOne({
			where: {
				action: OPEN_CASHIER_MOVIMENT,
			},
			order: {
				created_at: 'DESC',
			},
		})

		return lastApperture
	}

	public async getLastClose({
		user_id,
	}: IGetCashierSituation): Promise<CashierMoviment | undefined> {
		const lastClose = await this.ormRepository.findOne({
			where: {
				action: CLOSE_CASHIER_MOVIMENT,
			},
			order: {
				created_at: 'DESC',
			},
		})

		return lastClose
	}
}
