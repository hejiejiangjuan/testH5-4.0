<template>
    <div class="footprin">
        <div class="footprinTop">
                <div class="footprinTopText" >共{{goodsNum}}条，最多为您保存30条</div>
                <div class="footprinTopIcon"  @click="delPrin"> <span v-if="iconState" @click="delGoods">完成</span><span class="icon" v-else><van-icon name="delete" /></span></div>
        </div>
        <div class="prinGoods" v-for="(item ,index) in goodsData" :key="index" >
            <div class="checkedRadio" v-if="iconState" @click="checkedid(item.id,item.checked)">
                <van-checkbox v-model="item.checked" checked-color="wheat" ></van-checkbox>
            </div>
            <div :class="iconState ?'prinListGoods':'prinListGoods1'" @click="prinGoods(item.appraisalId)">
                <van-card :tag="item.typeName" :price="item.currentPriceStr" :desc="item.subhead" :title="item.title" :thumb="item.picAddr">
                    <div slot="footer">
                       {{item.userNumStr}}人已测
                    </div>
                </van-card>
            </div>
        </div>
        <div class="footText">
            没有更多了
        </div>
    </div>
</template>

<script>
    import Api from "../Api"
    export default {
        name: "FootprintPage",
        data(){
            return{
                checked:false,
                iconState:false,
                goodsData: [],
                goodsNum:0,//足迹的条数
                delData:[],
                myDate:"",
                path:"",
            }
        },
        beforeCreate(){
            this.$axios({
                url:Api.getMyBrowsing,
                method:"get"
            }).then(resp=>{
                if (resp.data.code==200){
                    this.goodsData=resp.data.datas
                    this.goodsNum=resp.data.datas.length
                }
            })
        },
        created(){
            this.myDate=new Date().getTime()
            this.path=window.location.hash
        },
        beforeDestroy() {
            var endtim=new Date().getTime()
            this.$root.myDay(this.myDate,endtim,this.path)
        },
        methods:{
            delPrin(){
            this.iconState=!this.iconState
            },
            checkedid(id,state){
                if (state==false||state==undefined){
                    this.delData.push(id)
                }else {
                    for (let i=0;i<this.delData.length;i++){
                        if (this.delData[i]==id){
                            this.delData.splice(i,1)
                        }
                    }
                }

            },
            delGoods(){
                var  str=this.delData.join(',')
                // var param=new URLSearchParams()
                // param.append("ids",str)
                var param={};
                param.ids=str;
                param=this.$qs.stringify(param)
                this.$axios({
                    url:Api.delBrowsing,
                    method: "post",
                    data:param
                }).then(resp=>{
                    if (resp.data.code==200){
                        location.reload()
                    }
                }).catch(resp=>{
                    console.log(resp.err)
                })
            },
            //跳转至详情
            prinGoods(appraisalId){
                this.$router.push({
                    path:"/GoodsDetails",
                    query:{
                        id:appraisalId
                    }
                })
            }
        },

    }
</script>

<style scoped lang="less">
    /deep/ .van-card__price {
        color: #ffa500;
        font-weight: bold;
    }
    .van-card__title{
        font-size: 0.3rem;
        font-weight: bold;
        height: 0.32rem;
        line-height: 0.32rem;
        max-height: none;
        padding-top: 0.1rem;
    }
    .van-card__footer{
        color: #727272;
    }
    /deep/ .van-card__footer{
        position: absolute;
        bottom:12px;
        right:12px;
    }
    /deep/ .van-card__price{
        margin-top: 28px;
    }
    .footprin{
        padding-bottom: 62px;
    }
    .listGoods{
        position: relative;
    }
    .footText{
        font-size: 14px;
        color: #727272;
        text-align: center;
        margin-top:14px;
    }
    .footprinTop{
        width:92%;
        background: white;
        height:0.2rem;
       border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding:15px;
        .footprinTopText{
            width: 60%;
            font-size:14px;
            color: rgba(0, 0, 0, 0.42);
        }
        .footprinTopIcon{
            width:16%;
            text-align: right;
            font-size:14px;
            .icon{
                font-size:16px;
            }
        }
    }
    .prinGoods{
        display: flex;
        width: 100%;
        justify-content: center;
        flex-direction: row;
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        .checkedRadio{
            padding-left: 15px;
            width:10%;
            /*border: 1px solid black;*/
            background: #fafafa;
        }
        .prinListGoods{
            width: 90%;
        }
        .prinListGoods1{
            width:100%;
        }
    }
</style>