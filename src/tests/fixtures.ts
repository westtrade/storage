import cbFixtures from 'node-mongoose-fixtures'
import util from 'util'

const fixtures = util.promisify(cbFixtures)

export const save = util.promisify(cbFixtures.save)
export const get = util.promisify(cbFixtures.get)
export const clear = util.promisify(cbFixtures.clear)
export const reset = util.promisify(cbFixtures.reset)

export default fixtures

export const TEST_TOKEN =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImRlbW8iLCJpZCI6IjVkZTNhOWY1YTA2MGI3Mzg1YWEwZDAxYyIsImlhdCI6MTU3NTIwMTI2OX0.gxlFPj_P5qk2TbE-ECaNuMTyaUEE-dlLnnydYmglLrg'

export const clean = (data: any) => JSON.parse(JSON.stringify(data))
