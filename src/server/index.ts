import { resolvers, typeDefs } from './graphql'
import * as config from './config'

import express from 'express'
import path from 'path'
import { ApolloServer, gql } from 'apollo-server-express'
import expressStaticGzip from 'express-static-gzip'

import './store/db'

const serve = expressStaticGzip(path.resolve(__dirname, '../../dist'), {
	enableBrotli: true,
})

const server = new ApolloServer({
	typeDefs,
	// @ts-ignore
	resolvers,
	context: ({ req, res, connection }) => {
		if (connection) {
			return connection.context
		}

		let token: string = ''
		if (req.headers.authorization) {
			const [_, _token] = req.headers.authorization.split(':')
			token = _token.trim()
		}

		return { req, res, token }
	},
})

const app = express()

app.use(serve)
server.applyMiddleware({ app })

app.get('*', (req, res, next) => {
	req.url = '/index.html'
	return serve(req, res, () => {
		res.statusCode = 404
		res.end('404. Page not found!')
	})
})

app.listen({ port: config.HTTP_PORT }, () => {
	console.log(`Server ready at http://localhost:${config.HTTP_PORT}/`)
	console.log(
		`Server ready at http://localhost:${config.HTTP_PORT}${server.graphqlPath}`
	)
})
