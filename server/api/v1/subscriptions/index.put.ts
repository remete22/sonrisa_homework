export default defineEventHandler(async (event) => {
  const body = await readBody<{ userId: number; methodId: number; channelIds?: number[] }>(event)

  if (!body.userId || !body.methodId) {
    throw createError({ statusCode: 400, message: 'userId and methodId are required' })
  }

  const db = usePrisma()

  return db.subscriptions.create({
    data: {
      userId: body.userId,
      methodId: body.methodId,
      channels: body.channelIds?.length
        ? { connect: body.channelIds.map(id => ({ channelId: id })) }
        : undefined,
    },
    include: {
      channels: { select: { channelId: true, name: true } },
      method: { select: { methodId: true, methodName: true } },
    },
  })
})
