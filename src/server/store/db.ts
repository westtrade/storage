import mongoose from 'mongoose'
import * as config from '../config'

export const connection = mongoose.connect(config.MONGODB_URI, {
	useNewUrlParser: true,
	// useUnifiedTopology: true,
})

mongoose.connection.on('open', () => {
	console.log(`DB ${config.MONGODB_URI} connected.`)
})

mongoose.set('toJSON', { getters: true, virtuals: true })
