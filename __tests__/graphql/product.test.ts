import { TProduct } from './../../src/server/graphql/resolvers'
import bcrypt from 'bcryptjs'
import { clean } from './../../src/tests/fixtures'
import { resolvers, typeDefs } from './../../src/server/graphql/index'
import { graphql } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import fixtures, { reset as fxReset } from '../../src/tests/fixtures'

import {
	MUTATION_SIGNIN,
	MUTATION_CREATE_PRODUCT,
	MUTATION_DELETE_PRODUCT,
	MUTATION_EDIT_PRODUCT,
	MUTATION_MOVE_PRODUCTS,
} from './../../src/client/graphql/mutations'

import {
	QUERY_FETCH_PRODUCTS,
	QUERY_FETCH_STORAGES,
} from './../../src/client/graphql/queries'

import { connection } from '../../src/server/store/db'

// @ts-ignore
const schema = makeExecutableSchema({ resolvers, typeDefs })

let TEST_TOKEN = ''

describe('Product', () => {
	beforeAll(async () => {
		await connection
		// @ts-ignore
		await fxReset()

		// @ts-ignore
		const [users] = await fixtures({
			User: [
				{
					login: 'demo',
					password: await bcrypt.hash('test-password', 8),
				},
			],
		})

		const [owner] = users

		//@ts-ignore
		const [products] = await fixtures({
			Product: [
				{
					name: 'Test product 1',
					owner: owner._id,
					total: 50000,
					used: 150,
				},
				{
					name: 'Test product 2',
					owner: owner._id,
					total: 2300,
					used: 66,
				},
			],
		})

		const [testProduct, testProduct2] = products

		//@ts-ignore
		const [storages] = await fixtures({
			Storage: [
				{
					name: 'Test storage 1',
					owner: owner._id,
					products: [
						{
							product: testProduct._id,
							quantity: 50,
						},
						{
							product: testProduct2._id,
							quantity: 22,
						},
					],
				},
				{
					name: 'Test storage 2',
					owner: owner._id,
					products: [
						{
							product: testProduct._id,
							quantity: 50,
						},
						{
							product: testProduct2._id,
							quantity: 22,
						},
					],
				},
				{
					name: 'Test storage 3',
					owner: owner._id,
					products: [
						{
							product: testProduct._id,
							quantity: 50,
						},
						{
							product: testProduct2._id,
							quantity: 22,
						},
					],
				},
			],
		})

		const loginResult = await graphql(
			schema,
			MUTATION_SIGNIN,
			null,
			{},
			{
				credentials: {
					login: 'demo',
					password: 'test-password',
				},
			}
		)

		// @ts-ignore
		TEST_TOKEN = loginResult.data.signIn.token
	})

	afterAll(async () => {
		// @ts-ignore
		await fxReset()
	})

	test('should create product successfully', async () => {
		const context = { token: TEST_TOKEN }
		const name = 'Demo product'
		const total = 100
		const variables = {
			product: { name, total },
		}
		const result = await graphql(
			schema,
			MUTATION_CREATE_PRODUCT,
			null,
			context,
			variables
		)

		expect(result.errors).toBeUndefined()
		expect(result.data).toMatchObject({
			createProduct: {
				name,
				owner: { login: 'demo' },
				total,
			},
		})
		// @ts-ignore
		expect(result.data.createProduct.id).toBeTruthy()
	})

	test('should fetch list', async () => {
		const context = { token: TEST_TOKEN }
		const variables = {
			pager: {
				offset: 0,
				limit: 1,
			},
		}

		const result = await graphql(
			schema,
			QUERY_FETCH_PRODUCTS,
			null,
			context,
			variables
		)

		expect(result.errors).toBeUndefined()
		expect(result.data).toMatchObject({
			products: {
				list: [
					{
						storages: [
							{
								storage: {
									name: 'Test storage 1',
								},
								quantity: 50,
							},
							{
								storage: {
									name: 'Test storage 2',
								},
								quantity: 50,
							},
							{
								storage: {
									name: 'Test storage 3',
								},
								quantity: 50,
							},
						],

						name: 'Test product 1',
						total: 50000,
						used: 150,
					},
				],
			},
		})
	})

	test('should delete product successfully', async () => {
		const context = { token: TEST_TOKEN }

		const resultQuery = await graphql(
			schema,
			QUERY_FETCH_PRODUCTS,
			null,
			context,
			{
				pager: {
					offset: 0,
					limit: 1,
				},
			}
		)

		//@ts-ignore
		const productId = resultQuery.data.products.list[0].id
		const variables = {
			id: productId,
		}

		const mutationResult = await graphql(
			schema,
			MUTATION_DELETE_PRODUCT,
			null,
			context,
			variables
		)

		expect(mutationResult.errors).toBeUndefined()
		// @ts-ignore
		expect(mutationResult.data.deleteProduct).toBe(true)
	})

	test('should move product successfully', async () => {
		const context = { token: TEST_TOKEN }

		const resultQuery = await graphql(
			schema,
			QUERY_FETCH_STORAGES,
			null,
			context,
			{
				pager: {
					offset: 0,
					limit: 2,
				},
			}
		)

		//@ts-ignore
		const [storage1, storage2] = resultQuery.data.storages.list
		const storageProduct = storage1.products.list[0]
		const variables = {
			transfer: {
				from: storage1.id,
				to: storage2.id,
				product: storageProduct.id,
				quantity: storageProduct.quantity,
			},
		}

		const mutationResult = await graphql(
			schema,
			MUTATION_MOVE_PRODUCTS,
			null,
			context,
			variables
		)

		expect(mutationResult.errors).toBeUndefined()
		// @ts-ignore
		expect(mutationResult.data.moveProducts[0].id).toBe(storage1.id)
		// @ts-ignore
		expect(mutationResult.data.moveProducts[0].products.list).toEqual([])
		// @ts-ignore
		expect(mutationResult.data).toMatchObject({
			moveProducts: [
				{
					name: 'Test storage 1',
					owner: {
						login: 'demo',
					},
					products: {
						list: [],
					},
				},
				{
					name: 'Test storage 2',
					owner: {
						login: 'demo',
					},
					products: {
						list: [
							{
								name: 'Test product 2',
								quantity: 44,
								total: 2300,
								used: 66,
							},
						],
					},
				},
			],
		})
		// // @ts-ignore
		// expect(mutationResult.data.editProduct.name).toBe('Changed product')
	})

	test('should move product successfully to unused', async () => {
		const context = { token: TEST_TOKEN }

		const resultQuery = await graphql(
			schema,
			QUERY_FETCH_STORAGES,
			null,
			context,
			{
				pager: {
					offset: 2,
					limit: 1,
				},
			}
		)

		//@ts-ignore
		const [storage1] = resultQuery.data.storages.list
		const storageProduct = storage1.products.list[0]

		const variables = {
			transfer: {
				from: storage1.id,
				product: storageProduct.id,
				quantity: storageProduct.quantity,
			},
		}

		const mutationResult = await graphql(
			schema,
			MUTATION_MOVE_PRODUCTS,
			null,
			context,
			variables
		)

		expect(mutationResult.errors).toBeUndefined()
		// @ts-ignore
		expect(mutationResult.data.moveProducts[0].products.list).toEqual([])
	})

	test('should edit product successfully', async () => {
		const context = { token: TEST_TOKEN }

		const resultQuery = await graphql(
			schema,
			QUERY_FETCH_PRODUCTS,
			null,
			context,
			{
				pager: {
					offset: 0,
					limit: 1,
				},
			}
		)

		//@ts-ignore
		const productId = resultQuery.data.products.list[0].id
		//@ts-ignore
		const totalProductItems = resultQuery.data.products.list[0].total + 50
		const variables = {
			id: productId,
			product: {
				name: 'Changed product',
				total: totalProductItems,
			},
		}

		const mutationResult = await graphql(
			schema,
			MUTATION_EDIT_PRODUCT,
			null,
			context,
			variables
		)

		expect(mutationResult.errors).toBeUndefined()
		// @ts-ignore
		expect(mutationResult.data.editProduct.total).toBe(totalProductItems)
		// @ts-ignore
		expect(mutationResult.data.editProduct.name).toBe('Changed product')
	})
})
