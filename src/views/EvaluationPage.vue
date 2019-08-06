<template>
    <div id="evaluationPage">
        <div class="evaluationPage-uesr">
            <div class="user-img">
                <img :src="appraisalInfo.picAddr" alt="">
            </div>
            <p class="user-title">{{appraisalInfo.title}}</p>
        </div>
        <div class="evaluationPage-box" v-if="appEvaluate==null">
            <div class="evaluationPage-con">
                <div class="evaluationPage-con-titel">
                    <p>该评测对你有帮助吗?</p>
                    <div class="evaluationPage-con-rate">
                        <p>题目易懂性</p>
                        <van-rate v-model="valuea" @change="changeValA" :gutter="15"/>
                        <p class="level">{{understandabilityLevel}}</p>
                    </div>
                    <div class="evaluationPage-con-rate">
                        <p>结果准确性</p>
                        <van-rate v-model="valueb" @change="changeValB"/>
                        <p class="level">{{veracityLevel}}</p>
                    </div>
                    <div class="evaluationPage-con-rate">
                        <p>建议实用性</p>
                        <van-rate v-model="valuec" @change="changeValC"/>
                        <p class="level">{{practicabilityLevel}}</p>
                    </div>
                </div>
            </div>
            <div class="InputBox">
                <van-cell-group>
                    <van-field v-model="value1" @input="input" :autosize="{maxHeight: 300}" maxlength="150" type="textarea"
                               placeholder="说说你的测试心得，分享给想测得Ta们吧..."/>
                </van-cell-group>
                <p>剩余{{strNum}}字</p>
            </div>
            <div class="submit">
                <p class="subText">评论内容经审核通过后会正式发布</p>
                <p class="niMing">匿名</p>
                <div class="swp">
                    <van-switch v-model="checked" size="16px" active-color="#fff77c" @change="checkedSwi"/>
                </div>
                <p class="release" @click="onSubmit">发布</p>
            </div>
        </div>
        <div v-else>
            <div class="myEvaluation">
                <div class="myEvaluation-time">
                    <p>{{createTime}}</p>
                    <van-button type="default" size="small" @click="delEvaluation" v-if="appEvaluate.status!=1">删除该评价</van-button>
                </div>
                <div class="evaluationPage-con-rate">
                    <p>题目易懂性</p>
                    <van-rate v-model="valueA" :readonly="true"/>
                    <p class="level">{{understandabilityLevel}}</p>
                </div>
                <div class="evaluationPage-con-rate">
                    <p>结果准确性</p>
                    <van-rate v-model="valueB" :readonly="true"/>
                    <p class="level">{{veracityLevel}}</p>
                </div>
                <div class="evaluationPage-con-rate">
                    <p>建议实用性</p>
                    <van-rate v-model="valueC" :readonly="true"/>
                    <p class="level">{{practicabilityLevel}}</p>
                </div>
                <div class="myEvaluation-con">
                    {{appEvaluate.experience}}
                </div>
            </div>
          <!--  <div class="myEvaluation-foot">
                <div class="myEvaluation-img">
                    <img src="../assets/imgs/weiXin.jpg" alt="">
                </div>
                <p>添加“元气丸子”微信号，想她提更多宝贵、好玩的建议！</p>
            </div>-->
        </div>

    </div>
</template>

<script>
    import Api from "../Api"
    export default {
        name: "EvaluationPage",
        data() {
            return {
                valuea:0,
                valueb:0,
                valuec:0,
                valueA: 0,//易懂性星星的值
                valueB: 0,//准确性星星的值
                valueC: 0,//实用性星星的值
                value1: "",//文本框的值
                strNum:150,
                checked: false,
                appraisalInfo:{},//测评人员的信息
                appEvaluate:{},//测试评分的内容
                appraisalId:"",//测试唯一标识id
                understandability:0,//题目易懂
                veracity:0,//准确性
                practicability:0,//实用
                experience:"",//评价内容
                anonymity:0,//是否匿名，默认0（不匿名）
                createTime:"",//时间
                understandabilityLevel:"",
                veracityLevel:"",
                practicabilityLevel:"",
                userRecordId:"",//测试记录唯一标识id
            }
        },
        created(){
           this.getExperienceData()

        },
        methods: {
            //请求初始化
            getExperienceData(){
                this.userRecordId=this.$route.query.appUserRecordId
                this.appraisalId=this.$route.query.appraisalId
                // var param=new  URLSearchParams()
                // param.append("appraisalId",this.appraisalId)
                // param.append("userRecordId",this.userRecordId)

                var param={};
                param.appraisalId=this.appraisalId;
                param.userRecordId=this.userRecordId;
                param=this.$qs.stringify(param);
                this.$axios({
                    url:Api.getMyEvaluate,
                    method:"post",
                    data:param,
                }).then(resp=>{
                    if (resp.data.code==200){
                        this.createTime=resp.data.datas.createTime
                        this.appraisalInfo=resp.data.datas.appraisalInfo
                        this.appEvaluate=resp.data.datas.appEvaluate
                        if (resp.data.datas.appEvaluate!=null){
                            this.appEvaluate=resp.data.datas.appEvaluate
                            this.valueA=Math.floor(resp.data.datas.appEvaluate.understandability)
                            this.valueB=Math.floor(resp.data.datas.appEvaluate.veracity)
                            this.valueC=Math.floor(resp.data.datas.appEvaluate.practicability)
                            if (this.valueA==1){
                                this.understandabilityLevel="很差"
                            }else if (this.valueA==2){
                                this.understandabilityLevel="差"
                            } else if(this.valueA==3){
                                this.understandabilityLevel="一般"
                            }else if (this.valueA==4){
                                this.understandabilityLevel="好"
                            } else if (this.valueA==5){
                                this.understandabilityLevel="很好"
                            }
                            if (this.valueB==1){
                                this.veracityLevel="很差"
                            }else if (this.valueB==2){
                                this.veracityLevel="差"
                            } else if(this.valueB==3){
                                this.veracityLevel="一般"
                            }else if (this.valueB==4){
                                this.veracityLevel="好"
                            } else if (this.valueB==5){
                                this.veracityLevel="很好"
                            }
                            if (this.valueC==1){
                                this. practicabilityLevel="很差"
                            }else if (this.valueC==2){
                                this. practicabilityLevel="差"
                            } else if(this.valueC==3){
                                this. practicabilityLevel="一般"
                            }else if (this.valueC==4){
                                this. practicabilityLevel="好"
                            } else if (this.valueC==5){
                                this. practicabilityLevel="很好"
                            }
                        }
                    }
                })
            },
            //输入文本框的内容
            input(e) {
                this.experience=e
                if (this.strNum >= 0 && e.length <= 150) {
                    this.strNum = 150 - e.length
                }
            },
            //删除评论
            delEvaluation(){
                // let param=new URLSearchParams()
                // param.append("appEvaluateId",this.appEvaluate.id)
                var param={};
                param.appEvaluateId=this.appEvaluate.id;
                param=this.$qs.stringify(param);
                this.$axios({
                    url: Api.delMyEvaluate,
                    method: "post",
                    data:param
                }).then(resp=>{
                if (resp.data.code==200){
                    this.getExperienceData()

                }
                })

            },
            // 获取星星的数据
            changeValA(e){
                this.understandability=parseFloat(e).toFixed(1)

                if (e==1){
                    this.understandabilityLevel="很差"
                }else if (e==2){
                    this.understandabilityLevel="差"
                } else if(e==3){
                    this.understandabilityLevel="一般"
                }else if (e==4){
                    this.understandabilityLevel="好"
                } else if (e==5){
                    this.understandabilityLevel="很好"
                }
            },
            changeValB(e){
               this.veracity=parseFloat(e).toFixed(1)
                if (e==1){
                    this.veracityLevel="很差"
                }else if (e==2){
                    this.veracityLevel="差"
                } else if(e==3){
                    this.veracityLevel="一般"
                }else if (e==4){
                    this.veracityLevel="好"
                } else if (e==5){
                    this.veracityLevel="很好"
                }
            },
            changeValC(e){
               this.practicability=parseFloat(e).toFixed(1)

                if (e==1){
                    this. practicabilityLevel="很差"
                }else if (e==2){
                    this. practicabilityLevel="差"
                } else if(e==3){
                    this. practicabilityLevel="一般"
                }else if (e==4){
                    this. practicabilityLevel="好"
                } else if (e==5){
                    this. practicabilityLevel="很好"
                }
            },
            //判断是否匿名
            checkedSwi(bool){
                if (bool){
                    this.anonymity=1
                } else {
                    this.anonymity=0
                }
            },
            //提交评价
            onSubmit(){
                // var param=new URLSearchParams()
                var param={}
                var paramObj = {
                    "understandability":this.understandability,
                    "appraisalId":this.appraisalId,
                    "veracity":this.veracity,
                    "practicability":this.practicability,
                    "experience":this.experience,
                    "anonymity":this.anonymity,
                    "userRecordId":this.userRecordId
                }
                // param.append("appEvaluateStr",JSON.stringify(paramObj))
                param.appEvaluateStr=JSON.stringify(paramObj);
                param=this.$qs.stringify(param)
                this.$axios({
                    url:Api.addEvaluate,
                    method:"post",
                    data:param
                }).then(resp=>{
                    if (resp.data.code==200){
                        //跳转感谢页面
                        this.$router.push({
                            path:"/ThankEvaluation",
                            query:{
                                id:this.appraisalId,
                                userRecordId:this.userRecordId
                            }
                            })
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .van-rate {
        font-size: 0.66rem;
    }
    .myEvaluation-foot{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top:0.6rem;
        .myEvaluation-img{
            width:1.2rem;
            height:1.2rem;
            position: relative;

            img{
                width: 1.2rem;
                position: absolute;
                top: 0;
                height:1.2rem;
            }
        }
        p{
            font-size: 0.24rem;
            width: 50%;
            text-align: center;
            color: #9d9d9d;
        }
    }
    .myEvaluation{
        background: white;
        padding:0.3rem 0.3rem;
        .myEvaluation-time{
            display: flex;
            justify-content: space-between;
            /*border: 1px solid black;*/
            height:0.6rem;
            line-height:0.6rem;
            p{
                font-size: 0.24rem;
                margin: 0;
                color: #959595;
            }
        }
        .myEvaluation-con{
            font-size: 0.28rem;
            padding-top: 0.3rem;
        }
    }
    .evaluationPage-con-rate {
        /*border: 1px solid black;*/
        display: flex;
        justify-content: flex-start;
        align-items: center;

        p {
            font-size: 0.28rem;
            color: #727272;
            padding-right:0.3rem;
            padding-top: 0.1rem;
            /*border: 1px solid black;*/

        }
        .level{
            /*border: 1px solid black;*/
            width: 100px;
            text-align: center;
            padding-top: 0.1rem;
        }
    }
    .evaluationPage-uesr {
        border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.2rem 0.3rem;
        background: white;
        .user-img {
            width: 1rem;
            height: 1rem;
            position: relative;

            img {
                width: 1rem;
                height: 1rem;
                position: absolute;
                top: 0;
            }
        }

        .user-title {
            font-size: 0.36rem;
            width: 80%;
            font-weight: bold;
        }
    }

    .evaluationPage-box {
        .evaluationPage-con {
            padding: 0 0.3rem;
            background: white;
            .evaluationPage-con-titel {
                padding: 0.44rem 0;

                p {
                    font-size: 0.24rem;
                    margin: 0;
                }
            }
        }

        .InputBox {
            margin-top: 0.3rem;
            height: 3.52rem;
            background: white;
            position: relative;

            .van-cell-group {
                height: 3.52rem;
            }

            p {
                font-size: 0.24rem;
                color: #727272;
                position: absolute;
                bottom: 0;
                right: 0.4rem;
            }
        }

        .submit {
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            display: flex;
            justify-content: flex-start;
            padding: 0 0.2rem;
            align-items: center;
            background: white;
            .swp {
                /*border: 1px solid black;*/
                font-size:0.48rem;
            }
            .subText{
                color: #727272;
                font-size: 0.24rem;
                margin: 0;
                line-height:0.8rem;
            }
            .niMing{
                font-size: 0.24rem;
                color: black;
                margin: 0 5px;
                line-height: 0.8rem;
            }
            .release{
                font-size: 0.24rem;
                color: black;
                margin: 0 ;
                margin-left: 0.48rem;
                line-height: 0.6rem;
                /*border: 1px solid black;*/
                height: 0.6rem;
                width: 1.6rem;
                text-align: center;
                border-radius: 3px;
                background: #d8d8d8;
            }
        }
    }


</style>