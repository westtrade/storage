import React, { useState, useCallback, useEffect } from 'react'
import { generateArray } from '../../libs/generators'
import styled from 'styled-components'
import classNames from 'classnames'

import Pager from '../DataTable/Pager'

export type TPage = {
	offset?: number
	limit?: number
}
export interface IFetchData {
	(pager: TPage): Promise<any>
}

export type TProps = {
	headers?: string[]
	children?: any
	storageRow?: any
	dataProvider?: IFetchData
	limit?: number
	id?: string
	className?: string
}

export const EmptyWrapper = styled.div`
	font-weight: bold;
	text-align: center;
`

export default function Table({
	headers = [],
	children: Children,
	dataProvider,
	limit = 20,
	storageRow: StorageRow,
	className = '',
	id,
}: TProps) {
	const [isLoading, setLoadingStatus] = useState(true)

	const [table, setTableData] = useState({
		list: [],
		pageInfo: {
			limit,
			offset: 0,
			total: 0,
		},
	})

	const refetchData = useCallback(
		async (offset?: number) => {
			if (!dataProvider) {
				return
			}

			offset =
				typeof offset === 'undefined' ? table.pageInfo.offset : offset

			setLoadingStatus(true)

			try {
				const result = await dataProvider({ offset, limit })

				if (typeof result === 'undefined') {
					throw 'Result not returned!'
				}

				setTableData(result)
			} catch (error) {}

			setLoadingStatus(false)
		},
		[dataProvider]
	)

	useEffect(() => {
		refetchData()
		return () => {}
	}, [])

	const headerElement = headers.length && (
		<thead>
			<tr>
				{headers.map((label, idx) => (
					<th key={idx}>{label}</th>
				))}
			</tr>
		</thead>
	)

	const mapData = (item, idx) => {
		return (
			<StorageRow
				key={idx}
				item={item}
				isLoading={isLoading}
				refetch={refetchData}
			/>
		)
	}

	const loadingPlaceholder = isLoading
		? generateArray(limit).map(mapData)
		: null

	return (
		<>
			{Children && <Children refetch={refetchData}></Children>}
			<table
				id={id}
				className={classNames(
					className,
					table.pageInfo.total <= 0 && 'empty'
				)}
			>
				{headerElement}
				{table.pageInfo.total > 0 ? (
					<tbody>
						{loadingPlaceholder || table.list.map(mapData)}
					</tbody>
				) : (
					<tbody>
						<tr>
							<td colSpan={headers.length}>
								<EmptyWrapper>Empty table</EmptyWrapper>
							</td>
						</tr>
					</tbody>
				)}
			</table>

			{table.pageInfo.total > table.pageInfo.limit && (
				<Pager {...table.pageInfo} setOffset={refetchData}></Pager>
			)}
		</>
	)
}
