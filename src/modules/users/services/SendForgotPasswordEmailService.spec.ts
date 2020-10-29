import 'dotenv/config'
import AppError from '@shared/errors/AppError'

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeMailProvider: FakeMailProvider
let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository()
		fakeMailProvider = new FakeMailProvider()
		fakeUserTokensRepository = new FakeUserTokensRepository()

		sendForgotPasswordEmail = new SendForgotPasswordEmailService(
			fakeUsersRepository,
			fakeMailProvider,
			fakeUserTokensRepository,
		)
	})

	it('should be able to recover the password using the email', async () => {
		const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

		await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		await sendForgotPasswordEmail.execute({
			email: 'mae@do.nobrega',
		})

		expect(sendMail).toHaveBeenCalled()
	})

	it('should not be able to recover a non-existing user password', async () => {
		await expect(
			sendForgotPasswordEmail.execute({
				email: 'johndoe@example.com',
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should generate a forgot passsword token', async () => {
		const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

		const user = await fakeUsersRepository.create({
			restaurant_name: 'Comidinhas Vinhedo',
			user_name: 'Mãe do Nobrega',
			email: 'mae@do.nobrega',
			password: '123456',
			cnpj: '12333444555512',
		})

		await sendForgotPasswordEmail.execute({
			email: 'mae@do.nobrega',
		})

		expect(generateToken).toHaveBeenCalledWith(user.id)
	})
})
