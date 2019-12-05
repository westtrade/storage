import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { makeid } from '../../../libs/generators'
import Form from '../../Form/Form'
import Input from '../../Form/Input'
import Submit from '../../Form/Submit'
import apiContext from '../../../context/ApiContext'

export type TCreateForm = {
	onUpdate?: any
}

export type TProductInput = {
	position?: string
	onDelete?: any
	key?: any
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

export default function CreateProductForm({ onUpdate }: TCreateForm) {
	const api = useContext(apiContext)

	return (
		<Form
			className="clearfix"
			onSubmit={async ({ event, values }) => {
				event.preventDefault()

				// @ts-ignore
				const result = await api.createProduct(values)

				onUpdate && onUpdate()
			}}
		>
			{({ isLoading, error }) => {
				return (
					<>
						{error}
						<Input name="name" label="Product name"></Input>
						<Input
							name="total"
							label="Product total quantity"
							type="number"
							defaultValue={0}
						></Input>

						<Submit isLoading={isLoading} className="float-right">
							Add
						</Submit>
					</>
				)
			}}
		</Form>
	)
}
