import {
	QUERY_FETCH_ME,
	QUERY_FETCH_STORAGES,
	QUERY_FETCH_PRODUCTS,
} from './queries'
import {
	MUTATION_SIGNUP,
	MUTATION_SIGNIN,
	MUTATION_CREATE_STORAGE,
	MUTATION_DELETE_STORAGE,
	MUTATION_MOVE_PRODUCTS,
	MUTATION_DELETE_PRODUCT,
	MUTATION_CREATE_PRODUCT,
} from './mutations'
import { resetToken, setToken, getToken } from './../libs/token'
import fetch from './client'

type TPager = {
	limit?: number
	offset?: number
}

const makeFetchOptions = (overrideOptions = {}) => {
	// @ts-ignore
	const headers = new Headers()
	// @ts-ignore
	headers.append('Authorization', `Token: ${getToken()}`)
	return {
		...overrideOptions,
		mode: 'cors',

		headers,
	}
}

export const processError = result => {
	if (result.errors) {
		throw result.errors[0]
	}
}

export async function signIn(login: string, password: string) {
	const result = await fetch(
		MUTATION_SIGNIN,
		{
			credentials: { login, password },
		},
		makeFetchOptions()
	)

	processError(result)

	const { signIn = null } = result.data || {}

	setToken(signIn.token)
	return signIn
}

export async function signUp(login: string, password: string) {
	const result = await fetch(
		MUTATION_SIGNUP,
		{
			credentials: { login, password },
		},
		makeFetchOptions()
	)

	processError(result)

	const { signUp = null } = result.data || {}

	if (signUp) {
		setToken(signUp.token)
	}

	return signUp
}

export async function signOut() {
	resetToken()
}

export async function me() {
	const result = await fetch(QUERY_FETCH_ME, {}, makeFetchOptions())

	processError(result)

	const { me = null } = result.data || {}
	return me
}

export async function storages(pager?: TPager) {
	const result = await fetch(
		QUERY_FETCH_STORAGES,
		{ pager },
		makeFetchOptions()
	)

	processError(result)

	const { storages = null } = result.data || {}
	return storages
}

export async function products(pager?: TPager) {
	const result = await fetch(
		QUERY_FETCH_PRODUCTS,
		{ pager },
		makeFetchOptions()
	)

	processError(result)

	const { products = null } = result.data || {}

	return products
}

export async function createStorage(storage) {
	const result = await fetch(
		MUTATION_CREATE_STORAGE,
		{ storage },
		makeFetchOptions()
	)

	processError(result)

	const { createStorage = null } = result.data || {}
	return createStorage
}

export async function deleteStorage(id: string) {
	const result = await fetch(
		MUTATION_DELETE_STORAGE,
		{ id },
		makeFetchOptions()
	)

	processError(result)

	const { deleteStorage = null } = result.data || {}

	return deleteStorage
}

export async function updateStorage() {
	const result = await fetch(QUERY_FETCH_PRODUCTS, {})

	processError(result)

	const { signUp = null } = result.data || {}

	if (signUp) {
		setToken(signUp.token)
	}

	return signUp
}

export async function createProduct(product) {
	product.total = parseInt(product.total || 0)

	const result = await fetch(
		MUTATION_CREATE_PRODUCT,
		{ product },
		makeFetchOptions()
	)

	processError(result)

	const { createProduct = null } = result.data || {}
	return createProduct
}

export async function editProduct() {
	const result = await fetch(QUERY_FETCH_PRODUCTS, {})

	processError(result)

	const { signUp = null } = result.data || {}

	if (signUp) {
		setToken(signUp.token)
	}

	return signUp
}

export async function deleteProduct(id: string) {
	const result = await fetch(
		MUTATION_DELETE_PRODUCT,
		{ id },
		makeFetchOptions()
	)

	processError(result)
	const { deleteProduct = null } = result.data || {}
	return deleteProduct
}

export type TTransferInput = {
	from: string
	to?: string
	product?: string
	quantity?: number
}
export async function moveProducts(transfer: TTransferInput) {
	const result = await fetch(
		MUTATION_MOVE_PRODUCTS,
		{ transfer },
		makeFetchOptions()
	)

	processError(result)

	const { moveProducts = null } = result.data || {}

	return moveProducts
}
