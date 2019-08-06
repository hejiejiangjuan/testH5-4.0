<template>
    <div class="footToPro">
        <div class="listNav">
            <p>店铺主页</p>
            <p>个人中心</p>
            <p>关注我们</p>
            <p>意见反馈</p>
        </div>
        <p class="footCon">黑豆提供技术支持</p>
    </div>
</template>

<script>
    export default {
        name: "FootToPro"
    }
</script>

<style scoped lang="less">
.footToPro{
    background: whitesmoke;
    .listNav{
        /*border: 1px solid black;*/
        display: flex;
        justify-content: center;
        p{
            /*border: 1px solid black;*/
            font-size: 0.2rem;
            color: #2196f3;
            padding: 0 0.3rem;
        }
        p:nth-child(2){
            border-right: 1px solid #727272;
            border-left: 1px solid #727272;
        }
        p:nth-child(3){
            border-right: 1px solid #727272;
        }

    }
    .footCon{
        font-size: 0.2rem;
        color: #727272;
        text-align: center;
    }
}
</style>