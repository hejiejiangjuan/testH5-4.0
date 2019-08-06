<template>
    <div class="tabaar">
        <van-tabbar v-model="active"  :active-color="activeColor" route>
            <van-tabbar-item replace v-for="(item,index) in tabbarData" :key="index"  :icon="item.icon" :to="item.path"  @click="changPage(index,item.path)"  >{{item.title}}</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    export default {
      data(){
          return{
              active:0,
              activeColor:"#ffa500",
              path:"",
             tabbarData:[
                 {
                     id:0,
                     icon:'home-o',
                     title:"首页",
                     path:"/home"
                 },
                 {
                     id:1,
                     icon:'apps-o',
                     title:"分类",
                     path:"/classificationPage"
                 },
                 {
                     id:2,
                     icon:'contact',
                     title:"我的测评",
                     path:"/Me"
                 },
             ]//tabrr的数据
          }
      },

        methods:{
          changPage(index,path){
              // this.path=this.$route.path

          }
        },
        watch:{
          "$route"(){
              if (this.$route.path!="/home"&&this.$route.path!="/classificationPage"&&this.$route.path!="/Me"){
                  this.active=3
              //     this.activeColor="#727272"
              }else if (this.$route.path=="/classificationPage") {
                  this.active=1
              }else if (this.$route.path=="/Me"){
                  this.active=2
              }else if(this.$route.path=="/home"){
                  this.active=0
              }
          }
        }
    }
</script>

<style scoped lang="less">
    /deep/.van-tabbar-item__icon{
        i{
            font-weight: bold;
        }
    }
    /deep/.van-tabbar-item__text{
        font-weight: bold;
        font-size: 0.28rem;
    }
    .tabaar{
        position: fixed;
        top: 0;
        color:black;
    }
</style>