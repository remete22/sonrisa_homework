export default defineEventHandler(async () => {
  const db = usePrisma()

  const [users, methods] = await Promise.all([
    db.users.findMany({
      select: {
        userId: true,
        email: true,
        isActive: true,
        subscription: {
          include: {
            channels: { select: { channelId: true, name: true } },
            method: { select: { methodId: true, methodName: true } },
          },
        },
      },
      orderBy: { email: 'asc' },
    }),
    db.subscriptionMethods.findMany({ orderBy: { methodId: 'asc' } }),
  ])

  return { users, methods }
})
