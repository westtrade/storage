import React, { useState, useContext, useEffect, useCallback } from 'react'
import apiContext from '../../../context/ApiContext.ts'

import StorageSelector from '../../Form/StorageSelector'
import Form from '../../Form/Form'
import Submit from '../../Form/Submit'
import Input from '../../Form/Input'

import styled from 'styled-components'

const TransferRow = styled.div`
	display: flex;
	flex-direction: row;
`

export const Transfer = () => {
	const api = useContext(apiContext)
	const [state, setState] = useState({
		from: '',
		to: '',
		products: [],
	})

	const updateProducts = async () => {
		//@ts-ignore
		const result = await api.products({
			limit: 1000,
		})
		setProductsList(result.list)
	}

	const moveProducts = async ({ event, error, values }) => {
		event.preventDefault()
		values.quantity = parseInt(values.quantity)
		// @ts-ignore
		const result = await api.moveProducts(values)

		await updateProducts()
		return result
	}

	const [products, setProductsList] = useState([])

	useEffect(() => {
		updateProducts()
		return () => {}
	}, [state.from])

	const TransferItemRow = ({ isLoading, product }) => {
		const storage = product.storages.find(storage => {
			return storage.storage.id === state.from
		})

		return (
			<TransferRow>
				<Input name="from" type="hidden" value={state.from}></Input>
				<Input name="to" type="hidden" value={state.to}></Input>
				<Input name="product" type="hidden" value={product.id}></Input>
				<Input
					name="name"
					value={product.name}
					disabled
					className="float-left"
				></Input>
				<Input
					name="name"
					value={storage.quantity}
					disabled
					className="float-left"
				></Input>
				<Input
					name="quantity"
					defaultValue={0}
					min={1}
					max={product.total - product.used}
				></Input>
				<Submit isLoading={isLoading}>Transfer</Submit>
			</TransferRow>
		)
	}

	const FormInner = (products as any[])
		.filter(product => {
			const storageIndex = product.storages.findIndex(
				storage => storage.storage.id == state.from
			)

			return storageIndex >= 0
		})
		.map(product => {
			return (
				// @ts-ignore
				<Form key={product.id} onSubmit={moveProducts}>
					{props => TransferItemRow({ ...props, product })}
				</Form>
			)
		})

	return (
		<div className="container">
			<StorageSelector
				name="from"
				label="Storage from"
				value={state.from}
				onChange={event => {
					setState({
						...state,
						from: event.target.value,
					})
				}}
				excludeStorage={state.to}
			></StorageSelector>

			{state.from && (
				<StorageSelector
					name="to"
					label="Storage to"
					value={state.to}
					onChange={event => {
						setState({
							...state,
							to: event.target.value,
						})
					}}
					excludeStorage={state.from}
				></StorageSelector>
			)}

			<hr />

			{state.from && (
				<fieldset>
					<legend>Products</legend>

					{FormInner}
				</fieldset>
			)}
		</div>
	)
}

export default Transfer
