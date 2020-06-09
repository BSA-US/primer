<template lang='pug'>
nav
  router-link(to='/') Home
  |  |
  router-link(to='/about') About
router-view
</template>

<script>
import 'destyle.css'

export default { name: 'app' }
</script>

<style lang='stylus'>
  html, body, #app
    height 100%

  #app
    display flex
    flex-direction column

  nav + *
    flex 1
</style>
