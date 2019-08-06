<template>
    <div class="feedback">
        <div class="feedback-con">
            <div class="feedback-card pluss" @click="subFeedback">
                <div>
                    <p>问题反馈</p>
                    <p>留下您的建议或反馈，帮助商家做的更好</p>
                </div>
                <div class="myIcon">
                    <van-icon name="edit" />
                </div>
            </div>

        </div>
<!--        <div class="feedback-text-title">-->
<!--            <p>您的反详情</p>-->
<!--        </div>-->
        <div class="feedback-text" v-for="(item1 ,index1) in FeedbackData">
            <div class="feedback-card" @click="Feedback(index1)">
                <p>您的反馈详情</p>
                <p>{{item1.createDate}}</p>
                <p :class="index1==active?'feekConOpen':'feekCon'">{{item1.feedbackContent}}</p>
                <div :class="index1==active?'replyImgClose':'replyImg'">
                    <div class="myImgOpen" v-for="(item,index) in item1.pic">
                        <img :src="item.addr" alt="">
                    </div>
                    <div class="reply">
                        <div class="reply-title" v-if="!item1.replyContent">待回复...</div>
                        <div class="reply-title" v-if="item1.replyContent">回复内容：</div>
                        <div class="reply-time" v-if="item1.replyContent">姓名：<span>{{item1.replyUserName}}</span><span>{{item1.replyDate}}</span></div>
                        <div class="reply-con" v-if="item1.replyContent">{{item1.replyContent}}</div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
    import Api from "../Api"
    export default {
        name: "Feedback",
        data(){
            return{
                active:100,
                curPage:1,//当前第几页默认1
                pageSize:10,//每页多少条
                // pic:[],//评价的图片
                FeedbackData:[],//回馈的内容
            }
        },
        mounted(){
            this. feedbackInfo()
        },
        methods:{
            subFeedback(){
                this.$router.push("/FillFeedback")
            },
            //查看反馈详情
            Feedback(index){
                this.show=!this.show
                if (this.show){
                    this.active=index
                }else {
                    this.active=100
                }
            },
            //收起反馈详情
            // closImg(){
            //     this.active=100
            // },
            //获取反馈的意见
            feedbackInfo(){
                // var param =new URLSearchParams()
                // param.append("curPage",this.curPage)
                // param.append("pageSize",this.pageSize)
                var param={};
                param.curPage=this.curPage;
                param.pageSize=this.pageSize;
                param=this.$qs.stringify(param)
                this.$axios({
                    url:Api.getMyFeedback,
                    method:"post",
                    data:param
                }).then(resp=>{
                    if (resp.data.code==200){
                      this.FeedbackData=resp.data.datas
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .feedback{
        padding: 0.2rem 0;
        padding-bottom: 1.2rem;
        .feedback-con{
            display: flex;
            justify-content:center ;
            .pluss{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .myIcon{
                    font-size: 0.4rem;
                    /*border: 1px solid black;*/
                    color: #727272;
                }
            }
           .feedback-card{
               /*border: 1px solid black;*/
               width: 80%;
               padding: 0.3rem 0.3rem;
               border-radius: 3px;
               box-shadow: 0 0 2px rgba(0, 0, 0, 0.18);
               p:nth-child(1){
                   font-size: 0.32rem;
                   font-weight: bold;
                   margin: 0;
               }
               p:nth-child(2){
                   font-size: 0.28rem;
                   margin: 0;
                   margin-top: 0.1rem;
                   color: #727272;
               }
            }

        }
        .feedback-text{
            display: flex;
            justify-content:center ;
            margin-top: 0.1rem;
            .feedback-card{
                /*border: 1px solid black;*/
                .myImgOpen{
                    width: 300px;
                    height: auto;
                    img{
                        width: 300px;
                        height:auto;
                    }
                }
                .reply{
                    border: 1px solid #d8d8d8;
                    padding: 0.1rem 0.1rem;
                    margin-top: 0.2rem;
                    .reply-title{
                        font-size: 0.3rem;
                        color: #727272;
                    }
                    .reply-time{
                        font-size: 0.24rem;
                        color: #727272;
                        span:nth-child(2){
                            padding-left: 0.2rem;
                           display: inline-block;
                        }
                    }
                    .reply-con{
                        font-size: 0.3rem;
                        color: #575757;
                        margin-top: 0.2rem;
                    }
                }
                .replyImg{
                    /*border: 1px solid black;*/
                    width: 300px;
                    height: 0px;
                    overflow: hidden;
                }
                .replyImgClose{
                    width: 300px;
                    height: auto;
                }
                width: 80%;
                padding: 0.3rem 0.3rem;
                border-radius: 3px;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.18);
                p:nth-child(1){
                    font-size: 0.32rem;
                    font-weight: bold;
                    margin: 0;
                }
                p:nth-child(2){
                    font-size: 0.28rem;
                    margin: 0;
                    margin-top: 0.1rem;
                    color: #727272;
                }
                .feekCon{
                    font-size: 0.28rem;
                    margin: 0;
                    margin-top: 0.1rem;
                    color: #727272;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .feekConOpen{
                    font-size: 0.28rem;
                    margin: 0;
                    margin-top: 0.1rem;
                    color: #727272;
                }
                .uoIcon{
                    /*border: 1px solid black;*/
                    text-align: right;
                    padding: 0 0.3rem;
                    margin: 0;
                    font-size: 0.4rem;
                    color: #727272;
                }
            }

        }
    }
</style>