import React, { useContext, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import classNames from 'classnames'
import apiContext from '../../../context/ApiContext'
import * as confirmModal from './confirmModal.ts'
import Submit from '../../Form/Submit'

export type TStorageRow = {
	item: any
	isLoading: boolean
	refetch: any
}

export function ProductRow({ item, isLoading, refetch }: TStorageRow) {
	const api = useContext(apiContext)
	const [state, toggleState] = useState({
		isOpen: false,
		isLoading: false,
	})

	const storagesToggler =
		!isLoading && item.storages.length > 0 ? (
			<a
				href="#"
				onClick={event => {
					event.preventDefault()
					toggleState({
						...state,
						isOpen: !state.isOpen,
					})
				}}
			>
				{item.storages.length}
				<i
					className={classNames(
						'fa fa-fw ',
						state.isOpen ? 'fa-chevron-up' : 'fa-chevron-down'
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
				<td>{isLoading ? <Skeleton /> : storagesToggler}</td>
				<td>{isLoading ? <Skeleton /> : item.used}</td>
				<td>{isLoading ? <Skeleton /> : item.total}</td>
				<td>
					{isLoading ? (
						<Skeleton />
					) : (
						<Submit
							isLoading={state.isLoading}
							type="button"
							className="button-clear button-small"
							onClick={async () => {
								// @ts-ignore

								toggleState({
									...state,
									isLoading: true,
								})
								//

								const result =
									item.used > 0
										? await confirmModal.show()
										: { value: true }

								if (result.value) {
									//@ts-ignore
									await api.deleteProduct(item.id)
									await refetch()
								}

								toggleState({
									...state,
									isLoading: false,
								})
							}}
						>
							<i className="fa fa-fw fa-times"></i> Delete
						</Submit>
					)}
				</td>
			</tr>
			{state.isOpen && !isLoading && item.storages.length > 0 && (
				<tr>
					<td colSpan={6}>
						<h3>Product in storages</h3>
						<table>
							<thead>
								<tr>
									<th>ID</th>
									<th>name</th>
									<th>qty</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{item.storages.map(({ storage, quantity }) => {
									return (
										<tr key={storage.id}>
											<td>{storage.id}</td>
											<td>{storage.name}</td>
											<td>{quantity}</td>
											<td>
												<Submit
													type="button"
													className="button-clear button-small"
													onClick={async () => {
														// @ts-ignore
														await api.moveProducts({
															from: storage.id,
															product: item.id,
															quantity,
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

export default ProductRow
