<template>
  <div id="app">
      <router-view></router-view>
      <tabarr v-if="$route.meta.tabarr"></tabarr>
  </div>
</template>
<script>
    import tabarr from "./components/tabbar"
    export default {
        name:"app",
        components:{
            tabarr
        }
    }
</script>

<style lang="less">

</style>
