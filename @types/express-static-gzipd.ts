declare module 'express-static-gzip' {
	import * as express from 'express'

	export type TCompressionOptions = {
		encodingname: string
		fileExtension: string
	}

	export type TServeStatic = {
		maxAge?: number
		cacheControl?: boolean
	}

	export type TCompressTypes = 'br' | 'gz'

	export type TOptions = {
		enableBrotli?: boolean
		maxAge?: number
		index?: boolean | string
		serveStatic?: TServeStatic
		customCompressions?: TCompressionOptions[]
		orderPreference?: TCompressTypes[]
	}

	export default function(path: string, options?: TOptions): any
}
