import { db } from "@/database"
import type { User } from "@/types/user"

interface UserService {
	getAll(): Promise<User[]>
	// findById(id: User["id"]): User
}

class UserServiceImpl implements UserService {
	async getAll(): Promise<User[]> {
		const result = await db.selectFrom("user").selectAll().execute()
		return result
	}
}

interface UserServiceFactory {
	createService(): UserService
}

export class ConcreteUserServiceFactory implements UserServiceFactory {
	createService() {
		return new UserServiceImpl()
	}
}
