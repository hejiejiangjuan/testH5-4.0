<template>
    <div class="withdrawal">
        <div class="Withdrawal-box">
            <div class="Withdrawal-con">
                    <p class="Withdrawal-con-title">提现金额</p>
                    <p class="Withdrawal-con-num"><van-field v-model="value" type="number" label="￥" placeholder="输入金额" @input="inputNum"/></p>
                    <p class="info" v-if="value>myMoney">{{info}}</p>
                <div class="detail" @click="accountDetails">账户明细 <span><van-icon name="arrow" /></span></div>
                <div class="withdrawal-btn">
                    <p @click="stabilization">提现</p>
                </div>
            </div>
        </div>
        <div class="failure">
            <div class="failureOrders" v-for="(item,index) in drawErroData" @click="stab(item.withdrawOrderNo)">
                <div class="failureImg">
                    <img src="../assets/imgs/Money.png" alt="">
                </div>
                <div class="failureInfo">
                    <div class="Infotitle"><p>零钱提现</p><p>失败</p></div>
                    <p class="infoTime">{{item.createDate}}</p>
                </div>
            </div>
        </div>
        <van-popup v-model="show" :close-on-click-overlay="false">
            <div class="prompt">
                <p>提现成功！</p>
                <p>提现成功，请到微信零钱查看!</p>
                <p @click="promptBtn">确认</p>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import Api from "../Api"
    import { Toast } from 'vant';
    export default {
        name: "Withdrawal",
        data(){
            return{
                value:"",
                myMoney:"",//我的金额
                info:"",
                drawErroData:[],//提现失败账单
                time:false,
                timer:false,
                show:false

            }
        },
        mounted(){
this.getMymoney()
        },
        methods:{
            //提现成功后的跳转
            promptBtn(){
                this.$router.push("/ToPromote")
            },
            //跳转提现细则
            accountDetails(){
                this.$router.push("/AccountDetails")
            },
            //获取我的金额
            getMymoney(){
                this.$axios({
                    url: Api.getMyDisInfo,
                    method:"post",
                }).then(resp=>{
                    if (resp.data.code==200){
                        this.myMoney=resp.data.datas.balance
                    }
                })
            },
            //输入提现金额
            inputNum(){
                    if (this.value>this.myMoney){
                        this.info="超出提现金额"
                    }
            },
            //防抖
            stabilization(){
                var that=this
                clearTimeout(that.tieme)
                that.tieme=setTimeout(function () {
                    that.createOrder()
                },400)
            },
        //提现
            createOrder(){
                // var param=new URLSearchParams()
                var param={}
                if (this.value!=""){
                    if (this.value<=this.myMoney){
                        // param.append("yuanPrice",this.value)
                        param.yuanPrice=this.value
                        param=this.$qs.stringify(param)
                    } else {
                        Toast.fail('余额不足');
                        return
                    }
                }else {
                    Toast.fail('请输入提现金额');
                    return;
                }
                this.$axios({
                    url:Api.createEntOrder,
                    method:"post",
                    data:param
                }).then(resp=>{
                    if (resp.data.code==500){
                        Toast.fail(resp.data.message);
                        this.drawErroOrder()
                    }else if (resp.data.code==200){
                       this.show=!this.show
                        this.value=""
                    }
                })
            },
            //体现失败
            drawErroOrder(){
                this.$axios({
                    url:Api.getMyWithdrawErroOrder,
                    method:"post",
                }).then(resp=>{
                    if (resp.data.code==200){
                        this.drawErroData=resp.data.datas
                    }
                })
            },
            //重新体现防抖
            stab(OrderNo){
                var that=this
                that.tiemer=setTimeout(()=> {
                   clearTimeout(that.tiemer)
                   that.entOrder(OrderNo)
                },400)
            },
            //重新体现
            entOrder(OrderNo){
                // var param=new URLSearchParams()
                // param.append("withdrawOrderNo",OrderNo)
                var param={};
                param.withdrawOrderNo=OrderNo
                param=this.$qs.stringify(param)
                this.$axios({
                    url:Api.reEntOrder,
                    method:"post",
                    data:param,
                }).then(resp=>{
                    if (resp.data.code==500){
                        Toast.fail('提现失败');
                    }else if (resp.data.code==200){
                        this.show=!this.show
                        this.drawErroData=[]
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .prompt{
        width: 6rem;
        height:4rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        p:nth-child(1){
            font-size: 0.3rem;
            color: #727272;
            text-align: center;
            width:80%;
            margin-top:1rem;
            margin-bottom: 0.1rem;
        }
        p:nth-child(2){
            font-size: 0.3rem;
            color: #727272;
            text-align: center;
            width: 80%;
            margin: 0;
        }
        p:nth-child(3){
            font-size: 0.34rem;
            background: #00b200;
            width: 20%;
            border-radius: 3px;
            text-align: center;
            color: white;
            height: 0.8rem;
            line-height: 0.8rem;
        }
    }
    .failure{
        /*border: 1px solid black;*/
        display: flex;
       flex-direction: column;
        align-items: center;
        width: 100%;
        .failureOrders{
            display: flex;
            justify-content: center;
           box-shadow: 0 0 2px rgba(0, 0, 0, 0.22);
            width: 90%;
            border-radius: 3px;
           background: white;
            margin-top: 0.2rem;
            padding: 0.1rem 0;
            .failureImg{
                /*border: 1px solid black;*/
                width:0.65rem;
                height:0.65rem;
                border-radius: 50%;
                margin-top: 0.05rem;
                overflow: hidden;
                position: relative;
                img{
                    position: absolute;
                    top: 0;
                    left: 0;
                    /*border: 1px solid black;*/
                    /*width: 1rem;*/
                    /*height: 1rem;*/
                }
            }
            .failureInfo{
                /*border: 1px solid black;*/
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width:76%;
                .Infotitle{
                    font-size: 0.28rem;
                    margin: 0;
                    display: flex;
                    justify-content: space-between;
                    width:93%;
                    padding-left: 0.4rem;
                    margin-bottom: 0.1rem;
                    p{
                        margin: 0;
                    }
                    p:nth-child(2){
                        color: red;
                    }
                }
              .infoTime{
                    font-size: 0.24rem;
                    color: #727272;
                    margin: 0;
                  /*border: 1px solid black;*/
                  width:93%;
                  padding-left: 0.4rem;

                }
            }
        }
    }
    /deep/.van-field__label{
        max-width: 34px;
        span{
            font-weight: bold;
        }
    }
    .withdrawal{
        padding: 0.3rem 0;
    }
.Withdrawal-box{
   /*border: 1px solid black;*/
    display: flex;
    justify-content: center;
    .Withdrawal-con{
        background: white;
        width:85%;
        padding: 0.3rem 0.2rem;
        box-shadow: 0 0 3px rgba(140, 140, 140, 0.18);
        border-radius: 5px;
        .Withdrawal-con-title{
            font-size: 0.28rem;
            /*color: #727272;*/
            text-align: center;
        }
        .Withdrawal-con-num{
            font-size: 0.36rem;
            text-align: center;
            margin: 0;
            span{
                font-size: 0.5rem;
                font-weight: bold;
            }
        }
        .info{
            font-size: 0.20rem;
            color: red;
            margin: 0;
            padding:0 0.6rem;
        }
        .detail{
            font-size: 0.24rem;
            color: #2196f3;
            text-align: center;
            /*border: 1px solid black;*/
            position: relative;
                i{
                    color: #727272;
                    position: absolute;
                    top: 3px;
                }

        }
        .withdrawal-btn{
           display: flex;
            justify-content: center;
            p{
                font-size: 0.3rem;
                background: #00b200;
                width: 70%;
                text-align: center;
                height:0.6rem;
                line-height: 0.6rem;
                color: white;
                border-radius: 5px;
                letter-spacing: 5px;
            }
        }
    }
}
</style>