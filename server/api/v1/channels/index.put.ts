export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string; url: string; secret?: string; username?: string }>(event)

  if (!body.name?.trim()) {
    throw createError({ statusCode: 400, message: 'name is required' })
  }
  if (!body.url?.trim()) {
    throw createError({ statusCode: 400, message: 'url is required' })
  }

  const db = usePrisma()
  return db.newsChannels.create({
    data: {
      name: body.name.trim(),
      url: body.url.trim(),
      secret: body.secret?.trim() || null,
      username: body.username?.trim() || null,
    },
  })
})
