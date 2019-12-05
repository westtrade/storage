import mongoose, { Schema } from 'mongoose'

const storageSchema = new Schema(
	{
		name: {
			type: 'String',
			required: true,
		},

		products: [
			{
				product: { type: Schema.Types.ObjectId, ref: 'Product' },
				quantity: {
					type: 'number',
					default: 0,
					required: true,
				},
			},
		],

		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
)

export const Storage = mongoose.model('Storage', storageSchema)
