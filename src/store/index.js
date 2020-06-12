import { createStore } from 'vuex'
import visualizations from './visualizations'

export default createStore({
  actions: {
    init({ dispatch }) {
      dispatch('visualizations/init')
    }
  },
  modules: {
    visualizations
  }
})
