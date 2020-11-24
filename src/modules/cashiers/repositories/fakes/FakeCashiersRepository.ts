import IGetCashierSituation from '@modules/cashiers/dtos/IGetCashierSituation'
import IRegisterCashierMovimentDTO from '@modules/cashiers/dtos/IRegisterCashierMovimentDTO'
import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository'
import { isAfter, isEqual } from 'date-fns'
import Cashier, {
	CLOSE_CASHIER_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
} from '../../infra/typeorm/entities/Cashier'

// eslint-disable-next-line prettier/prettier
export default class FakeCashiersRepository implements ICashiersRepository {
	private cashiers: Cashier[] = []

	public async create({
		action,
		password,
		user_id,
		value,
	}: IRegisterCashierMovimentDTO): Promise<Cashier> {
		const cashierMoviment = new Cashier()

		Object.assign(cashierMoviment, {
			action,
			password,
			user_id,
			value,
			created_at: new Date(),
		})

		this.cashiers.push(cashierMoviment)

		return cashierMoviment
	}

	public async findLastApperture({
		user_id,
	}: IGetCashierSituation): Promise<Cashier | undefined> {
		const lastAppertureCashier = this.cashiers
			.slice()
			.reverse()
			.find(
				cashier =>
					cashier.user_id === user_id &&
					cashier.action === OPEN_CASHIER_MOVIMENT,
			)

		return lastAppertureCashier
	}

	public async findLastClose({
		user_id,
	}: IGetCashierSituation): Promise<Cashier | undefined> {
		const cashierMoviment = this.cashiers.find(
			cm => cm.user_id === user_id && cm.action === CLOSE_CASHIER_MOVIMENT,
		)

		return cashierMoviment
	}

	public async findAllSinceLastApperture({
		lastAppertureDate,
	}: {
		lastAppertureDate: Date
	}): Promise<Cashier[]> {
		const cashiers = this.cashiers.filter(cashier => {
			console.log(cashier.created_at)
			console.log(lastAppertureDate)
			return (
				isAfter(cashier.created_at, lastAppertureDate) ||
				isEqual(cashier.created_at, lastAppertureDate)
			)
		})

		return cashiers
	}
}
