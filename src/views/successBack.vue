<template>
    <div class="successBack">
       <div class="successBack-title">
           <div class="successBack-Icon">
               <p><van-icon name="checked" /></p>
               <p>反馈成功</p>
           </div>
       </div>
        <div class="successBack-text">
            <p>感谢您的反馈，我们将尽快处理</p>
            <p>关注<span>黑豆味道</span>，第一时间接收反馈回复</p>
        </div>
        <div class="succeseCode">
            <div class="codeImg">
                <img src="../assets/imgs/weiXin.jpg" alt="">
            </div>
            <p>长按二维码啊，识别并关注</p>
        </div>
        <div class="backPage">
            <p @click="backPage">返回店铺</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "successBack",
        methods:{
            backPage(){
                this.$router.push("/classificationPage")
            }
        }
    }
</script>

<style scoped lang="less">
.successBack-title{
    display: flex;
    justify-content: center;
    margin-top:0.8rem;
    .successBack-Icon{
        display: flex;
        justify-content: space-between;
        /*border: 1px solid black;*/
        width: 30%;
        p:nth-child(1){
            margin: 0;
            font-size: 0.6rem;
            color: #00b200;
        }
        p:nth-child(2){
            margin: 0;
            font-size: 0.4rem;
        }
    }
}
    .successBack-text{
        display: flex;
        flex-direction: column;
        align-items: center;
        /*border: 1px solid black;*/
        margin-top: 0.4rem;
        p{
            font-size: 0.24rem;
            margin: 0.1rem;
            color: #727272;
            span{
                color: #00b200;
            }
        }
    }
    .succeseCode{
        display: flex;
      flex-direction: column;
        align-items: center;
        margin-top:1.2rem;
        .codeImg{
            img{
                width: 2.4rem;
                height:2.4rem;
            }
        }
        p{
            font-size: 0.2rem;
            color: #727272;
            margin: 0.1rem;
        }
    }
    .backPage{
        display: flex;
        justify-content: center;
        p{
            font-size: 0.34rem;
            text-align: center;
          box-shadow: 0 0 2px #bdbdbd;
            background: rgba(114, 114, 114, 0.12);
            height: 50px;
            line-height: 50px;
            width: 80%;
            border-radius: 3px;
        }
    }
</style>