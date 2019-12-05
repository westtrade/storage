import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import ApiContext from '../../context/ApiContext.ts'

const NavbarWrapper = styled.nav`
	background: #f4f5f6;
	border-bottom: 0.1rem solid #d1d1d1;
	display: block;
	height: 5.2rem;
	left: 0;
	max-width: 100%;
	position: fixed;
	right: 0;
	top: 0;
	width: 100%;
	z-index: 1;
	line-height: 5.2rem;
	text-align: center;
	font-weight: 800;
`

const NavbarContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`

export type TProps = {
	isAuthorized?: boolean
}

export default function Navbar({ isAuthorized }: TProps) {
	const api = useContext(ApiContext)

	const logout = useCallback(event => {
		event.preventDefault()

		// @ts-ignore
		api.signOut()
	}, [])

	return (
		<NavbarWrapper>
			<div className="container">
				<NavbarContainer>
					<span />
					<Link to="/">Inventory Control</Link>

					{isAuthorized ? (
						<a href="#" onClick={logout}>
							<i className="fa fa-fw fa-sign-out"></i>
							Logout
						</a>
					) : (
						<span />
					)}
				</NavbarContainer>
			</div>
		</NavbarWrapper>
	)
}
