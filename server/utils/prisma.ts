import { PrismaClient } from '@prisma/client'

let _prisma: PrismaClient | undefined

export function usePrisma(): PrismaClient {
  if (!_prisma) {
    const { databaseUrl } = useRuntimeConfig()
    _prisma = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    })
  }
  return _prisma
}
