import { createStore } from 'vuex'
import app from './app'
import visualizations from './visualizations'

export default createStore({
  actions: {
    init({ dispatch }) {
      dispatch('visualizations/init')
    }
  },
  modules: {
    app,
    visualizations
  }
})
