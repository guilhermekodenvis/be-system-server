import { injectable, inject } from 'tsyringe'
import path from 'path'

import AppError from '@shared/errors/AppError'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import IUsersRepository from '../repositories/IUsersRepository'
import IUserTokensRepository from '../repositories/IUserTokensRepository'

interface IRequest {
	email: string
}

@injectable()
class SendForgotPasswordEmailService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('MailProvider')
		private mailProvider: IMailProvider,

		@inject('UserTokensRepository')
		private userTokensRepository: IUserTokensRepository,
	) {}

	public async execute({ email }: IRequest): Promise<void> {
		const user = await this.usersRepository.findByEmail(email)

		if (!user) {
			throw new AppError('User does not exists.')
		}

		const { token } = await this.userTokensRepository.generate(user.id)

		const forgotPasswordTemplate = path.resolve(
			__dirname,
			'..',
			'views',
			'forgot_password.hbs',
		)

		await this.mailProvider.sendMail({
			subject: 'Troca de senha',
			templateData: {
				file: forgotPasswordTemplate,
				variables: {
					name: user.user_name,
					link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
				},
			},
			to: {
				email: user.email,
				name: user.user_name,
			},
		})
	}
}

export default SendForgotPasswordEmailService
