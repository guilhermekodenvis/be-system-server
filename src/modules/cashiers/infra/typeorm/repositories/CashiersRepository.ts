import IGetCashierSituation from '@modules/cashiers/dtos/IGetCashierSituation'
import IGetMovimentsDTO from '@modules/cashiers/dtos/IGetMovimentsDTO'
import ICashierMovimentDTO from '@modules/cashiers/dtos/IRegisterCashierMovimentDTO'
import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository'
import { getRepository, Raw, Repository } from 'typeorm'
import Cashier, {
	CLOSE_CASHIER_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
} from '../entities/Cashier'

// eslint-disable-next-line prettier/prettier
export default class CashiersRepository implements ICashiersRepository {
	private ormRepository: Repository<Cashier>

	constructor() {
		this.ormRepository = getRepository(Cashier)
	}

	public async create({
		action,
		user_id,
		value,
	}: ICashierMovimentDTO): Promise<Cashier> {
		const cashierMoviment = this.ormRepository.create({
			value,
			user_id,
			action,
		})

		await this.ormRepository.save(cashierMoviment)

		return cashierMoviment
	}

	public async findAllMovimentsOfTheDay({
		date,
		user_id,
	}: IGetMovimentsDTO): Promise<Cashier[]> {
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

	public async findLastApperture({
		user_id,
	}: IGetCashierSituation): Promise<Cashier | undefined> {
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

	public async findLastClose({
		user_id,
	}: IGetCashierSituation): Promise<Cashier | undefined> {
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
