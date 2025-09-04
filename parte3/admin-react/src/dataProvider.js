// admin-react/src/dataProvider.js
const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')

async function http(url, options = {}) {
  options.headers = options.headers || {}
  if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json'
  const res = await fetch(url, options)
  const json = res.status === 204 ? null : await res.json()
  return { status: res.status, json }
}

// mapeia a chave id_* para id, que o React-Admin precisa
const mapId = (resource, data) => {
  if (Array.isArray(data)) return data.map(d => mapId(resource, d))
  if (!data) return data
  const keyByResource = { users: 'id_user', venues: 'id_venue', events: 'id_event', tickets: 'id_ticket' }
  const k = keyByResource[resource]
  return k && data[k] !== undefined ? { id: data[k], ...data } : data
}

export default {
  async getList(resource, params) {
    const url = `${apiUrl}/${resource}`
    const { json } = await http(url)
    return { data: mapId(resource, json), total: Array.isArray(json) ? json.length : 0 }
  },
  async getOne(resource, params) {
    const { json } = await http(`${apiUrl}/${resource}/${params.id}`)
    return { data: mapId(resource, json) }
  },
  async create(resource, params) {
    const { json } = await http(`${apiUrl}/${resource}`, { method: 'POST', body: JSON.stringify(params.data) })
    return { data: mapId(resource, json) }
  },
  async update(resource, params) {
    const { json } = await http(`${apiUrl}/${resource}/${params.id}`, { method: 'PUT', body: JSON.stringify(params.data) })
    return { data: mapId(resource, json) }
  },
  async updateMany(resource, params) {
    const results = await Promise.all(params.ids.map(id => this.update(resource, { id, data: params.data })))
    return { data: results.map(r => r.data.id) }
  },
  async delete(resource, params) {
    await http(`${apiUrl}/${resource}/${params.id}`, { method: 'DELETE' })
    return { data: { id: params.id } }
  },
  async deleteMany(resource, params) {
    await Promise.all(params.ids.map(id => this.delete(resource, { id })))
    return { data: params.ids }
  },
  async getMany(resource, params) {
    const results = await Promise.all(params.ids.map(id => this.getOne(resource, { id })))
    return { data: results.map(r => r.data) }
  },
  async getManyReference(resource, params) {
    return this.getList(resource, params)
  },
}