import React from 'react'
import classNames from 'classnames'

export type TProps = {
	className?: string
	isLoading?: boolean
	children?: any
	type?: 'button' | 'submit' | 'reset'
	onClick?: any
}

export default function Submit({
	className = '',
	isLoading = false,
	children,
	type,
	onClick,
}: TProps) {
	return (
		<button
			type={type}
			className={classNames('button', className)}
			disabled={isLoading}
			onClick={onClick}
		>
			{isLoading ? (
				<i className="fa fa-circle-o-notch fa-spin fa-fw"></i>
			) : (
				children
			)}
		</button>
	)
}
