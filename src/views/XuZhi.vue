<template>
    <div class="xuZhi">
        <div class="xuZhi-neiRon">
            <div class="xuZhi-title">测前提示</div>
            <p class="xuZhi-tiaoKuan" v-html="AppraisalHomeContent.notice"></p>
           <!-- <p class="xuZhi-tiaoKuan">在做题过程中，请注意以下几点:</p>
            <p class="xuZhi-tiaoKuan">1.测试一共 <span>{{AppraisalHomeContent.questionNum}}</span>题，请尽量在<span>{{AppraisalHomeContent.testTime}}</span>分钟内完成；
            </p>
            <p class="xuZhi-tiaoKuan">2.答案没有对错之分，如实作答即可，若遇到难以抉择的问题，请根据第一感觉作答，你的作答将得到严格保密； </p>
            <p class="xuZhi-tiaoKuan">3.如遇到电话、死机等导致测试中断，可到公众号找回； </p>-->
            <div class="xuZhi-btn">
                <van-button style="background: #ffe268;width: 4rem;height: 0.8rem;border: none" type="default" @click="AnswerBtn">好的，Go!</van-button>
            </div>
        </div>
        <div class="warmPrompt">
            <p>温馨提示:</p>
            <p>可到"我的测评"查看所有付费测试的订单状态。</p>
        </div>
    </div>
</template>

<script>
    import Api from "../Api"

    export default {
        name: "XuZhi",
        data() {
            return {
                AppraisalHomeContent: {},
                orderNo: '',
                myDate: "",
                path: "",
            }
        },
        created() {
            this.myDate = new Date().getTime();
            this.path = window.location.hash;
            let appraisalId = this.$route.query.appraisalId;
            this.orderNo = this.$route.query.orderNo;
            // this.AppraisalHomeContent=this.$store.state.checkPage.appraisalHomeContent
            // var param = new URLSearchParams();
            // param.append("appraisalId", appraisalId);
            var param={};
            param.appraisalId=appraisalId;
            param=this.$qs.stringify(param)
            this.$axios({
                url: Api.getAppraisalHomeContent,
                method: "post",
                data: param
            }).then(resp => {
                this.AppraisalHomeContent = resp.data.datas
            })
        },
        beforeDestroy() {
            var endtim = new Date().getTime()
            this.$root.myDay(this.myDate, endtim, this.path)
        },
        methods: {
            AnswerBtn() {
                //判断是否需要进男女选择页
                let appraisalId = this.$route.query.appraisalId
                if (this.AppraisalHomeContent.content != null&&this.AppraisalHomeContent.content!="") {
                    this.$router.push({
                        path: "/QuestionTitle",
                        query: {
                            appraisalId: appraisalId,
                            orderNo: this.orderNo
                        }
                    });
                } else if (this.AppraisalHomeContent.divisiveSex == 1) {
                    this.$router.push({
                        path: "/CheckedSex",
                        query: {
                            appraisalId: appraisalId,
                            orderNo: this.orderNo,
                            testTime: this.AppraisalHomeContent.testTime
                        }
                    })
                } else if (this.AppraisalHomeContent.divisiveSex == 0) {
                    this.$router.push({
                        path: "/AnswerPage",
                        query: {
                            appraisalId: appraisalId,
                            orderNo: this.orderNo,
                            testTime: this.AppraisalHomeContent.testTime
                        }
                    })
                }

            }
        }
    }
</script>
<style scoped>
    .xuZhi-tiaoKuan>>>p{

    }
    .xuZhi-tiaoKuan>>>img{

        max-width: 100%;
    }

</style>
<style scoped lang="less">
    .warmPrompt{
        margin-top:0.16rem;
        p{
            font-size: 0.24rem;
            color: #727272;
            text-align: center;
        }
    }
    .xuZhi {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 15px;
        flex-wrap: wrap;
        /*border: 1px solid black;*/

        .xuZhi-neiRon {
            border: 1px solid rgba(0, 0, 0, 0.17);
            /*height: 200px;*/
            width: 90%;
            padding: 13px;
            border-radius: 10px;
        }
    }

    .xuZhi-title {
        font-size: 16px;
        font-weight: bold;
        color: black;
        text-align: center;
    }

    .xuZhi-tiaoKuan {
        font-size: 14px;
        color: #727272;
        margin: 30px 0;

        span {
            color: black;
            background: #ffe268
        }

    }

    .xuZhi-btn {
        justify-content: center;
        display: flex;
        margin-top: 121px;
    }
</style>