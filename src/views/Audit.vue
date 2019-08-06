<template>
    <div class="audit">
        <div class="audit-icon"><van-icon name="clock" /></div>
        <p>商家审核中</p>
        <p class="audit-con">商家审核通过后，您可以推广佣金</p>
        <div class="auditBtn"><p @click="auditBtn">查看更多测评</p></div>
    </div>
</template>

<script>
    export default {
        name: "Audit",
        methods:{
            auditBtn(){
                this.$router.push("/classificationPage")
            }

        }
    }
</script>

<style scoped lang="less">
    .audit-icon{
        /*border:1px solid black ;*/
        text-align: center;
        color: #2196f3;
        padding-top: 0.2rem;
        margin-top:0.8rem;
    }
    p{
        font-size: 0.3rem;
        text-align: center;
    }
    .audit-con{
        font-size: 0.20rem;
        color: #727272;
        text-align: center;
        margin: 0;
    }
    .auditBtn{
        display: flex;
        justify-content: center;
        margin-top:0.8rem;
        p{
            font-size: 0.3rem;
            background: #9b704e;
            width: 80%;
            height: 0.6rem;
            border-radius: 3px;
            line-height:0.6rem;
            text-align: center;
            color: white;
        }
    }
</style>