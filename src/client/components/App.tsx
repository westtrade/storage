import React from 'react'
import { Link, Switch, Route, NavLink } from 'react-router-dom'

import Navbar from './Layout/Navbar'
import NavMenu from './Layout/NavMenu'

import ApiContext from '../context/ApiContext'

import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'

import Storages from './Pages/Storages/Storages'
import Products from './Pages/Products/Products'
import Transfer from './Pages/Transfer/Transfer'
import NotFound from './Pages/NotFound'

import styled from 'styled-components'

const Space = styled.div`
	height: 82px;
`

export interface IUseToken {
	(): string | null
}

export type TProps = {
	api: any
	useToken: IUseToken
}

export const AuthenticatedContent = () => {
	return (
		<>
			<Switch>
				<Route path="/transfer" exact component={Transfer}></Route>
				<Route path="/products" exact component={Products}></Route>
				<Route path="/" exact component={Storages}></Route>
				<Route component={NotFound}></Route>
			</Switch>
		</>
	)
}

const NotAuthenticatedContent = () => {
	return (
		<>
			<Switch>
				<Route path="/signup" component={SignUp}></Route>
				<Route path="/" exact component={SignIn}></Route>
				<Route component={NotFound}></Route>
			</Switch>
		</>
	)
}

export default function App({ useToken, api }: TProps) {
	const token = useToken && useToken()
	const userAuthenticated = !!token

	const ContentComponent = userAuthenticated
		? AuthenticatedContent
		: NotAuthenticatedContent

	return (
		<>
			<ApiContext.Provider value={api}>
				<Navbar isAuthorized={userAuthenticated}></Navbar>
				<Space></Space>
				<NavMenu isAuthorized={userAuthenticated} />
				<ContentComponent></ContentComponent>
			</ApiContext.Provider>
		</>
	)
}
