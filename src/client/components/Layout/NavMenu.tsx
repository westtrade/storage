import React from 'react'
import { NavLink } from 'react-router-dom'

import styled from 'styled-components'

export type TNavMenuItem = {
	to: string
	isActive?: any
	strict?: boolean
	label?: string
}

export type TNavMenuProps = {
	isAuthorized?: boolean
}

const noAuthenticatedMenu = [
	{
		to: '/',
		strict: true,
		isActive: () => {
			return document.location.pathname === '/'
		},
		label: 'Sign In',
	},
	{
		to: '/signup',
		strict: true,
		label: 'Sign Up',
	},
]

const authenticatedMenu = [
	{
		to: '/',
		strict: true,
		isActive: () => {
			return document.location.pathname === '/'
		},
		label: 'Storages',
	},
	{
		to: '/products',
		strict: true,
		label: 'Products',
	},
	{
		to: '/transfer',
		strict: true,
		label: 'Transfer',
	},
]

const LinkWrapper = styled.div`
	display: inline-block;
`

export const NavMenu = ({ isAuthorized }: TNavMenuProps) => {
	const items: TNavMenuItem[] = isAuthorized
		? authenticatedMenu
		: noAuthenticatedMenu

	return (
		<div className="container">
			{items.map((item, idx, all) => {
				const isLast = idx === all.length
				return (
					<LinkWrapper key={`${item.to}_${idx}`}>
						<NavLink
							to={item.to}
							className="button"
							activeClassName="button-clear"
							strict={item.strict}
							isActive={item.isActive}
						>
							{item.label}
						</NavLink>
						&nbsp;
					</LinkWrapper>
				)
			})}

			<hr />
		</div>
	)
}

export default NavMenu
