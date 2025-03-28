import NextAuth from 'next-auth'

declare module "next-auth" {
    interface Session {
        user: {
            data: {
                _id: string,
                name: string,
                tel: string,
                email: string,
                role: string,
            },
            token: string
        }
    }
}