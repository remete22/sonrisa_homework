export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: 'Invalid subscription id' })
  }

  const body = await readBody<{ methodId?: number; channelIds?: number[] }>(event)

  const db = usePrisma()

  const existing = await db.subscriptions.findUnique({ where: { subscriptionId: id } })
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Subscription not found' })
  }

  return db.subscriptions.update({
    where: { subscriptionId: id },
    data: {
      ...(body.methodId !== undefined && { methodId: body.methodId }),
      ...(body.channelIds !== undefined && {
        channels: { set: body.channelIds.map(cid => ({ channelId: cid })) },
      }),
    },
    include: {
      channels: { select: { channelId: true, name: true } },
      method: { select: { methodId: true, methodName: true } },
    },
  })
})
