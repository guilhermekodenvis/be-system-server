interface IMailConfig {
	driver: 'ethereal' | 'ses'

	defaults: {
		from: {
			email: string
			name: string
		}
	}
}

export default {
	driver: process.env.MAIL_DRIVER || 'ethereal',

	defaults: {
		from: {
			email: 'gui.sartori96@gmail.com',
			name: 'Guilherme da Black Elephant',
		},
	},
} as IMailConfig
