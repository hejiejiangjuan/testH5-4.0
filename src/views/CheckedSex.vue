<template>
    <div class="CheckedSex animated bounceInUp">
        <div class="CheckedSex-box">
            <div class="CheckedSex-title">请选择性别</div>
            <div class="CheckedSex-decs">为确保测试结果的信度，请先选择性别!</div>
            <div class="CheckedSexBox">
                <div class="CheckedSex-img">
                    <div class="CheckedSex-img-b" v-for="(item,index) in sexData" @click="topicPage(item.id)"><img :src="item.src" alt="">
                        <div class="sex">{{item.sex}}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    export default {
        name: "CheckedSex",
        data() {
            return {
                sexData: [
                    {
                        id: 1,
                        src: require("../assets/imgs/bb.png"),
                        sex:'男生'
                    },
                    {
                        id: 2,
                        src: require("../assets/imgs/gg.png"),
                        sex:'女生'
                    }
                ],
                myDate: "",
                path: "",
            }
        },
        created() {
            this.myDate = new Date().getTime()
            this.path = window.location.hash
        },
        beforeDestroy() {
            var endtim = new Date().getTime()
            this.$root.myDay(this.myDate, endtim, this.path)
        },
        methods: {
            topicPage(gender) {
                let appraisalId = this.$route.query.appraisalId
                let orderNo = this.$route.query.orderNo
                let testTime = this.$route.query.testTime
                this.$router.push({
                    path: "/AnswerPage",
                    query: {
                        gender: gender,
                        appraisalId: appraisalId,
                        orderNo: orderNo,
                        testTime: testTime
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .CheckedSex-title {
        font-size: 0.4rem;
        font-weight: bold;
        /*color: #727272;*/
        margin: 1.4rem 0 0px 0;
        text-align: center;
    }
.CheckedSex-decs{
    font-size: 0.28rem;
    color: #727272;
    text-align: center;
    width:50%;
    margin: 0.3rem;
}
.CheckedSex-box{
    border: 3px solid rgba(0, 0, 0, 0.1);
    display: flex;
   border-radius: 5px;
    align-items: center;
    flex-direction:column;
    width:85%;
    height: 350px;
}
.CheckedSex{
    /*border: 1px solid black;*/
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
   width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    }
    .CheckedSexBox {
        display: flex;
        justify-content: center;
        /*border: 1px solid black;*/
        width: 100%;
        .CheckedSex-img {
            display: flex;
            width: 48%;
            justify-content: space-between;
            .CheckedSex-img-b {
                .sex{
                    font-size: 0.3rem;
                    text-align: center;
                }

            }
        }
    }

</style>