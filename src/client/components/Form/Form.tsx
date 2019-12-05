import React, { useRef, useState, useCallback } from 'react'
import * as formee from 'formee'

export type TProps = {
	action?: string
	children?: any
	className?: string
	onSubmit?: ISubmitInterface
}

export type ISubmitEvent = {
	event?: any
	values?: any
	error?: any | null
}
export interface ISubmitInterface {
	(props: ISubmitEvent): Promise<any> | any
}

export default function Form({
	children,
	action,
	className,
	onSubmit,
}: TProps) {
	const formElement = useRef(null)
	const [{ isLoading, error = [] }, setLoadingStatus] = useState({
		isLoading: false,
		error: null,
	})

	const onSubmitWrapper = useCallback(async event => {
		setLoadingStatus({
			isLoading: true,
			error: null,
		})

		const error: any = null
		event.persist()

		let values = {}

		if (formElement.current) {
			//@ts-ignore
			values = formee.serialize(formElement.current)
		}

		try {
			onSubmit &&
				(await onSubmit({
					event,
					values,
					error: null,
				}))

			if (formElement.current) {
				//@ts-ignore
				formElement.current.reset()
			}
		} catch (e) {
			const [errType, message = ''] = ((e.message as string) || '').split(
				':'
			)
			// @ts-ignore
			error = message ? message.trim().replace(/['"]/gim, '') : e.message
		}

		setLoadingStatus({
			isLoading: false,
			error,
		})
	}, [])

	return (
		<form
			action={action}
			className={className}
			onSubmit={onSubmitWrapper}
			ref={formElement}
		>
			{children && children({ isLoading, error })}
		</form>
	)
}
