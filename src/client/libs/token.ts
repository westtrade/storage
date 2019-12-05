import localStorage from 'local-storage-fallback'
import { useState, useEffect } from 'react'

const TOKEN_KEY = '_t'

let watchers = [] as any[]
const removeListener = listener => {
	watchers = watchers.filter(_ => _ !== listener)
}

export const getToken = () => {
	return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (authToken?: string | null) => {
	token = authToken || null

	watchers.forEach(watcher => watcher(authToken))

	return authToken
		? localStorage.setItem(TOKEN_KEY, authToken)
		: localStorage.removeItem(TOKEN_KEY)
}

export const resetToken = () => setToken(null)

export let token = getToken()

export function useToken(): string | null {
	const [token, setToken] = useState(getToken())
	useEffect(() => {
		watchers.push(token => {
			setToken(token)
		})

		return () => {
			removeListener(setToken)
		}
	}, [])

	return token
}
