import { Role } from "@prisma/client"

declare module "@auth/core/types" {
  interface User {
    role: Role
    workerStatus?: string
  }

  interface Session {
    user: {
      id: string
      role: Role
      workerStatus?: string
    } & DefaultSession["user"]
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    role: Role
    workerStatus?: string
  }
}
