<template>
    <div class="search">
        <div class="imgBox">
            <div class="logImg">
                <img :src="$root.logo" alt="">
            </div>
            <span>{{$root.tenantName}}</span>
        </div>
        <div class="searchIcon" @click="SearchPage">
            <div class="searchIcon-text">
                <van-icon name="search" />
                <div >搜索</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchTop",
        data(){
            return{
                tenantData:{}
            }
        },
        created(){

        },
        mounted(){

        // this. getMyData()
        },
        computed:{
            //获取state值
            listenState(){
                return this.$store.state.homePage.comData
            }
        },
        //监听state值得变化
        watch:{
            listenState(old,newd){
                this.tenantData = old;
            },
        },
        methods:{
            // getMyData(){
            //    // this.$store.state.homePage.comData
            //    //  console.log(this.$store.state.homePage.comData)
            // },
            SearchPage(){
            this.$router.push("/SearchPage/SearchCon")
            }
        }
    }
</script>

<style scoped lang="less">
    .search {
        background: rgba(255, 255, 255, 0.14);
        width:92%;
        height:50px;
        display: flex;
        justify-content: space-between;
        padding: 0 15px;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        z-index: 10;
        .imgBox{
            width:30%;
            height:47px;
            line-height:50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .logImg{
                width:0.5rem;
                height:0.5rem;
                border-radius: 50%;
                position: relative;
                overflow: hidden;
                img{
                    width: 0.5rem;
                    height:0.5rem;
                    position: absolute;
                    top: 0;
                }
            }
            span{
                font-size:0.3rem;
            }
        }
        .searchIcon{
            width: 120px;
            height: 26px;
            background: #e9e9e9;
            border-radius: 50px 50px;
            .searchIcon-text{
                width: 100px;
                margin-left: 10px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-top:4px;
                color: #878787;
                div{
                    font-size: 12px;
                   padding-bottom: 2px;
                }
                i{
                    display: block;
                    font-size:0.32rem;
                }
            }
        }
    }
</style>