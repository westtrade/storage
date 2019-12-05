import { Product } from './../store/Product'
import bcrypt from 'bcryptjs'
import { Storage } from './../store/Storage'
import * as types from './types'
import * as config from '../config'

import assert from 'assert'
import jwt from 'jsonwebtoken'

import { User } from './../store/User'

export type TContext = {
	token?: string
}

export type TUser = {
	login: string
	password?: string
	id: string
	token?: string
}

export type TProduct = {
	id: string
	name: string
	owner?: any
	quantity?: number
	used: number
	total: number
}

export type TProducts = {
	list: types.Product[]
	pageInfo?: types.PageInfo
}

export type TStorage = {
	name: string
	products: TProducts
	owner: TUser
}

export type TProductStorage = {
	storage: TStorage
	quantity: number
}

export type TPager = {
	offset: number
	limit: number
}

const DEFAULT_LIMIT = 10

const getUserFromCtx = async ({ token }: TContext): Promise<TUser> => {
	if (!token) {
		throw 'auth.token:empty'
	}

	const decoded = jwt.verify(token, config.JWT_SECRET) as TUser
	decoded.token = token

	const user = User.findOne({ login: decoded.login })
	if (!user) {
		throw 'auth.not_found'
	}

	return decoded
}

const getPager = (pager: types.PageInfo): TPager => {
	const offset = pager.offset || 0
	const limit = pager.limit || DEFAULT_LIMIT

	return { offset, limit }
}

const updateProducts = async (rawProducts: types.ProductInput[], owner: any) =>
	(
		await Promise.all(
			rawProducts.map(async productInput => {
				if (!productInput) {
					return null
				}

				const productData = {
					...productInput,
					used: productInput.quantity || 0,
				} as TProduct

				if (typeof productData.quantity === 'undefined') {
					productData.quantity = 0
				}

				// @ts-ignore
				if (productData.id) {
					// @ts-ignore
					const product = await Product.findOne({
						_id: productData.id,
					})

					delete productData.id

					if (!product) {
						throw 'product.not_found'
					}

					// @ts-ignore
					productData.used = product.used
					// @ts-ignore
					productData.total = product.total

					const availableDiff = productData.total - productData.used

					if (productData.quantity > availableDiff) {
						throw 'product.quantity:too_much'
					}

					// @ts-ignore
					product.used = product.used + productData.quantity
					await product.save()

					return {
						...productData,
						product: product,
					}
				}

				if (!productData.total) {
					productData.total = productData.quantity || 0
				}

				// const availableDiff =
				// 	storageProduct.total - storageProduct.used
				if (productData.quantity > productData.total) {
					throw 'product.quantity:too_much'
				}

				const product = await Product.create({
					...productData,
					owner,
				})

				return {
					...productInput,
					product: product,
				}
			})
		)
	).filter(Boolean)

const getProductStorages = async (product: TProduct) => {
	const { id } = product
	const productStorages = await Storage.find({
		'products.product': product.id,
	}).populate('owner')

	const storages = productStorages.map(storage => {
		// @ts-ignore
		const storageProduct = storage.products.find(
			(storageProduct: any) =>
				// @ts-ignore
				product.id == storageProduct.product
		)

		const productData = {
			storage: storage.toJSON(),
			quantity: storageProduct ? storageProduct.quantity : 0,
		}
		return productData
	})

	return storages
}

const Mutation: types.MutationResolvers = {
	signUp: async (root, { credentials: { login, password } }) => {
		if (!password) {
			throw 'auth.no_password'
		}

		if (!login) {
			throw 'auth.login:empty'
		}

		const userData = (
			await User.create({
				login,
				password: await bcrypt.hash(password, 8),
			})
		).toJSON() as TUser

		delete userData.password
		// @ts-ignore
		delete userData._id
		// @ts-ignore
		delete userData.__v

		userData.token = jwt.sign(userData, config.JWT_SECRET)
		return userData
	},

	signIn: async (root, { credentials: { login, password } }) => {
		if (!password) {
			throw 'auth.password:empty'
		}

		if (!login) {
			throw 'auth.login:empty'
		}

		const user = await User.findOne({ login })

		if (!user) {
			throw 'auth.not_found'
		}

		const userData = user.toJSON() as TUser

		if (!userData.password) {
			throw 'auth.not_found'
		}

		const isValid = await bcrypt.compare(password, userData.password)
		if (!isValid) {
			throw 'auth.not_found'
		}

		delete userData.password
		// @ts-ignore
		delete userData._id
		// @ts-ignore
		delete userData.__v

		userData.token = jwt.sign({ ...userData }, config.JWT_SECRET)
		return userData
	},

	createStorage: async (root, { storage: storageInput }, ctx) => {
		const user = await getUserFromCtx(ctx)
		if (!storageInput) {
			throw 'storage.data:empty'
		}

		const rawProducts = storageInput.products || []
		delete storageInput.products

		const owner = await User.findOne({ login: user.login })
		if (!owner) {
			throw 'auth.not_found'
		}

		const products = await updateProducts(
			rawProducts as types.ProductInput[],
			owner
		)

		const newStorage = {
			...storageInput,
			owner,
			products,
		}

		const storage = await Storage.create(newStorage)

		let storageData = await Storage.findById(storage.id)
			.populate('owner')
			.populate({
				path: 'products.product',
				model: 'Product',
			})

		if (!storageData) {
			throw 'storage.not_found'
		}

		storageData = storageData.toJSON()
		const result = {
			...storageData,
			products: {
				// @ts-ignore
				list: storageData.products.map(product => {
					return {
						...product,
						...product.product,
					}
				}),
			},
		}

		return result as types.Storage
	},

	deleteStorage: async (root, { id }, ctx) => {
		const user = await getUserFromCtx(ctx)
		if (!id) {
			throw 'storage.id:empty'
		}

		const storage = await Storage.findOne({
			_id: id,
			owner: user.id,
		}).populate({
			path: 'products.product',
			model: 'Product',
		})

		await Promise.all(
			// @ts-ignore
			storage.products.map(async productData => {
				const product = await Product.findOne({
					_id: productData.product.id,
				})

				if (!product) {
					throw 'product.not_found'
				}

				// @ts-ignore
				product.used = product.used - productData.quantity
				return product.save()
			})
		)

		if (!storage) {
			throw 'storage.not_found'
		}

		await Storage.deleteOne(storage)

		return true
	},

	editStorage: async (root, { id, storage: storageInput }, ctx) => {
		if (!storageInput) {
			throw 'storage.data_empty'
		}

		const user = await getUserFromCtx(ctx)

		const existsStorage = await Storage.findOne({
			_id: id,
			owner: user.id,
		}).populate({
			path: 'products.product',
			model: 'Product',
		})

		if (!existsStorage) {
			throw 'storage.not_found'
		}

		await Promise.all(
			// @ts-ignore
			existsStorage.products.map(async productData => {
				const product = await Product.findOne({
					_id: productData.product.id,
				})

				if (!product) {
					throw 'product.not_found'
				}

				// @ts-ignore
				product.used = product.used - productData.quantity
				product.save()
			})
		)

		const rawProducts = storageInput.products || []
		delete storageInput.products

		const owner = await User.findOne({ login: user.login })
		if (!owner) {
			throw 'auth.not_found'
		}

		const products = await updateProducts(
			rawProducts as types.ProductInput[],
			owner
		)

		const newStorage = {
			...storageInput,
			products,
		}

		try {
			await Storage.updateOne({ _id: id }, newStorage)
		} catch (error) {
			throw 'storage.not_found'
		}

		let storageData = await Storage.findOne({
			_id: id,
			owner: user.id,
		})
			.populate('owner')
			.populate({
				path: 'products.product',
				model: 'Product',
			})

		if (!storageData) {
			throw 'storage.not_found'
		}

		storageData = storageData.toJSON()
		const result = {
			...storageData,
			products: {
				// @ts-ignore
				list: storageData.products.map(product => {
					return {
						...product,
						...product.product,
					}
				}),
			},
		}

		return result as types.Storage
	},

	createProduct: async (root, { product: productInput }, ctx) => {
		//  Проверка used = 0, total > 0

		const user = await getUserFromCtx(ctx)
		let product = await Product.create({
			...productInput,
			owner: user.id,
		})

		product = await product.populate('owner').execPopulate()
		const result = product.toJSON() as types.Product
		return result
	},

	editProduct: async (root, { id, product }, ctx) => {
		const user = await getUserFromCtx(ctx)
		const currentProduct = await Product.findOne({
			_id: id,
			owner: user.id,
		})

		if (!currentProduct) {
			throw 'product.not_found'
		}

		//@ts-ignore
		if ('total' in product && product.total < currentProduct.used) {
			throw 'product.total:too_much'
		}

		Object.entries(product).forEach(
			//@ts-ignore
			([key, value]) => (currentProduct[key] = value)
		)

		//@ts-ignore
		await currentProduct.save()
		const resultProduct = await Product.findOne({ _id: id }).populate(
			'owner'
		)

		if (!resultProduct) {
			throw 'product.not_found'
		}

		const productData = resultProduct.toJSON()
		productData.storages = await getProductStorages(productData)

		return productData
	},

	deleteProduct: async (root, { id }, ctx) => {
		const user = await getUserFromCtx(ctx)

		const product = await Product.findOne({
			_id: id,
			owner: user.id,
		})

		if (!product) {
			throw 'product.not_found'
		}

		const storages = await getProductStorages(product.toJSON())
		await Promise.all(
			storages.map(async storageData => {
				const storage = await Storage.findOne({
					_id: storageData.storage.id,
				})

				if (!storage) {
					throw 'storage.not_found'
				}

				//@ts-ignore
				storage.products = storage.products.filter(storageProduct => {
					return storageProduct.product != product.id
				})

				await storage.save()
			})
		)

		await Product.deleteOne({ _id: product.id })
		return true
	},

	moveProducts: async (root, { transfer }, ctx) => {
		const user = await getUserFromCtx(ctx)

		if (transfer.quantity <= 0) {
			throw 'storage.quantity:more_than_zero'
		}

		const fromStorage = await Storage.findOne({
			'_id': transfer.from,
			'owner': user.id,
			'products.product': transfer.product,
		})

		if (!fromStorage) {
			throw 'storage.from:not_found'
		}

		// @ts-ignore
		const productsInfo = fromStorage.products.reduce(
			(result, storageProduct) => {
				if (storageProduct.product == transfer.product) {
					result.current = storageProduct
					return result
				}

				result.products.push(storageProduct)

				return result
			},
			{
				products: [],
				current: null,
			}
		)

		if (productsInfo.current) {
			if (productsInfo.current.quantity < transfer.quantity) {
				throw 'product.quantity:too_much'
			}

			productsInfo.current.quantity =
				productsInfo.current.quantity - transfer.quantity
			if (productsInfo.current.quantity > 0) {
				productsInfo.products.push(productsInfo.current)
			}
		}

		let toStorage
		if (transfer.to) {
			toStorage = await Storage.findOne({
				_id: transfer.to,
				owner: user.id,
			})

			if (!toStorage) {
				throw 'storage.to:not_found'
			}

			let productIndex = toStorage.products.findIndex(product => {
				return product.product == transfer.product
			})

			if (productIndex < 0) {
				toStorage.products.push({
					product: transfer.product,
					quantity: transfer.quantity,
				})
			} else {
				toStorage.products[productIndex].quantity =
					toStorage.products[productIndex].quantity +
					transfer.quantity
			}

			await toStorage.save()
		} else {
			const product = await Product.findOne({ _id: transfer.product })
			if (!product) {
				throw 'product.not_found'
			}

			// @ts-ignore
			product.used = product.used - transfer.quantity
			await product.save()
		}

		//@ts-ignore
		fromStorage.products = productsInfo.products
		await fromStorage.save()

		const storages = await Storage.find({
			_id: [fromStorage.id, toStorage && toStorage.id],
		})
			.populate({
				path: 'products.product',
				model: 'Product',
			})
			.populate('owner')

		const result = storages.map(storage => {
			const storageData = storage.toJSON()
			storageData.products = {
				list: storageData.products.map(product => {
					return { ...product, ...product.product }
				}),
				pageInfo: {
					total: storageData.products.length,
					offset: storageData.products.length,
					limit: storageData.products.length,
				},
			}
			return storageData
		})

		return result as types.Storage[]
	},
}

export const resolvers: types.Resolvers<TContext> = {
	Query: {
		me: async (root, vars, ctx) => {
			return getUserFromCtx(ctx)
		},

		storages: async (root, vars, ctx) => {
			const user = await getUserFromCtx(ctx)

			// @ts-ignore
			const pager = getPager(vars.pager || {})

			const query = { owner: user.id }

			const totalItems = await Storage.count(query)
			const storagesResult = await Storage.find(query)
				.sort([['createdAt', 'descending']])
				.limit(pager.limit)
				.skip(pager.offset)
				.populate('owner')
				.populate({
					path: 'products.product',
					model: 'Product',
				})

			const storages = storagesResult.map(storage => {
				const storageResult = storage.toJSON()
				const result = {
					...storageResult,
					products: {
						list: storageResult.products.map((product: any) => {
							return {
								...product,
								...product.product,
							}
						}),
					},
				}

				return result
			})

			const result = {
				list: storages,
				pageInfo: {
					...pager,
					total: totalItems,
				},
			}

			// @ts-ignore
			return result as types.Storages
		},

		products: async (root, vars, ctx) => {
			const user = await getUserFromCtx(ctx)

			// @ts-ignore
			const pager = getPager(vars.pager || {})

			const query = { owner: user.id }
			const totalItems = await Product.count(query)

			const products = await Product.find(query)
				.sort([['createdAt', 'descending']])
				.populate('owner')
				.limit(pager.limit)
				.skip(pager.offset)

			const resultProducts = await Promise.all(
				products.map(async product => {
					const productData = product.toJSON()

					productData.storages = await getProductStorages(productData)
					return productData as types.Product
				})
			)

			const result = {
				list: resultProducts,
				pageInfo: {
					limit: pager.limit,
					offset: pager.offset,
					total: totalItems,
				},
			} as types.Products

			return result
		},
	},

	Mutation,
}
