<template>
    <div>
        <div class="searchBox">
            <van-search v-model="value" placeholder="请输入标题或内容" show-action shape="round"  @clear="clearVal">
                <div slot="action" @click="onback" v-if="value==''">取消</div>
                <div slot="action" @click="onSearch()" v-else>搜索</div>
            </van-search>
        </div>
        <div class="kong"></div>
        <router-view></router-view>
        <p class="footText">没有更多了</p>
    </div>

</template>

<script>
    import Api from "../Api"
    export default {
        name: "SearchPage",
        components:{

        },

        data() {
            return {
                value: '',//搜索框的值
                recommendData:[],//
                curPage:1,
                pageSize:10
            }
        },
        beforeCreate(){

        },

        //监听state的数据变化
        computed: {
            listenshowpage() {
                return this.$store.state.searchPage.value
            }
        },
        //监听computed的数据变化，再赋值给搜索框的value
        watch:{
            listenshowpage:function(old,newd){
                this.value = old;
            },

        },

        methods:{
            //点击取消返回
            onback() {
                this.$router.go(-1)
            },
            // 搜索框里的内容搜索
            onSearch() {
                //请求数据
                var str=this.value
                // var param=new URLSearchParams()
                // param.append('content',str)
                // param.append('curPage',this.curPage)
                // param.append('pageSize',this.pageSize)
                var param={}
                param.content=str;
                param.curPage=this.curPage;
                param.pageSize=this.pageSize;
                param=this.$qs.stringify(param)
                var obj={
                    param:param,
                    str:str
                }
                this.$store.dispatch("getVal",obj)
                this.$router.push("/SearchPage/CategoryList")
            },
            clearVal(){

            }
        },
    }
</script>

<style scoped lang="less">
    .searchBox{
        position: fixed;
        top: 0px;
        width: 100%;
        z-index: 10;
    }
    .kong{
        width: 100%;
        height:49px ;
    }
    .footText{
        text-align: center;
        color: #727272;
        font-size: 12px;
    }
</style>