import Airtable from 'airtable'
import { camelCase } from 'change-case'

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY })

const base = Airtable.base(process.env.AIRTABLE_BASE)

const prettifyRecord = ({ _rawJson: { id, fields } }) =>
  Object.entries(fields).reduce(
    (acc, [k, v]) => ({ ...acc, [camelCase(k)]: v }),
    { id }
  )

export default (table, { view = 'Grid view' } = {}) =>
  new Promise((resolve, reject) => {
    const allRecords = []

    base(table)
      .select({ view })
      .eachPage(
        (records, next) => {
          records.forEach(r => allRecords.push(prettifyRecord(r)))
          next()
        },
        error => {
          if (error) reject(error)
          resolve({ [camelCase(table)]: allRecords })
        }
      )
  })
