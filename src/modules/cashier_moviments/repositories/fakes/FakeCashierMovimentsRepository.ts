import IGetCashierSituation from '@modules/cashier_moviments/dtos/IGetCashierSituation'
import IGetMovimentsDTO from '@modules/cashier_moviments/dtos/IGetMovimentsDTO'
import IRegisterCashierMovimentDTO from '@modules/cashier_moviments/dtos/IRegisterCashierMovimentDTO'
import ICashierMovimentsRepository from '@modules/cashier_moviments/repositories/ICashierMovimentsRepository'
import { v4 } from 'uuid'
import { isSameDay } from 'date-fns'
import CashierMoviment, {
	CLOSE_CASHIER_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
} from '../../infra/typeorm/entities/CashierMoviment'

// eslint-disable-next-line prettier/prettier
export default class FakeCashierMovimentsRepository implements ICashierMovimentsRepository {
	private cashier_moviments: CashierMoviment[] = []

	public async create(
		data: IRegisterCashierMovimentDTO,
	): Promise<CashierMoviment> {
		const cashierMoviment = new CashierMoviment()

		Object.assign(cashierMoviment, {
			id: v4(),
			data,
		})

		this.cashier_moviments.push(cashierMoviment)

		return cashierMoviment
	}

	public async getAllMovimentsOfTheDay({
		date,
		user_id,
	}: IGetMovimentsDTO): Promise<CashierMoviment[]> {
		const moviments = this.cashier_moviments.filter(
			cm => cm.user_id === user_id && isSameDay(cm.created_at, date),
		)

		return moviments
	}

	public async getLastApperture({
		user_id,
	}: IGetCashierSituation): Promise<CashierMoviment | undefined> {
		const cashierMoviment = this.cashier_moviments.find(
			cm => cm.user_id === user_id && cm.action === OPEN_CASHIER_MOVIMENT,
		)

		return cashierMoviment
	}

	public async getLastClose({
		user_id,
	}: IGetCashierSituation): Promise<CashierMoviment | undefined> {
		const cashierMoviment = this.cashier_moviments.find(
			cm => cm.user_id === user_id && cm.action === CLOSE_CASHIER_MOVIMENT,
		)

		return cashierMoviment
	}
}
