import { api } from '@/env'
import { fetch } from '@/utils'

export default {
  namespaced: true,
  state: {
    _links: [],
    nodes: [],
    pillars: [],
    steps: [],
    ready: false
  },
  getters: {
    links: ({ _links, nodes }) =>
      _links.map(({ annotation, from: [fid], to: [tid] }) => ({
        annotation,
        source: nodes.findIndex(({ id }) => id===fid),
        target: nodes.findIndex(({ id }) => id===tid)
      })),
    node: ({ nodes }) => id => nodes.find(n => n.id===id),
    nodeIndex: ({ nodes }) => id => nodes.findIndex(n => n.id===id),
    pillar: ({ pillars }) => id => pillars.find(p => p.id===id),
    pillarIndex: ({ pillars }) => id => pillars.findIndex(p => p.id===id),
    step: ({ steps }) => id => steps.find(n => n.id===id),
    stepIndex: ({ steps }) => id => steps.findIndex(n => n.id===id),
  },
  mutations: {
    addLink(state, l) { state._links.push(l) },
    addNode(state, n) { state.nodes.push(n) },
    addPillar(state, p) { state.pillars.push(p) },
    addStep(state, s) { state.steps.push(s) },
    ready(state) { state.ready = true }
  },
  actions: {
    async init({ commit }) {
      const {
        links,
        nodes,
        pillars,
        steps
      } = await fetch(api.endpoints.config)

      links.forEach(l => commit('addLink', l)),
      nodes.forEach(n => commit('addNode', n)),
      pillars.forEach(p => commit('addPillar', p))
      steps.forEach(s => commit('addStep', s))

      commit('ready')
    }
  }
}
