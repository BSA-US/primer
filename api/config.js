import a from './_airtable'

export default async (_req, res) => {
  const tables = await Promise.all(
    ['Links', 'Nodes', 'Pillars', 'Steps'].map(x => a(x))
  )

  res.send(tables.reduce((acc, cur) => ({ ...acc, ...cur }), {}))
}
