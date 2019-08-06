<template>
    <div class="QuestionTitle">
        <div class="goBtn">
            <van-button style="background: #ffe268;width: 4rem;height: 0.9rem;border: none" type="default" @click="iconImgBtn">立即开始</van-button>
        </div>
        <div class="questionsTitle ">
            <div class="text" v-html="AppraisalHomeContent.content"></div>
        </div>

    </div>


</template>

<script>
    import Api from "../Api"

    export default {
        name: "QuestionTitle",

        data() {
            return {
                AppraisalHomeContent: {},
                orderNo: '',
                myDate: "",
                path: "",

            }
        },
        created() {
            this.initPage()
            this.myDate = new Date().getTime()
            this.path = window.location.hash
        },
        beforeDestroy() {
            var endtim = new Date().getTime()
            this.$root.myDay(this.myDate, endtim, this.path)
        },
        methods: {
            iconImgBtn() {
                if (this.AppraisalHomeContent.divisiveSex == 1) {
                    this.$router.push({
                        path: "/CheckedSex",
                        query: {
                            appraisalId: this.AppraisalHomeContent.id,
                            orderNo: this.orderNo,
                            testTime: this.AppraisalHomeContent.testTime
                        }
                    })
                } else {
                    this.$router.push({
                        path: "/AnswerPage",
                        query: {
                            appraisalId: this.AppraisalHomeContent.id,
                            orderNo: this.orderNo
                        }
                    })
                }
            },
            // 初始化
            initPage() {
                let appraisalId = this.$route.query.appraisalId
                this.orderNo = this.$route.query.orderNo
                // var param = new URLSearchParams()
                // param.append("appraisalId", appraisalId)
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
            }
        }
    }

</script>
<style scoped>
    .text >>> img {
        max-width: 100%;
    }

    .text {
        font-size: 14px;
        padding: 5px;
        text-align: center;
    }

</style>
<style scoped lang="less">
    .questionsTitle{
        /*border: 1px solid black;*/
        padding: 0 23px;
    }
    .QuestionTitle {
        padding-bottom: 115px;
        position: relative;

    }

    .goBtn {
        width: 100%;
        padding-top: 20px;
        position: absolute;
        bottom: 80px;
        text-align: center;
    }

    .questions-title {
        margin-top: 10rem;
        text-align: center;
        font-weight: bold;
        font-size: 1.4rem;
    }

    .questions-text {
        margin-top: 1rem;

        p {
            text-align: center;
            font-size: 14px;
            color: #727272;
        }
    }

    .imgBox {
        display: flex;
        justify-content: center;
        margin-top: 47px;
    }
</style>