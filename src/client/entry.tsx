import 'milligram'

import ReactDOM from 'react-dom'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import './common.css'

import * as api from './graphql/api'
import * as token from './libs/token.ts'

import App from './components/App'

function main() {
	const rootElement = document.getElementById('app')
	if (!rootElement) {
		throw 'Root element #app not found!'
	}

	ReactDOM.render(
		<Router>
			<App api={api} useToken={token.useToken} />
		</Router>,
		rootElement
	)
}

main()
