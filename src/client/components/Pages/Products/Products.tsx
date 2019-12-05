import React, { useContext, useCallback, useState } from 'react'

import apiContext from '../../../context/ApiContext'

import Table from '../../DataTable/Table'

import ProductRow from './ProductRow'
import CreateProductForm from './CreateProductForm'

const tableHeaders = ['ID', 'Name', 'Storages', 'Used', 'Total', '']

export default function Products() {
	const api = useContext(apiContext)

	const fetchData = useCallback(
		async ({ offset = 0, limit = 20 } = {}) =>
			//@ts-ignore
			api.products({ offset, limit }),
		[]
	)

	return (
		<div className="container">
			<h2>Products</h2>
			<hr />

			<Table
				headers={tableHeaders}
				dataProvider={fetchData}
				storageRow={ProductRow}
				limit={5}
				className="storage-table"
			>
				{({ refetch }) => (
					<details>
						<summary>Create Product</summary>
						<CreateProductForm
							onUpdate={refetch}
						></CreateProductForm>
					</details>
				)}
			</Table>
		</div>
	)
}
