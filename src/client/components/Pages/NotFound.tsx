import React from 'react'
import { Link } from 'react-router-dom'

export const NotFound = () => {
	return (
		<div className="container">
			<h1>Sorry! Page not found.</h1>
			<hr />
			<Link className="button" to="/">
				<i className="fa fa-fw fa-home"></i>&nbsp; Home
			</Link>
		</div>
	)
}

export default NotFound
