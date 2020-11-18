import path from 'path'
import crypto from 'crypto'
import multer, { StorageEngine } from 'multer'

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp')

interface IUploadConfig {
	driver: 's3' | 'disk'

	tmpFolder: string
	uploadsFolder: string
	pdfsFolder: string

	multer: {
		storage: StorageEngine
	}

	config: {
		// eslint-disable-next-line @typescript-eslint/ban-types
		disk: {}
		aws: {
			bucket: string
		}
	}
}

export default {
	driver: process.env.STORAGE_DRIVER || 'disk',

	tmpFolder,
	uploadsFolder: path.resolve(tmpFolder, 'uploads'),
	pdfsFolder: path.resolve(tmpFolder, 'pdfs'),

	multer: {
		storage: multer.diskStorage({
			destination: tmpFolder,
			filename: (request, file, callback) => {
				const fileHash = crypto.randomBytes(10).toString('hex')
				const fileName = `${fileHash}-${file.originalname}`

				return callback(null, fileName)
			},
		}),
	},

	config: {
		disk: {},
		aws: {
			bucket: 'be-system',
		},
	},
} as IUploadConfig
