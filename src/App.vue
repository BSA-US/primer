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
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:ital@0;1&display=swap')

  :root
    --spacing-xs 5px
    --spacing-sm 10px
    --spacing-md 20px
    --spacing-lg 40px

    --font-family 'Archivo', sans-serif
    --font-family-body var(--font-family)
    --font-family-header 'Archivo Black', sans-serif

    font-family var(--font-family-body)

    --color white
    --color-secondary hsla(0, 0, 100, 0.5)
    --color-hint hsla(0, 0, 100, 0.25)
    --color-stroke hsla(0, 0, 100, 0.1)
    --color-tint hsla(0, 0, 100, 0.05)
    --background-color black

    color var(--color)
    background-color var(--background-color)

  html, body, #app
    height 100%
    overflow hidden

  #app
    display flex
    flex-direction column

  nav + *
    flex 1
</style>
