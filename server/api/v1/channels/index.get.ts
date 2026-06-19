export default defineEventHandler(async () => {
  const db = usePrisma()
  return db.newsChannels.findMany({
    orderBy: { createdAt: 'desc' },
  })
})
