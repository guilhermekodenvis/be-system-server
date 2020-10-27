import ICashierMovimentDTO from '@modules/cashier_moviments/dtos/ICashierMovimentDTO'
import ICashierMovimentsRepository from '@modules/cashier_moviments/repositories/ICashierMovimentsRepository'
import { v4 } from 'uuid'
import CashierMoviment from '../../infra/typeorm/entities/CashierMoviment'

// eslint-disable-next-line prettier/prettier
export default class FakeCashierMovimentsRepository implements ICashierMovimentsRepository {
	private cashier_moviments: CashierMoviment[] = []

	public async create(data: ICashierMovimentDTO): Promise<CashierMoviment> {
		const cashierMoviment = new CashierMoviment()

		Object.assign(cashierMoviment, {
			id: v4(),
			data,
		})

		this.cashier_moviments.push(cashierMoviment)

		return cashierMoviment
	}
}
