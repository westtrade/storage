import React, { useContext } from 'react'
import Form from '../Form/Form'
import Input from '../Form/Input'
import Submit from '../Form/Submit'

import ApiContext from '../../context/ApiContext.ts'

export default function SignUp() {
	const api = useContext(ApiContext)

	return (
		<div className="container">
			<h2>Registration</h2>
			<hr />
			<Form
				onSubmit={async ({ event, values } = {}) => {
					event.preventDefault()
					// @ts-ignore
					await api.signUp(values.login, values.password)
				}}
			>
				{({ isLoading, error }) => {
					return (
						<>
							{error}
							<Input
								name="login"
								type="text"
								label="Login"
								defaultValue={'demo'}
							></Input>
							<Input
								name="password"
								type="password"
								label="Password"
								defaultValue={'demo'}
							></Input>

							<Submit
								className="float-right"
								isLoading={isLoading}
							>
								Register
							</Submit>
						</>
					)
				}}
			</Form>
		</div>
	)
}
