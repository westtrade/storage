import { TUser } from './../../src/server/graphql/resolvers'
import { resolvers, typeDefs } from './../../src/server/graphql/index'
import { graphql } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import { reset as fxReset, TEST_TOKEN } from '../../src/tests/fixtures'

import { connection } from '../../src/server/store/db'

import { QUERY_FETCH_ME } from '../../src/client/graphql/queries'
import {
	MUTATION_SIGNUP,
	MUTATION_SIGNIN,
} from '../../src/client/graphql/mutations'

// @ts-ignore
const schema = makeExecutableSchema({ resolvers, typeDefs })

describe('User', () => {
	beforeAll(async () => {
		await connection
		// @ts-ignore
		await fxReset()
	})

	afterAll(async () => {
		// @ts-ignore
		await fxReset()
	})

	test('should signup', async () => {
		const variables = {
			credentials: {
				login: 'demo',
				password: 'demo',
			},
		}

		const result = await graphql(
			schema,
			MUTATION_SIGNUP,
			null,
			{},
			variables
		)
		expect(result.errors).toBeUndefined()
		expect(result.data).toMatchObject({
			signUp: {
				login: 'demo',
			},
		})

		// @ts-ignore
		expect(result.data.signUp.token).toBeTruthy()
	})

	test('should return my data', async () => {
		const context = {
			token: TEST_TOKEN,
		}

		const result = await graphql(schema, QUERY_FETCH_ME, null, context, {})

		expect(result.errors).toBeUndefined()
		expect(result.data).toMatchObject({
			me: {
				login: 'demo',
			},
		})

		// @ts-ignore
		expect(result.data.me.token).toBeTruthy()
	})

	test('should signin', async () => {
		const variables = {
			credentials: {
				login: 'demo',
				password: 'demo',
			},
		}

		const result = await graphql(
			schema,
			MUTATION_SIGNIN,
			null,
			{},
			variables
		)

		expect(result.errors).toBeUndefined()
		expect(result.data).toMatchObject({
			signIn: {
				login: 'demo',
			},
		})

		// @ts-ignore
		expect(result.data.signIn.token).toBeTruthy()
	})
})
