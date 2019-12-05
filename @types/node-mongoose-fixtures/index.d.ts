declare module 'node-mongoose-fixtures' {
	export interface IData {
		[key: string]: any
	}

	export interface ICallback {
		(err: Error, data: any): any
	}

	export interface IFixtures {
		(dataset: IData, callback?: ICallback): any
		save(name: String, dataset: IData, callback?: ICallback): any
		get(name: String, callback?: ICallback): any
		clear(name?: String, callback?: ICallback): any
		reset(name?: String, callback?: ICallback): any
	}

	const fixtures: IFixtures
	export default fixtures
}
