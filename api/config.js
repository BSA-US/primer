import a from './_airtable'

export default async (_req, res) =>
  res.send({
    ...await a('Links'),
    ...await a('Nodes'),
    ...await a('Pillars'),
    ...await a('Steps')
  })
