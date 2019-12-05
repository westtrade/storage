import React, { useEffect, useState, useContext } from 'react'
import apiContext from '../../context/ApiContext'

export type TSelectorProps = {
	excludeStorage?: string
	name: string
	value?: string
	label?: string
	placeholder?: string
	onChange?: any
}
export const StorageSelector = ({
	excludeStorage = '',
	name,
	value,
	placeholder,
	label,
	onChange,
}: TSelectorProps) => {
	const api = useContext(apiContext)
	const [storages, setState] = useState()

	const updateState = async () => {
		//@ts-ignore
		const result = await api.storages({ limit: 500 })
		setState(result.list.filter(storage => storage.id !== excludeStorage))
	}

	useEffect(() => {
		updateState()
		return () => {}
	}, [excludeStorage])

	const id = `selector-field-${name}`

	return (
		<React.Fragment>
			{label && <label htmlFor={id}>{label}</label>}
			<select name={name} id={id} value={value} onChange={onChange}>
				<option value="">{placeholder}</option>
				{storages &&
					storages.map(storage => {
						return (
							<option value={storage.id} key={storage.id}>
								{storage.name}
							</option>
						)
					})}
			</select>
		</React.Fragment>
	)
}

export default StorageSelector
