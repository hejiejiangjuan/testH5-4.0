<template>
    <div class="promotionRules">
        <p class="promotionRules-title">推广员等级</p>
        <div class="promotion">
<!--            <div class="promotionRules-con">-->
<!--                <div class="promotionRules-con-title">-->
<!--                    <div class="icon"><van-icon name="diamond"></van-icon></div>-->
<!--                    <div class="promotionRules-con-text">普通推广员</div>-->
<!--                </div>-->
<!--                <p>直接推广佣金比例：25%，间接推广佣金比例：5%</p>-->
<!--                -->
<!--            </div>-->
<!--            <div class="promotionRules-con">-->
<!--                <div class="promotionRules-con-title">-->
<!--                    <div class="icon"><van-icon name="diamond"></van-icon></div>-->
<!--                    <div class="promotionRules-con-text">高级推广员</div>-->
<!--                </div>-->
<!--                <p>直接推广佣金比例：45%，间接推广佣金比例：5%</p>-->
<!--&lt;!&ndash;                <div class="promotionBtn"><p>立即申请</p></div>&ndash;&gt;-->
<!--            </div>-->
            <div class="promotionRules-con promotionRules-cont" v-for="(item,index) in myData">
                <div class="promotionRules-con-title">
                    <div class="icon"><van-icon name="diamond"></van-icon></div>
                    <div class="promotionRules-con-text">{{item.name}}</div>
                </div>
                <p>直接推广佣金比例：{{item.defaultDirectRatio}}%，间接推广佣金比例：{{item.defaultIndirectRatio}}%</p>
                <p  class="promoteThat" v-if="item.id==1">用户成为推广员时，默认是该等级</p>
                <p class="promoteThat" v-if="item.useCus==1">累计推广客户{{item.addupCustomer}}人</p>
                <p class="promoteThat" v-if="item.useInvite==1">累计邀请推广员{{item.addupInvite}}人</p>
                <p class="promoteThat" v-if="item.useCom==1">累计推广金额{{item.addupCommissionYuan}}元</p>
            </div>
        </div>
       <!-- <p class="promotionRules-title">常见问题</p>
        <div class="commonProblems">
            <div class="Problems-con">
                <p class="Problems-title">客户有效期是多久</p>
                <p class="Problems-text">客户永久有效；不可以抢客</p>
            </div>
        </div>-->
    </div>
</template>

<script>
    import Api from '../Api'
    export default {
        name: "PromotionRules",
        data(){
            return{
                myData:[],
            }
        },
        mounted() {
            this.motionRules()
        },
        methods:{
            motionRules(){
                this.$axios({
                    url:Api.getShareUserLevelSet,
                    method:"post"
                }).then(resp=>{
                    if(resp.data.code==200){
                       this.myData=resp.data.datas
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
.promotionRules{
    padding: 0 0.3rem;
    .promotionRules-title{
        font-size: 0.3rem;
        font-weight: bold;
    }
}
.promotion{
    background: white;
    border-radius: 3px;
    padding: 0.2rem 0 0.2rem 0.2rem;
    box-shadow: 0 0 3px #d9d9d9;
    .promotionRules-cont{
     border: none!important;
    }
    .promotionRules-con{
        border-bottom: 1px solid rgba(114, 114, 114, 0.27);
        padding-bottom: 0.2rem;
        margin-top: 0.1rem;
        .promotionRules-con-title{
            display: flex;
            justify-content:flex-start;
            .icon{
                font-size: 0.3rem;
                color: #9b704e;
            }
            .promotionRules-con-text{
                font-size: 0.3rem;
                margin-left:0.2rem;
            }
        }
        p:nth-child(2){
            font-size: 0.28rem;
            color: #9b704e;
        }
       .promoteThat{
            font-size: 0.24rem;
            color: #727272;
        }
        .promotionBtn{
            display: flex;
            justify-content: flex-end;
            p{
                font-size: 0.28rem;
                /*border: 1px solid black;*/
                margin: 0;
                margin-right: 0.2rem;
                padding: 0.1rem 0.1rem;
               border-radius: 5px;
                background: #9b704e;
                color: white;
            }

        }
    }
}
/*.commonProblems{
    background: white;
    padding: 0 0 0 0.3rem;
    .Problems-con{
        padding: 0.1rem 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        .Problems-title{
            font-size: 0.28rem;
        }
        .Problems-text{
            font-size: 0.24rem;
            color: #727272;
        }
    }
}*/

</style>