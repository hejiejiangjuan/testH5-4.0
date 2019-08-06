<template>
    <div class="extensionWorkers">
        <div class="serch">
            <van-search placeholder="请输入用户名" v-model="value" @blur="inpublur"/>
        </div>
        <div style="width: 100%;height: 1.06rem"></div>
        <div class="rewardTitle">
            <p>我邀请的好友</p>
            <p>邀请奖励</p>
        </div>
        <div class="userCon" v-for="(item,index) in mySub" v-if="mySub.length>0">
            <div class="userIfo">
                <div class="custImg">
                    <img :src="item.avatar" alt="">
                </div>
                <div class="reward">
                    <p>{{item.nickname}}</p>
                    <p>￥{{item.sumIndirectCommission}}</p>
                </div>

            </div>
        </div>
        <p class="footIfo" v-if="mySub.length>0">{{footInfo}}</p>
        <div class="userConNone" v-if="mySub.length==0">
            <div class="custIcon">
                <van-icon name="coupon-o"/>
            </div>
            <p>暂无成功邀请的推广员，请先邀请好友成为推广员</p>
        </div>
    </div>
</template>

<script>
    import Api from "../Api"

    export default {
        name: "ExtensionWorkers",
        data() {
            return {
                value: "",//模糊查询的值
                curPage: 1,//当前多少页
                pageSize: 10,//每一页多少条
                mySub: [],
                footInfo:"加载更多"
            }

        },
        created() {

        },
        mounted(){
            this.initPage()
            window.addEventListener("scroll",this.paging)
        },
        methods: {
            // 初始化
            initPage(curPage) {
                // var param = new URLSearchParams()
                var param={}
                if (this.value) {
                    // param.append("searchCon",this.value);
                    param.searchCon=this.value;
                }
                if (curPage){
                    // param.append("curPage", curPage);
                    param.curPage=curPage;
                }else {
                    // param.append("curPage", this.curPage);
                    param.curPage=this.curPage;
                }
                // param.append("pageSize", this.pageSize);
                param.pageSize=this.pageSize
                param=this.$qs.stringify(param)
                this.$axios({
                    url: Api.getMySubDisUser,
                    method: "post",
                    data: param,
                }).then(resp => {
                    if (resp.data.code == 200) {
                        var myData=resp.data.datas
                        if (myData!=null){
                            for (var i=0;i<myData.length;i++){
                                this.mySub.push(myData[i])
                            }
                            if (myData.length<10||myData.length==0){
                                this.footInfo="没有更多"
                            }
                        }else {
                            this.footInfo="没有更多"
                        }
                    }
                })
            },
            //模糊查询的方法
            inpublur() {
                this.mySub=[]
                this.initPage(1)
            },
            //分页
            paging(){
                //滚动条顶部的高度
                var innerHeight = document.documentElement.scrollTop || document.body.scrollTop;
                //获取屏幕的宽度
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                //可滚动容器超出当前窗口显示范围的高度
                var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                if (scrollHeight==innerHeight+windowHeight){
                    this.curPage=this.curPage+=1
                    var that=this
                    setTimeout(function () {
                        that.initPage(that.curPage)
                    },400)
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .rewardTitle{
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e4e4e4;
        padding: 0 0.4rem;
        p{
            font-size: 0.24rem;
            color: #727272;

        }
    }
    .footIfo{
        font-size: 0.24rem;
        text-align: center;
        color: #727272;
    }
    .extensionWorkers {
        padding-bottom: 1.5rem;

        .serch {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 10;
        }
    }

    .userCon {
        display: flex;
        justify-content: center;

        .userIfo {
            width: 100%;
            /*background: white;*/
            border-radius: 5px;
            display: flex;
            justify-content: flex-start;
            padding-left: 0.4rem;
            margin-top: 0.1rem;

            .custImg {
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
                overflow: hidden;
                position: relative;

                img {
                    position: absolute;
                    top: 0;
                    width:1rem;
                    height:1rem;
                }
            }

            .reward{
                font-size: 0.3rem;
               padding-right: 0.4rem;
                display: flex;
                justify-content: space-between;
                width:83%;
                border-bottom: 1px solid #e4e4e4;
                margin-left: 0.2rem;
                p:nth-child(2){
                    color: #727272;
                    font-size:0.22rem ;
                }
            }
        }
    }
    .userConNone {
        /*border: 1px solid blue;*/
        display: flex;
        flex-direction: column;
        align-items: center;
        .custIcon {
            font-size: 1.5rem;
            text-align: center;
            color: #aacbff;
        }

        p {
            font-size: 0.3rem;
            color: #727272;
            text-align: center;
            width: 66%;
        }
    }
</style>