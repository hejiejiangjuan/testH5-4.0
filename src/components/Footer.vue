<template>
    <div class="footer">
        <div class="footBtn">
            <van-button size="normal" type="default" @click="FindMore">查看更多...</van-button>
        </div>
        <div class="footText">黑豆提供内容及技术支持</div>
    </div>
</template>

<script>
    export default {
        name: "Footer",
        methods:{
            FindMore(){
                this.$router.push("/classificationPage")
            }
        }
    }
</script>

<style scoped lang="less">
    .van-button {
        width: 170px;
        background: white;
    }
    .footer{
        padding-bottom:1rem;
        width: 100%;
        background: #e4e4e4;
        overflow: hidden;
        .footBtn{
            width: 100%;
            text-align: center;
            /*margin-top: 20px;*/
        }
        .footText{
            font-size: 10px;
            text-align: center;
            margin-top:0.4rem;
        }
    }
</style>