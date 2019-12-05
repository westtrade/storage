import fs from 'fs'
import path from 'path'
import { gql } from 'apollo-server-express'

export { resolvers } from './resolvers'

export const schema = fs.readFileSync(
	path.resolve(__dirname, 'schema.gql'),
	'utf-8'
)

export const typeDefs = gql`
	${schema}
`
