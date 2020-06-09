import a from './_airtable'

export default async (_req, res) =>
  res.send({
    ...await a('Flows'),
    ...await a('Nodes'),
    ...await a('Pillars')
  })
