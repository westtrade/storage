export const QUERY_FETCH_ME = `
query {
	me {
		id
		login
		token
	}
}`

export const QUERY_FETCH_STORAGES = `
query($pager: PagerInput) {
	storages(pager: $pager) {
		list {
			id
			name
			products {
				list {
					id
					name
					quantity
					total
					used
				}
			}

			owner {
				id
				login
			}
		}

		pageInfo {
			offset
			limit
			total
		}
	}
}`

export const QUERY_FETCH_PRODUCTS = `
query($pager: PagerInput) {
	products(pager: $pager) {
		list {
			id
			storages {
				storage {
					id
					name
					owner {
						login
					}
				}
				quantity
			}	
			name
			total
			used
			owner {
				id
				login
			}
		}

		pageInfo {
			offset
			limit
			total
		}
	}
}`
