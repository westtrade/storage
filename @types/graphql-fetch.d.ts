declare module 'graphql-fetch' {
	type TFetchOptions = {}

	export interface IFetch {
		(query: string, vars?: any, opts?: TFetchOptions): Promise<any>
	}

	export default function makeClient(endpointUrl: string): IFetch
}
