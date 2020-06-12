<template lang='pug'>
nav(v-if='!hideNav')
  router-link(to='/') Home
  |  |
  router-link(to='/about') About
router-view
</template>

<script>
import { mapState } from 'vuex'
import 'destyle.css'

export default {
  name: 'app',
  computed: mapState('app', ['hideNav'])
}
</script>

<style lang='stylus'>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:ital,wght@0,400;0,700;1,400;1,700&display=swap')

  :root
    --spacing-xs 5px
    --spacing-sm 10px
    --spacing-md 20px
    --spacing-lg 40px

    font-family 'IBM Plex Sans Condensed', sans-serif;

  html, body, #app
    height 100%

  #app
    display flex
    flex-direction column

  nav + *
    flex 1
</style>
