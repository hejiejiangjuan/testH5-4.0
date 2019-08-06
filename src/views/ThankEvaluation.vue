<template>
    <div class="thankEvaluationPage">
        <div class="iconImg">
            <div class="icon"><img src="../assets/imgs/s.png" alt=""></div>
            <div class="infoTexta">
                <p>感谢你的评价！</p>
             <p class="infoText">评价审核中</p>
            </div>
        </div>

        <div class="shareBtn">
            <p @click="shareShow">推举测评给好友</p>
            <p @click="allEvaluation">查看全部评价</p>
        </div>

        <div class="EvaluationCon" v-if="evaluationData.length!=0">
            <p>接着评下去吧</p>
            <div class="evaluationGoods" v-for="(item ,index) in evaluationData" :key="index">
                <van-card :tag="item.typeName"
                          :title="item.title"
                          :thumb="item.picAddr" >
                    <div slot="footer">
                        <van-button size="small"
                                    style="background: rgba(255,226,104,0.36);border:1px solid rgba(255,164,0,0.48)" @click="evaluation(item.appraisalId,item.id)">去评价
                        </van-button>
                    </div>
                </van-card>
                <p class="desc">您于{{item.testDateFormat}}完成了此测评，还没有发表评价哦..</p>
            </div>
        </div>
        <div class="evaluationCon" v-else>
            <p>猜你想测</p>
            <div class="caiceGoods" v-for="(item ,index) in caiceTest" :key="index" @click="GoodsDetails(item.appraisalId)">
                <van-card :tag="item.typeName"
                          :price="item.currentPriceStr" :desc="item.subhead"
                          :title="item.title"
                          :thumb="item.picAddr" >
                    <div class="footText" slot="footer">
                        {{item.userNumStr}}人已测
                    </div>
                </van-card>
            </div>
        </div>
        <!--<div class="myEvaluation-foot">
            <div class="myEvaluation-img">
                <img src="../assets/imgs/weiXin.jpg" alt="">
            </div>
            <p>添加“元气丸子”微信号，想她提更多宝贵、好玩的建议！</p>
        </div>-->

        <van-popup v-model="show"  ></van-popup>
        <div class="maskImg" v-if="show">
            <img src="../assets/imgs/timg.jpg" alt="">
        </div>
    </div>
</template>

<script>
    import Api from "../Api"
    export default {
        name: "ThankEvaluation",
        data() {
            return {
                evaluationData: [],//模拟没有评价的数据
                caiceTest: [],//模拟猜测数据
                appraisalId:"",//传下来的测试唯一标识id
                show:false,
                userRecordId:"",//测试记录唯一标识id
            }
        },

        created() {
            this.appraisalId=this.$route.query.id
            // this.userRecordId=this.$route.query.userRecordId
            this.initPage()
            this.initCaice()
        },
        methods: {
            //初始化未评论的数据
            initPage(){
                this.$axios({
                    url:Api.getUnEvaluateList,
                    method:"post"
                }).then(resp=>{
                    if (resp.data.code==200){
                        this.evaluationData=resp.data.datas
                    }
                })
            },
            //初始化猜测的数据
            initCaice(){
                // var param=new URLSearchParams()
                // param.append("appraisalId",this.appraisalId)
                var param={}
                param.appraisalId=this.appraisalId;
                param=this.$qs.stringify(param)
                this.$axios({
                    url: Api.getRecommendByTypeId,
                    method: "post",
                    data:param
                }).then(resp=>{
                    this.caiceTest=resp.data.datas
                })
            },
            //跳转详情页
            GoodsDetails(id){
                this.$router.push({
                    path: "/GoodsDetails",
                    query: {
                        id: id
                    }
                })
            },
            //查看所有评价
            allEvaluation() {
                this.$router.push({
                    path: "/PingJia",
                    id:this.appraisalId,

                })
            },
            //分享弹出层
            shareShow(){
                this.show=!this.show
            },
            //去评价
            evaluation(id,userRecordId){
                this.$router.push({
                    path: "/EvaluationPage",
                    query:{
                        appraisalId:id,
                        appUserRecordId:userRecordId

                    }
                })
            },

        }
    }
</script>

<style scoped lang="less">
    .infoText{
        font-size: 0.2rem;
        color: #727272;
        /*text-align: center;*/
        margin: 0.1rem;
        /*line-height: 1.2rem;*/
    }
    .thankEvaluationPage{
        position: relative;
    }
    .maskImg {
        width: 3rem;
        height: 3rem;
        position: fixed;
        top: 29px;
        right: 27px;
        z-index: 2100;

        img {
            width: 3rem;
            height:3rem;
        }
    }
    .van-card__title {
        font-size: 0.3rem;
        font-weight: bold;
    }

    .iconImg {
        display: flex;
        justify-content: center;
        /*border: 1px solid black;*/
        height: 1.4rem;
        /*margin-top: 20px;*/

        .icon {
            /*border: 1px solid black;*/
            padding-top: 0.2rem;
        }

        .infoTexta {
            margin-left: 0.4rem;
            font-weight: bold;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            p:first-child{
                margin: 0;
                font-size: 0.32rem;
            }
        }
    }

    .shareBtn {
        display: flex;
        justify-content: space-between;
        /*border: 1px solid black;*/
        margin-top: 0.1rem;
        padding: 0 0.3rem;

        p {
            /*border: 1px solid black;*/
            font-size: 0.28rem;
            border-radius: 3px;
            width: 48%;
            text-align: center;
            padding: 0.1rem 0;
            background: #ffe268;
        }
    }

    .myEvaluation-foot {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 0.6rem;

        .myEvaluation-img {
            width: 1.2rem;
            height: 1.2rem;
            position: relative;

            img {
                width: 1.2rem;
                position: absolute;
                top: 0;
                height: 1.2rem;
            }
        }

        p {
            font-size: 0.24rem;
            width: 50%;
            text-align: center;
            color: #9d9d9d;
        }
    }

    .EvaluationCon {
        p {
            font-size: 0.3rem;
            color: #727272;
            padding: 0 0.3rem;
        }

        .evaluationGoods {
            position: relative;
            padding-top: 8px;
            background: #fafafa;
            margin-top: 0.2rem;

            .desc {
                position: absolute;
                font-size: 0.24rem;
                color: #727272;
                top: 32px;
                left: 101px;
                /*border: 1px solid black;*/
                width: 56%;
            }
        }
    }

    .evaluationCon {
        display: flex;
        align-items: center;
        flex-direction: column;

        p {
            font-size: 0.3rem;
            color: #727272;
            padding: 0 0.3rem;
            width: 90%;
            /*border: 1px solid black;*/
        }

        .caiceGoods {
            position: relative;
            padding-top: 8px;
            background: #fafafa;
            border: 1px solid rgba(0, 0, 0, 0.14);
            width: 90%;
            border-radius: 3px;
            margin-top: 0.2rem;

            .footText {
                position: absolute;
                bottom: 0.3rem;
                right: 0.3rem;
                color: #727272;
            }
        }

    }

    .van-card__price {
        padding-top: 20px;
        color: #ffa500;
    }
</style>