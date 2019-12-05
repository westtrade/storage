import React from 'react'
import classNames from 'classnames'

export type TProps = {
	className?: string
	placeholder?: string
	name: string
	type?: string
	label?: string
	onChange?: any
	onInput?: any
	defaultValue?: any
	disabled?: boolean
	value?: any
	max?: any
	min?: any
}

export default function Input({
	className = '',
	placeholder = '',
	name,
	type = 'text',
	label = '',
	onChange,
	onInput,
	defaultValue,
	disabled,
	value,
	max,
	min,
}: TProps) {
	const id = `field-${name}`
	return (
		<>
			{label && <label htmlFor={id}>{label}</label>}
			<input
				className={classNames(className)}
				type={type}
				placeholder={placeholder}
				id={id}
				name={name}
				onChange={onChange}
				onInput={onInput}
				defaultValue={defaultValue}
				disabled={disabled}
				value={value}
				max={max}
				min={min}
			/>
		</>
	)
}
