export default {
  namespaced: true,
  state: {
    hideNav: false
  },
  mutations: {
    hideNav(state) {
      state.hideNav = true
    },
    showNav(state) {
      state.hideNav = false
    }
  }
}
