<template>
    <div class="PromoteOrder">
        <div class="userConNone" v-if="ProData.length==0">
            <div class="custIcon">
                <van-icon name="coupon-o"/>
            </div>
            <p>您还没有订单</p>
        </div>
        <div class="proOrder" v-for="(item,index) in ProData">
            <div class="uerImg">
                <img :src="item.picAddr" alt="">
            </div>
            <div class="goodsInfo">
                <p>{{item.title}}</p>
                <div class="price"><p>实付金额:<span>￥{{item.paymentYuan}}</span></p>
                    <p>佣金:<span>￥{{item.commissionYuan}}</span></p></div>
                <p>订单:{{item.orderNo}}</p>
                <p>下单时间:{{item.formatCreateDate}}</p>
            </div>
        </div>
        <p class="footIfo" v-if="ProData.length>0">{{footInfo}}</p>
    </div>
</template>

<script>
    import Api from "../Api"

    export default {
        name: "PromoteOrder",
        data() {
            return {
                curPage: 1,//当前第几页
                pageSize: 10,//一页多少条
                ProData:[],
                footInfo:"加载更多"
            }
        },
        created() {
            this.initProPage()
        },
        methods: {
            //初始化
            initProPage(curPage) {
                // var param = new URLSearchParams();
                var param={}
                if (curPage){
                    // param.append("curPage",curPage)
                    param.curPage=curPage;
                } else {
                    // param.append("curPage", this.curPage)
                    param.curPage=this.curPage;
                }
                // param.append("pageSize", this.pageSize)
                param.pageSize=this.pageSize;
                param=this.$qs.stringify(param)
                this.$axios({
                    url: Api.getMyDisOrder,
                    method: "post",
                    data: param,
                }).then(resp => {
                    if (resp.data.code==200){
                        var myData=resp.data.datas
                        for (var i=0;i<myData.length;i++){
                            this.ProData.push(myData[i])
                        }
                        if (myData.length<=10||myData.length==0){
                            this.footInfo="没有了更多"
                        }
                    }
                })
            },
            //获取滚动条事,
            //分页
            paging() {
                //滚动条顶部的高度
                var innerHeight = document.documentElement.scrollTop || document.body.scrollTop;
                //获取屏幕的宽度
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                //可滚动容器超出当前窗口显示范围的高度
                var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                if (scrollHeight == innerHeight + windowHeight) {
                    this.curPage = this.curPage += 1
                    var that = this
                    setTimeout(function () {
                        that.initProPage(that.curPage)
                    }, 400)
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .PromoteOrder {
        display: flex;
        flex-direction: column;
        align-items: center;
        .userConNone {
            /*border: 1px solid blue;*/
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
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
        .footIfo{
            font-size: 0.24rem;
            text-align: center;
            color: #727272;
        }
        .proOrder {
            width: 90%;
            margin-top: 0.3rem;
            display: flex;
            justify-content: center;
            background: white;
            border-radius: 3px;
            padding: 0.2rem;

            .uerImg {
                width: 2rem;
                height: 2rem;

                img {
                    width: 2rem;
                    height: 2rem;
                }
            }

            .goodsInfo {
                width: 100%;
                padding: 0.1rem 0.3rem;

                p {
                    font-size: 0.24rem;
                    margin: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #727272;
                }

                p:nth-child(1) {
                    font-size: 0.3rem;
                    font-weight: bold;
                    color: black;
                }

                p:nth-child(3) {
                    margin-top: 0.2rem;
                }

                p:nth-child(4) {
                    margin-top: 0.1rem;
                }

                .price {
                    margin-top: 0.1rem;
                    display: flex;
                    justify-content: flex-start;

                    p {
                        font-size: 0.24rem;
                        font-weight: inherit;
                        color: #727272;

                        span {
                            color: red;
                            padding-left: 0.3rem;
                        }
                    }

                    p:last-child {
                        margin-left: 0.5rem;

                        span {
                            color: red;
                            padding-left: 0.3rem;
                        }
                    }
                }
            }
        }
    }


</style>