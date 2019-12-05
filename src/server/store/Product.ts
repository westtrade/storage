import mongoose, { Schema } from 'mongoose'

const productSchema = new Schema(
	{
		name: {
			type: 'string',
			required: true,
		},

		total: {
			type: 'number',
			required: true,
			default: 0,
		},

		used: {
			type: 'number',
			required: true,
			default: 0,
		},

		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

export const Product = mongoose.model('Product', productSchema)
