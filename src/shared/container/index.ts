import { container } from 'tsyringe'

import '@modules/users/providers'
import './providers'

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import IProductsRepository from '@modules/products/repositories/IProductsRepository'
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository'

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository'

import ITablesRepository from '@modules/tables/repositories/ITableRequestsRepository'
import TableRequestsRepository from '@modules/tables/infra/typeorm/repositories/TableRequestsRepository'

import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository'
import CashiersRepository from '@modules/cashiers/infra/typeorm/repositories/CashiersRepository'

container.registerSingleton<IUsersRepository>(
	'UsersRepository',
	UsersRepository,
)

container.registerSingleton<IUserTokensRepository>(
	'UserTokensRepository',
	UserTokensRepository,
)

container.registerSingleton<IProductsRepository>(
	'ProductsRepository',
	ProductsRepository,
)

container.registerSingleton<INotificationsRepository>(
	'NotificationsRepository',
	NotificationsRepository,
)

container.registerSingleton<ICashiersRepository>(
	'CashiersRepository',
	CashiersRepository,
)

container.registerSingleton<ITablesRepository>(
	'TableRequestsRepository',
	TableRequestsRepository,
)
