export const MUTATION_SIGNIN = `
mutation ($credentials: CredentialsInput!) {
	signIn(credentials:$credentials) {
		id
		token
		login
	}
}`

export const MUTATION_SIGNUP = `
mutation ($credentials: CredentialsInput!) {
	signUp(credentials: $credentials) { id login token }
}`

export const MUTATION_CREATE_STORAGE = `
mutation($storage: StorageInput!) {
	createStorage(storage: $storage) {
		id
		name
		products {
			list {
				name
				id
				quantity
				total
				used
			}
		}

		owner {
			login
		}
	}
}`

export const MUTATION_DELETE_STORAGE = `
mutation($id: ID!) {
	deleteStorage(id: $id)
}`

export const MUTATION_UPDATE_STORAGE = `
mutation($id: ID!, $storage: StorageInput!) {
	editStorage(id: $id, storage: $storage) {
		id
		name
		products {
			list {
				name
				id
				quantity
				total
				used
			}
		}

		owner {
			login
		}
	}
}`

export const MUTATION_CREATE_PRODUCT = `
mutation($product: ProductInput!) {
	createProduct(product: $product) {
		id
		name
		total
		used

		owner {
			login
		}
	}
}`

export const MUTATION_EDIT_PRODUCT = `
mutation($id: ID!, $product: ProductInput!) {
	editProduct(id: $id, product: $product) {
		id
		name
		total
		used

		owner {
			login
		}
	}
}`

export const MUTATION_DELETE_PRODUCT = `
mutation($id: ID!) {
	deleteProduct(id: $id) 
}`

export const MUTATION_MOVE_PRODUCTS = `
mutation($transfer: TransferOperationInput!) {
	moveProducts(transfer: $transfer) {
		id
		name
		products {
			list {
				name
				id
				quantity
				total
				used
			}
		}

		owner {
			login
		}
	}
}`
