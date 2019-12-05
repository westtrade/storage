import { TProduct } from './../../src/server/graphql/resolvers'
import bcrypt from 'bcryptjs'
import { clean } from './../../src/tests/fixtures'
import { resolvers, typeDefs } from './../../src/server/graphql/index'
import { graphql } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import fixtures, { reset as fxReset } from '../../src/tests/fixtures'

import { connection } from '../../src/server/store/db'

import { QUERY_FETCH_STORAGES } from './../../src/client/graphql/queries'
import {
	MUTATION_CREATE_STORAGE,
	MUTATION_DELETE_STORAGE,
	MUTATION_UPDATE_STORAGE,
	MUTATION_SIGNIN,
} from './../../src/client/graphql/mutations'

// @ts-ignore
const schema = makeExecutableSchema({ resolvers, typeDefs })

let TEST_TOKEN = ''
let existsProducts: TProduct[] = []

describe('Storage', () => {
	beforeAll(async () => {
		await connection
		// @ts-ignore
		await fxReset()

		//@ts-ignore
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
					used: 50,
				},
				{
					name: 'Test product 2',
					owner: owner._id,
					total: 2300,
					used: 22,
				},
			],
		})

		existsProducts = products

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

	test('should create successfully', async () => {
		const context = {
			token: TEST_TOKEN,
		}

		const variables = {
			storage: {
				name: 'Demo',
			},
		}

		const result = await graphql(
			schema,
			MUTATION_CREATE_STORAGE,
			null,
			context,
			variables
		)

		expect(result.errors).toBeUndefined()
		expect(result.data).toMatchObject({
			createStorage: {
				name: 'Demo',
				owner: { login: 'demo' },
			},
		})

		// @ts-ignore
		expect(result.data.createStorage.id).toBeTruthy()
	})

	test('should create with products successfully', async () => {
		const context = {
			token: TEST_TOKEN,
		}

		const currentProduct = existsProducts[0]

		const quantityOfProduct = 100
		const variables = {
			storage: {
				name: 'Demo',
				products: [
					{
						name: 'Apple',
						quantity: quantityOfProduct,
					},

					{
						id: currentProduct.id,
						name: currentProduct.name,
						quantity: 300,
					},
				],
			},
		}

		const result = await graphql(
			schema,
			MUTATION_CREATE_STORAGE,
			null,
			context,
			variables
		)

		expect(result.errors).toBeUndefined()
		expect(result.data).toMatchObject({
			createStorage: {
				name: 'Demo',
				owner: { login: 'demo' },

				products: {
					list: [
						{
							quantity: quantityOfProduct,
							name: 'Apple',
							total: quantityOfProduct,
							used: quantityOfProduct,
						},
						{
							quantity: 300,
							name: currentProduct.name,
							total: currentProduct.total,
							used: 300 + (currentProduct.used || 0),
						},
					],
				},
			},
		})
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
			QUERY_FETCH_STORAGES,
			null,
			context,
			variables
		)

		expect(result.errors).toBeUndefined()
		expect(result.data).toMatchObject({
			storages: {
				list: [
					{
						name: 'Test storage 1',
						products: {
							list: [
								{
									quantity: 50,
									name: 'Test product 1',
								},
								{
									quantity: 22,
									name: 'Test product 2',
								},
							],
						},
					},
				],
			},
		})
	})

	test('should delete storage successfully', async () => {
		const context = { token: TEST_TOKEN }
		const variables = {
			pager: {
				offset: 0,
				limit: 1,
			},
		}

		const result = await graphql(
			schema,
			QUERY_FETCH_STORAGES,
			null,
			context,
			variables
		)

		const mutationResult = await graphql(
			schema,
			MUTATION_DELETE_STORAGE,
			null,
			context,
			{
				// @ts-ignore
				id: result.data.storages.list[0].id,
			}
		)

		expect(mutationResult.errors).toBeUndefined()
		// @ts-ignore
		expect(mutationResult.data.deleteStorage).toBe(true)
	})

	test('should update storage successfully', async () => {
		const context = { token: TEST_TOKEN }
		const variables = {
			pager: {
				offset: 0,
				limit: 1,
			},
		}

		const result = await graphql(
			schema,
			QUERY_FETCH_STORAGES,
			null,
			context,
			variables
		)

		// @ts-ignore
		const storageId: string = result.data.storages.list[0].id

		// @ts-ignore
		const product = result.data.storages.list[0].products.list[0]
		const mutationResult = await graphql(
			schema,
			MUTATION_UPDATE_STORAGE,
			null,
			context,
			{
				id: storageId,
				storage: {
					name: 'Changed storage',
					products: [
						{
							id: product.id,
							quantity: 30,
							name: product.name,
						},
						{
							name: 'New created product',
							quantity: 500,
						},
					],
				},
			}
		)

		expect(mutationResult.errors).toBeUndefined()
		expect(mutationResult.data).toMatchObject({
			editStorage: {
				id: storageId,
				name: 'Changed storage',
				products: {
					list: [
						{
							name: product.name,
							quantity: 30,
							total: product.total,
							used: product.used - product.quantity + 30,
						},
						{
							name: 'New created product',
							quantity: 500,
							total: 500,
							used: 500,
						},
					],
				},
			},
		})

		// @ts-ignore
		// expect(mutationResult.data.deleteStorage).toBe(true)
	})
})
