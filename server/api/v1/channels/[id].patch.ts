export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: 'Invalid channel id' })
  }

  const body = await readBody<{
    name?: string
    url?: string
    secret?: string | null
    username?: string | null
    isActive?: boolean
  }>(event)

  const db = usePrisma()

  const existing = await db.newsChannels.findUnique({ where: { channelId: id } })
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Channel not found' })
  }

  const data: Record<string, unknown> = {}

  if (body.name !== undefined) {
    if (!body.name.trim()) throw createError({ statusCode: 400, message: 'name cannot be empty' })
    data.name = body.name.trim()
  }
  if (body.url !== undefined) {
    if (!body.url.trim()) throw createError({ statusCode: 400, message: 'url cannot be empty' })
    data.url = body.url.trim()
  }
  if (body.secret !== undefined) data.secret = body.secret?.trim() || null
  if (body.username !== undefined) data.username = body.username?.trim() || null
  if (body.isActive !== undefined) data.isActive = body.isActive

  return db.newsChannels.update({ where: { channelId: id }, data })
})
