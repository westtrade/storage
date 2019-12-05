import React, { useCallback } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

import { generateArray } from '../../libs/generators'

export type TPropsPager = {
	limit?: number
	offset?: number
	total?: number
	setOffset?: any
	className?: string
}

const PagerWrapper = styled.div`
	padding: 10px 0;
	margin: 0 auto;
	margin-bottom: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
`

export default function Pager({
	limit = 20,
	offset = 0,
	total = 0,
	setOffset,
	className = '',
}: TPropsPager) {
	const isFirst = offset === 0
	const isLast = offset + limit >= total

	const overflowedItems = total % limit
	const totalPages =
		(total - overflowedItems) / limit + (overflowedItems > 0 ? 1 : 0)

	const currentOverflowed = !offset ? 0 : offset % limit
	const currentPage = !offset
		? 0
		: (offset - currentOverflowed) / limit + (currentOverflowed > 0 ? 1 : 0)

	const changePage = (page: number) => {
		if (currentPage === page) {
			return
		}
		setOffset(page * limit)
	}

	const pagerLinks = generateArray(totalPages).map(idx => {
		const page = idx + 1
		return (
			<React.Fragment key={idx}>
				<div
					className={classNames(
						'button',
						currentPage === idx ? 'button-outline' : 'button-clear'
					)}
					onClick={() => changePage(page - 1)}
				>
					{page}
				</div>
				{idx < totalPages ? ' ' : ''}
			</React.Fragment>
		)
	})

	const leftItem = (
		<React.Fragment>
			<div
				className={classNames(
					'button',
					currentPage === 0 ? 'button-outline' : 'button-clear'
				)}
				onClick={() => changePage(0)}
			>
				<i className="fa fa-fw fa-chevron-left"></i>
			</div>
			&nbsp;
		</React.Fragment>
	)

	const rightItem = (
		<React.Fragment>
			&nbsp;
			<div
				className={classNames(
					'button',
					currentPage === totalPages - 1
						? 'button-outline'
						: 'button-clear'
				)}
				onClick={() => changePage(totalPages - 1)}
			>
				<i className="fa fa-fw fa-chevron-right"></i>
			</div>
		</React.Fragment>
	)

	return (
		<PagerWrapper className={className}>
			{leftItem}
			{pagerLinks}
			{rightItem}
		</PagerWrapper>
	)
}
