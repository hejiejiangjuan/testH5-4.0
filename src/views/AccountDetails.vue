<template>
    <div class="accountDetails">
        <div class="allDetails">全部交易</div>
        <div class="accountDetails-none" v-if="accountChangeData.length==0">
            <div class="accountDetails-icon">
                <van-icon name="label-o"/>
            </div>
            <p class="accountDetails-text">暂无交易明细</p>
        </div>
        <div class="failure" v-if="accountChangeData.length>0">
            <div class="failureOrders" v-for="(item, index) in accountChangeData" :key="index">
                <div class="failureImg">
                    <img src="../assets/imgs/Money.png" alt="">
                </div>
                <div class="failureInfo">
                    <div class="Infotitle"><p>零钱提现</p>
                        <p>{{item.amountYuan}}</p></div>
                    <p class="infoTime">{{item.formatCreateDate}}</p>
                </div>
            </div>
            <p class="footInfo">{{footInfo}}</p>
        </div>
    </div>
</template>

<script>
    import Api from "../Api"

    export default {
        name: "AccountDetails",
        data() {
            return {
                curPage: 1,//当前页码，默认为1
                pageSize: 10,//每页显示多少条
                accountChangeData: [],//账单明细
                footInfo:"加载更多",
            }
        },
        mounted() {
            this.accountChange()
            window.addEventListener("scroll", this.scaoll)
        },
        methods: {
            //获取我的账户明细
            accountChange(curPage) {
                // var param = new URLSearchParams()
                var param={}
                if (!curPage){
                    // param.append("curPage", this.curPage)
                    param.curPage=this.curPage
                } else {
                    // param.append("curPage", curPage)
                    param.curPage=curPage
                }
                // param.append("pageSize", this.pageSize)
                param.pageSize=this.pageSize
                param=this.$qs.stringify(param)
                this.$axios({
                    url: Api.getMyAccountChange,
                    method: "post",
                    data: param
                }).then(resp => {
                    if (resp.data.code == 200) {
                        var myData=resp.data.datas
                        for (var i=0;i<myData.length;i++){
                            this.accountChangeData.push(myData[i])
                        }
                        if(myData.length==0||myData.length<this.pageSize){
                            this.footInfo="没有了更多"
                        }

                    }
                })
            },
            //监听滚动条事件
            scaoll() {
                //滚动条顶部的高度
                let innerHeight = document.documentElement.scrollTop || document.body.scrollTop;
                //屏幕尺寸高度
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                //可滚动容器超出当前窗口显示范围的高度
                let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                if (scrollHeight == windowHeight + innerHeight){
                    this.curPage=this.curPage+=1
                    var that=this
                    setTimeout(function () {
                        this.accountChange(that.curPage)
                    },400)
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .failure {
        /*border: 1px solid black;*/
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        .footInfo{
            font-size: 0.24rem;
            color: #727272;
        }
        .failureOrders {
            display: flex;
            justify-content: center;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.22);
            width: 90%;
            border-radius: 3px;
            background: white;
            margin-top: 0.2rem;
            padding: 0.1rem 0;

            .failureImg {
                /*border: 1px solid black;*/
                width: 0.65rem;
                height: 0.65rem;
                border-radius: 50%;
                margin-top: 0.05rem;
                overflow: hidden;
                position: relative;

                img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    /*border: 1px solid black;*/
                    /*width: 1rem;*/
                    /*height: 1rem;*/
                }
            }

            .failureInfo {
                /*border: 1px solid black;*/
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 76%;

                .Infotitle {
                    font-size: 0.28rem;
                    margin: 0;
                    display: flex;
                    justify-content: space-between;
                    width: 93%;
                    padding-left: 0.4rem;
                    margin-bottom: 0.1rem;

                    p {
                        margin: 0;
                    }

                    p:nth-child(2) {
                        color: black;
                    }
                }

                .infoTime {
                    font-size: 0.24rem;
                    color: #727272;
                    margin: 0;
                    /*border: 1px solid black;*/
                    width: 93%;
                    padding-left: 0.4rem;

                }
            }
        }
    }

    .allDetails {
        font-size: 0.3rem;
        text-align: center;
        margin: 0;
        padding-top: 0.3rem;
    }

    .accountDetails-none {
        padding-top: .6rem;

        .accountDetails-icon {
            font-size: 0.6rem;
            text-align: center;
            color: #727272;
        }

        .accountDetails-text {
            font-size: 0.24rem;
            color: #727272;
            text-align: center;
        }
    }

</style>