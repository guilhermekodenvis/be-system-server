import { container } from 'tsyringe'

import INFCeEmissorProvider from './models/INFCeEmissorProvider'

import NodeDfeEmissorProvider from './implementations/NodeDfeEmissorProvider'

container.registerSingleton<INFCeEmissorProvider>(
	'NFCeEmissorProvider',
	NodeDfeEmissorProvider,
)
