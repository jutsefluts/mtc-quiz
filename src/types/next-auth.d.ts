import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    // Add any other custom properties here
  }

  interface Session {
    user: User & {
      id: string
    }
  }
}
