import Vuex from 'vuex'
import { api } from '@/env'
import { fetch } from '@/utils'

export default Vuex.createStore({
  state: {
    flows: [],
    nodes: [],
    pillars: [],
    ready: false
  },
  getters: {
    links: ({ flows, nodes }) => flows.map(({ from: [f], to: [t] }) => ({
      source: nodes.findIndex(({ id }) => id===f),
      target: nodes.findIndex(({ id }) => id===t)
    })),
    graph: ({ nodes }, { links }) => ({ links, nodes }),
    pillar: ({ pillars }) => id => pillars.find(p => p.id===id)
  },
  mutations: {
    addFlow(state, f) { state.flows.push(f) },
    addNode(state, n) { state.nodes.push(n) },
    addPillar(state, p) { state.pillars.push(p) },
    ready(state) { state.ready = true }
  },
  actions: {
    async init({ commit }) {
      const { flows, nodes, pillars } = await fetch(api.endpoints.config)

      flows.forEach(f => commit('addFlow', f)),
      nodes.forEach(n => commit('addNode', n)),
      pillars.forEach(p => commit('addPillar', p))

      commit('ready')
    }
  }
});
