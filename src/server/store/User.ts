import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
	login: {
		type: 'string',
		required: true,
		unique: true,
	},
	password: {
		type: 'string',
		reqiured: true,
	},
})

export const User = mongoose.model('User', userSchema)
