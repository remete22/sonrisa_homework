export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: 'Invalid channel id' })
  }

  const db = usePrisma()
  const channel = await db.newsChannels.findUnique({ where: { channelId: id } })

  if (!channel) {
    throw createError({ statusCode: 404, message: 'Channel not found' })
  }

  return channel
})
