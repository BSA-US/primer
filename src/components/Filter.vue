<template lang='pug'>
ul(:class='type')
  li(v-for='{ active, color, name } in options' :key='name')
    button(
      :class='{ active }'
      :style='{ ["--color"]: color }'
      @click='onOptionClicked({ active, name })'
      v-text='name'
    )
</template>

<script>
const isOption = x =>
  Object.keys(x).filter(k =>
    ['active', 'color', 'name'].includes(k)
  ).length===3
const isType = x => ['linear', 'select', 'select-multiple'].includes(x)

export default {
  name: 'Filter',
  props: {
    options: { validator: values => values.every(isOption) },
    type: { default: 'select', validator: isType }
  },
  methods: {
    onOptionClicked({ active, name }) {
      if (this.type!=='select-multiple')
        this.options
          .filter(({ active }) => ({ active }))
          .forEach(({ name }) => this.$emit(`option-deactivated`, name))
      this.$emit(`option-${active ? 'de' : ''}activated`, name)
    },
  }
}
</script>

<style scoped lang='stylus'>
  ul
    border-bottom 1px solid black
    display flex
    justify-content center
    padding 20px

    li:not(:last-child)
      margin-right 40px

  button
    background-color var(--color, moccasin)
    &.active
      font-weight bold
</style>
