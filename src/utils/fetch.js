import fetch from 'unfetch'

import { api } from '@/env'

export default async path => {
  const res = await fetch(`${api.baseUrl}${path}`)
  return await res.json()
}
