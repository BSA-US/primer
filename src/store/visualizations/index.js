import dualPowerProject from './dual-power-project'

export default {
  namespaced: true,
  actions: {
    init({ dispatch }) {
      dispatch('visualizations/dualPowerProject/init', null, { root: true })
    }
  },
  modules: {
    dualPowerProject
  }
}
