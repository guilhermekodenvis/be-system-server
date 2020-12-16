import 'reflect-metadata'
import 'dotenv/config'
import 'express-async-errors'

import path from 'path'

import SESMailProvider from '@shared/container/providers/MailProvider/implementations/SESMailProvider'
import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider'

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { errors } from 'celebrate'

import uploadConfig from '@config/upload'
import rateLimiter from './middlewares/rateLimiter'
import routes from './routes'

import '@shared/infra/typeorm'
import '@shared/container'

const PORT = process.env.PORT || 3333
const app = express()

app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.pdfsFolder))
app.use('/images', express.static(uploadConfig.uploadsFolder))
app.use(rateLimiter)
app.use(routes)

app.use(errors())

app.use(
	async (err: Error, request: Request, response: Response, _: NextFunction) => {
		// if (err instanceof AppError) {
		const mailProvider = new SESMailProvider(
			new HandlebarsMailTemplateProvider(),
		)
		const errorTemplate = path.resolve(__dirname, 'views', 'error_template.hbs')

		await mailProvider.sendMail({
			to: {
				email: 'gui.sartori96@gmail.com',
				name: 'Guilherme Sartori',
			},
			subject: 'erro interno',
			templateData: {
				file: errorTemplate,
				variables: {
					name: 'Guilherme',
					error: err.message,
				},
			},
		})

		return response.status(500).json({
			status: 'error',
			message: err.message,
		})
	},
)

app.listen(PORT, () => console.log(`🐘 - Server is running on port ${PORT}...`))
