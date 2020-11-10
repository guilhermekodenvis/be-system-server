import { container } from 'tsyringe'

import IPDFProvider from './models/IPDFProvider'

import PdfKitPDFProvider from './implementations/PdfKitPDFProvider'

container.registerSingleton<IPDFProvider>('PDFProvider', PdfKitPDFProvider)
