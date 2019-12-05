import React, { useContext, useCallback, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import classNames from 'classnames'

import apiContext from '../../../context/ApiContext'

import Table from '../../DataTable/Table'

import Form from '../../Form/Form'
import Input from '../../Form/Input'
import Submit from '../../Form/Submit'

import { makeid } from '../../../libs/generators'

import styled from 'styled-components'

const tableHeaders = ['ID', 'Name', 'Products', '']

export type TCreateForm = {
	onUpdate?: any
}

export type TProductInput = {
	position?: string
	onDelete?: any
}

const ProductInputWrapper = styled.div`
	display: flex;
`

export function ProductInput({ position, onDelete }: TProductInput) {
	return (
		<ProductInputWrapper>
			<Input name={`product.name`} placeholder="Product name"></Input>
			&nbsp;
			<Input
				name={`product.amount`}
				placeholder="Amount"
				type="number"
				defaultValue={0}
			></Input>
			&nbsp;
			{onDelete && (
				<button
					className="button"
					onClick={event => {
						event.preventDefault()
						onDelete(position)
					}}
				>
					<i className="fa fa-fw fa-times"></i>
				</button>
			)}
		</ProductInputWrapper>
	)
}

export function CreateStorageForm({ onUpdate }: TCreateForm) {
	const [products = [], setProducts] = useState<string[]>([])

	const api = useContext(apiContext)

	const addProduct = () => {
		products.push(makeid(5))
		setProducts([...products])
	}

	const deleteProduct = position => {
		setProducts(products.filter((_, idx) => _ !== position))
	}

	return (
		<Form
			className="clearfix"
			onSubmit={async ({ event, values }) => {
				event.preventDefault()

				const products =
					values['product.name'] &&
					Array.isArray(values['product.name'])
						? values['product.name'].map((name, idx) => {
								const quantity = parseInt(
									values['product.amount'][idx]
								)
								return { name, quantity }
						  })
						: values['product.name'] &&
						  values['product.name'].length
						? [
								{
									name: values['product.name'],
									quantity: parseInt(
										values['product.amount']
									),
								},
						  ]
						: []

				// @ts-ignore
				const result = await api.createStorage({
					name: values.name,
					products,
				})

				setProducts([])

				onUpdate && onUpdate()
			}}
		>
			{({ isLoading, error }) => {
				return (
					<>
						{error}
						<Input
							name="name"
							label="Storage name"
							placeholder='e.g "Simple storage"'
						></Input>

						<fieldset>
							<legend>Products</legend>

							<ProductInput></ProductInput>

							{products.map((position, idx) => (
								<ProductInput
									key={idx}
									position={position}
									onDelete={deleteProduct}
								></ProductInput>
							))}

							<Submit
								type="button"
								onClick={event => {
									event.preventDefault()
									addProduct()
								}}
							>
								Add new product
							</Submit>
						</fieldset>

						<Submit isLoading={isLoading} className="float-right">
							Add
						</Submit>
					</>
				)
			}}
		</Form>
	)
}

export type TStorageRow = {
	item: any
	isLoading: boolean
	refetch: any
}

export function StorageRow({ item, isLoading, refetch }: TStorageRow) {
	const api = useContext(apiContext)
	const [isOpen, toggleState] = useState(false)

	const productsToggler =
		!isLoading && item.products.list.length > 0 ? (
			<a
				href="#"
				onClick={event => {
					event.preventDefault()
					toggleState(!isOpen)
				}}
			>
				{item.products.list.length}
				<i
					className={classNames(
						'fa fa-fw ',
						isOpen ? 'fa-chevron-up' : 'fa-chevron-down'
					)}
				></i>
			</a>
		) : (
			0
		)

	return (
		<React.Fragment>
			<tr>
				<td>{isLoading ? <Skeleton /> : item.id}</td>
				<td>{isLoading ? <Skeleton /> : item.name}</td>
				<td>{isLoading ? <Skeleton /> : productsToggler}</td>
				<td>
					{isLoading ? (
						<Skeleton />
					) : (
						<Submit
							type="button"
							className="button-clear button-small"
							onClick={async () => {
								// @ts-ignore
								await api.deleteStorage(item.id)
								await refetch()
							}}
						>
							<i className="fa fa-fw fa-times"></i> Delete
						</Submit>
					)}
				</td>
			</tr>
			{isOpen && !isLoading && item.products.list.length > 0 && (
				<tr>
					<td colSpan={4}>
						<h3>Storage products</h3>
						<table>
							<thead>
								<tr>
									<th>ID</th>
									<th>name</th>
									<th>qty</th>
									<th>used</th>
									<th>total</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{item.products.list.map(product => {
									return (
										<tr key={product.id}>
											<td>{product.id}</td>
											<td>{product.name}</td>
											<td>{product.quantity}</td>
											<td>{product.total}</td>
											<td>{product.used}</td>
											<td>
												<Submit
													type="button"
													className="button-clear button-small"
													onClick={async () => {
														// @ts-ignore
														await api.moveProducts({
															from: item.id,
															product: product.id,
															quantity:
																product.quantity,
														})
														await refetch()
													}}
												>
													<i className="fa fa-fw fa-times"></i>{' '}
													Remove
												</Submit>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</td>
				</tr>
			)}
		</React.Fragment>
	)
}

export default function Storages() {
	const api = useContext(apiContext)

	const fetchData = useCallback(async ({ offset = 0, limit = 20 } = {}) => {
		//@ts-ignore
		const result = await api.storages({
			offset,
			limit,
		})

		return result
	}, [])

	return (
		<div className="container">
			<h2>Storages</h2>
			<hr />

			<Table
				headers={tableHeaders}
				dataProvider={fetchData}
				storageRow={StorageRow}
				limit={5}
				className="storage-table"
			>
				{({ refetch }) => (
					<details>
						<summary>Create Storage</summary>
						<CreateStorageForm
							onUpdate={refetch}
						></CreateStorageForm>
					</details>
				)}
			</Table>
		</div>
	)
}
