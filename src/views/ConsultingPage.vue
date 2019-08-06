<template>
    <!--订单咨询-->
    <div>
        <div class="cePinNav">
            <van-tabs v-model="active" @click="allOrders">
                <van-tab title="全部">
                    <div class="MeContent" v-if=" allOrdersData.length<=0">
                        <div class="contentNone">
                            <div class="contentNoneIcon contentNoneCon">
                                <van-icon name="orders-o"/>
                            </div>
                            <div class="contentNoneText contentNoneCon">没有任何订单</div>
                            <div class="contentNoneText1 contentNoneCon">您所咨询订单会显示在这里</div>
                        </div>
                    </div>
                    <div class="anyContent" v-else>
                        <div class="listContent" v-for="(item,index) in allOrdersData"
                             @click="goodspage(item.appraisalId)">
                            <van-card
                                    :tag="item.typeName"
                                    :price="item.paymentStr"
                                    :title="item.title" :thumb="item.picAddr" :origin-price="item.originalPriceStr">
                            </van-card>
                            <div class="order-time">
                                <div class="time">下单时间：{{item.createDateFormat}}</div>
                                <div class="order">订单编号：<span>{{item.orderNo}}</span>
<!--                                    <button class="tag-read" data-clipboard-text="我是可以复" @click="copyOrder">复制</button>-->
                                </div>
                            </div>

                        </div>
                    </div>
                </van-tab>
                <van-tab title="已支付">
                    <div class="MeContent" v-if="withOrdersData.length<=0">
                        <div class="contentNone">
                            <div class="contentNoneIcon contentNoneCon">
                                <van-icon name="orders-o"/>
                            </div>
                            <div class="contentNoneText contentNoneCon">没有任何订单</div>
                            <div class="contentNoneText1 contentNoneCon">您已确认订单会显示在这里</div>
                        </div>
                    </div>
                    <div class="anyContent" v-else>
                        <div class="listContent" v-for="(item,index) in withOrdersData"
                             @click="goodspage(item.appraisalId)">
                            <van-card
                                    :tag="item.typeName"
                                    :price="item.paymentStr"
                                    :title="item.title" :thumb="item.picAddr" :origin-price="item.originalPriceStr">
                            </van-card>
                            <div class="order-time">
                                <div class="time">下单时间：{{item.createDateFormat}}</div>
                                <div class="order">订单编号：<span>{{item.orderNo}}</span>
<!--                                    <button class="tag-read" data-clipboard-text="我是可以复" @click="copyOrder">复制</button>-->
                                </div>
                            </div>

                        </div>
                    </div>
                </van-tab>
                <van-tab title="未支付">
                    <div class="MeContent">
                        <div class="contentNone" v-if="haveOrdersData.length<=0">
                            <div class="contentNoneIcon contentNoneCon">
                                <van-icon name="orders-o"/>
                            </div>
                            <div class="contentNoneText contentNoneCon">没有任何订单</div>
                            <div class="contentNoneText1 contentNoneCon">您为确认的订单会显示在这里</div>
                        </div>
                        <div class="anyContent" v-else>
                            <div class="listContent" v-for="(item,index) in haveOrdersData">
                                <van-card
                                        :tag="item.typeName"
                                        :price="item.paymentStr"
                                        :title="item.title" :thumb="item.picAddr" :origin-price="item.originalPriceStr">
                                    <div slot="footer">
                                        <van-button size="mini" style="background: #ffe268;border: none" @click="pay(item.orderNo)">去支付
                                        </van-button>
                                        <van-button size="mini" style="background: #ffe268;border: none"
                                                    @click="goodspage(item.appraisalId)">看详情
                                        </van-button>
                                    </div>
                                </van-card>

                                <div class="order-time">
                                    <div class="time">下单时间：{{item.createDateFormat}}</div>
                                    <div class="order">订单编号：<span>{{item.orderNo}}</span>
<!--                                        <button class="tag-read" data-clipboard-text="我是可以复" @click="copyOrder">复制</button>-->
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    import Api from "../Api"

    export default {
        name: "ConsultingPage",
        data() {
            return {
                active: 0,
                allOrdersData: [],//全部订单
                withOrdersData: [],//待确认订单
                haveOrdersData: [],//已确认订单
                type: 1,//默认
                myDate:"",
                path:"",
            }
        },
        beforeCreate() {
            // let param = new URLSearchParams()
            // param.append("type", 3)
            var param={};
            param.type=3;
            param=this.$qs.stringify(param);
            this.$axios({
                url: Api.getMyOrder,
                method: "post",
                data: param
            }).then(resp => {
                if (resp.data.code == 200) {
                    this.allOrdersData = resp.data.datas
                }
            })
        },
        created(){
            this.myDate=new Date().getTime()
            this.path=window.location.hash
        },
        beforeDestroy() {
            var endtim=new Date().getTime()
            this.$root.myDay(this.myDate,endtim,this.path)
        },

        methods: {
            //复制订单号
            copyOrder(data){
            },
            //点击
            allOrders(index) {
                if (index == 0) {
                    this.type = 3
                    // let param = new URLSearchParams()
                    // param.append("type", this.type)
                    var param={};
                    param.type=this.type;
                    param=this.$qs.stringify(param);
                    this.$axios({
                        url: Api.getMyOrder,
                        method: "post",
                        data: param
                    }).then(resp => {
                        if (resp.data.code == 200) {
                            this.allOrdersData = resp.data.datas
                        }
                    })
                } else if (index == 1) {
                    this.type = 1
                    // let param = new URLSearchParams()
                    // param.append("type", this.type)
                    var param={};
                    param.type=this.type;
                    param=this.$qs.stringify(param);
                    this.$axios({
                        url: Api.getMyOrder,
                        method: "post",
                        data: param
                    }).then(resp => {
                        if (resp.data.code == 200) {
                            this.withOrdersData = resp.data.datas
                        }
                    })
                } else if (index == 2) {
                    this.type = 0
                    // let param = new URLSearchParams()
                    // param.append("type", this.type)
                    var param={};
                    param.type=this.type;
                    param=this.$qs.stringify(param);
                    this.$axios({
                        url: Api.getMyOrder,
                        method: "post",
                        data: param
                    }).then(resp => {
                        if (resp.data.code == 200) {
                            this.haveOrdersData = resp.data.datas
                        }
                    })
                }

            },
            goodspage(id) {
                this.$router.push({
                    path: "/GoodsDetails",
                    query: {
                        id: id
                    }
                })
            },
            pay(orderNo) {
               this.$root.rePay(orderNo);
            }
        }
    }
</script>

<style scoped lang="less">
    /deep/ .van-card__price {
        color: #ffa500;
        font-weight: bold;
    }
    /deep/.van-tabs__line{
        background: #ffe268;
    }
    .van-card__title{
        font-weight: bold;
        font-size: 0.3rem;
        height: 0.32rem;
        line-height: 0.32rem;
        max-height: none;
        padding-top: 0.1rem;
    }
    .cePinNav {
        width: 100%;
        padding-bottom: 1.4rem;
        .contentNone {
            padding: 30px 0;
            height: 200px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .contentNoneCon {
                text-align: center;
            }
            .contentNoneIcon {
                font-size: 64px;
            }
            .contentNoneText {
                font-size: 16px;
                font-weight: bold;
                color: black;
            }
            .contentNoneText1 {
                margin-top: 10px;
                margin-bottom: 30px;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.35);
            }
        }
    }
    .listContent {
        margin-top: 5px;
        position: relative;
        .order-time {
            width: 60%;
            position: absolute;
            top: 45px;
            left: 113px;
            .time {
                font-size: 12px;
                color: #727272;
            }
            .order {
                font-size: 12px;
                color: #727272;
                span {
                    color: black;
                }
                button {
                    border-radius: 1px;
                    border: none;
                }
            }
        }
    }

</style>