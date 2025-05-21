export type TransactionErrorCode =
	| "ORDER_NOT_FOUND"
	| "ORDER_STATUS_UPDATE_FAILURE"
	| "ORDER_ALREADY_CONFIRMED"

export class TransactionError extends Error {
	public code: TransactionErrorCode | null = null

	constructor(message: string, code: TransactionErrorCode) {
		super(message)
		this.name = "TransactionError"
		this.code = code
	}
}
