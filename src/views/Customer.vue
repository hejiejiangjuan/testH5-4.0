<template>
    <div id="customer">
        <div class="serch">
            <van-search placeholder="请输入用户名" v-model="value"  @blur="inpublur"/>
        </div>
        <div style="width: 100%;height: 1.7rem;z-index: -10;background: white"></div>
        <div class="tabContent">
            <van-tabs v-model="active" @click="onClick">
                <van-tab title="已绑定">
                    <div class="userCon" v-if="myDisClientData.length>0" v-for="(item,index) in myDisClientData">
                        <div class="userIfo" >
                            <div class="custImg">
                                <img :src="item.avatar" alt="">
                            </div>
                            <div class="reward">
                                <p>{{item.nickname}}</p>
                                <p>消费金额：{{item.yuanMoney}}</p>
                            </div>
                        </div>
                    </div>
                    <p class="footText" v-if="myDisClientData.length>0">{{footText}}</p>
                    <div class="userConNone" v-if="myDisClientData.length==0">
                       <div class="custIcon"><van-icon name="coupon-o" /></div>
                        <p>您还没有此类客户</p>
                    </div>
                </van-tab>
                <van-tab title="已解绑">
                    <div class="userCon"  v-for="(item,index) in myDisClientData" v-if="myDisClientData.length>0">
                        <div class="userIfo" >
                            <div class="custImg">
                                <img :src="item.avatar" alt="">
                            </div>
                            <div class="reward">
                                <p>{{item.nickname}}</p>
                                <p></p>
                            </div>
                        </div>
                    </div>
                    <p class="footText" v-if="myDisClientData.length>0">{{footText}}</p>
                    <div class="userConNone" v-if="myDisClientData.length==0">
                        <div class="custIcon"><van-icon name="coupon-o" /></div>
                        <p>您还没有此类客户</p>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    import Api from "../Api"
    export default {
        name: "Customer",
        data(){
            return{
                value:"",//模糊查询的值
                active: 0,
                stuas:1,//
                curPage:1,//当前页默认1
                pageSize:10,//显示多少条
                myDisClientData:[],//我的客户
                footText:"加载更多",
            }
        },
        created() {
            //第一次请求
          this.initCus()
        },
        mounted(){
            window.addEventListener("scroll",this.paging)
        },
        methods:{
            initCus(status,curPage){
                // var param=new URLSearchParams();
                var param={}
                if (this.curPage==1){
                    // param.append("curPage",this.curPage);
                    param.curPage=this.curPage

                } else {
                    // param.append("curPage",curPage);
                    param.curPage=curPage;
                }
                // param.append("pageSize",this.pageSize);
                param.pageSize=this.pageSize;
                if (status==0){
                    // param.append("status",0);
                    param.status=0
                } else if (status==1) {
                    // param.append("status",1);
                    param.status=1
                }else if (!status){
                    // param.append("status",1);
                    param.status=1
                }

                if (this.value){
                    // param.append("searchCon",this.value)
                    param.searchCon=this.value
                }
                param=this.$qs.stringify(param);
                this.$axios({
                    url:Api.getMyDisClient,
                    method:"post",
                    data:param
                }).then(resp=>{
                    if (resp.data.code==200){
                        var myData=resp.data.datas
                       for (var i=0;i<myData.length;i++){
                           this.myDisClientData.push(myData[i])
                       }
                       if (myData.length==0||myData.length<10){
                           this.footText="没有更多"
                       }
                    }
                })
            },
            //点击选择哪类客户
            onClick(index){
                this.myDisClientData=[]
                if (index==1) {
                    this.status=0
                    var status=0
                }else if(index==0){
                    this.status=0
                    var status=1
                }
                this.initCus(status,1)
            },
            //模糊查询
            inpublur(){
                this.myDisClientData=[]
                this.initCus(this.status,1)
            },
            //分页
            paging(){
                //滚动条顶部的高度
                var innerHeight = document.documentElement.scrollTop || document.body.scrollTop;
                //获取屏幕的宽度
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                //可滚动容器超出当前窗口显示范围的高度
                var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                if (scrollHeight==innerHeight+windowHeight){
                    this.curPage=this.curPage+=1
                    var that=this
                    setTimeout(function () {
                        that.initCus(that.index,that.curPage)
                    },400)
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .tabContent{

    }
    /deep/.van-tabs__line{
      background: #00b200;
        width:10px;
    }
    /deep/.van-tabs__nav{
        border-bottom: 1px solid black;
    }
    /deep/.van-tabs__wrap{
        position: fixed;
        top:0.98rem;
    }
   #customer{
       padding-bottom: 1.5rem;
       .serch{
         position: fixed;
           top: 0;
           width: 100%;
           z-index: 10;
       }
   }
   .footText{
       text-align: center;
       font-size: 0.24rem;
       color: #727272;
   }
    .userCon {
        display: flex;
        justify-content: center;
        background-color: white;
        .userIfo {
            width: 100%;
            /*background: white;*/
            border-radius: 5px;
            display: flex;
            justify-content: flex-start;
            padding-left: 0.4rem;
            margin-top: 0.3rem;
            .custImg {
                width: 0.6rem;
                height: 0.6rem;
                border-radius: 50%;
                overflow: hidden;
                position: relative;

                img {
                    position: absolute;
                    top: 0;
                    width:0.6rem;
                    height:0.6rem;
                }
            }

            .reward{
                font-size: 0.3rem;
                padding-bottom: 0.3rem ;
                padding-right: 0.4rem;
                display: flex;
                justify-content: space-between;
                width:83%;
                border-bottom: 1px solid #e4e4e4;
                margin-left: 0.2rem;
                p{
                    margin: 2px;
                }
                p:nth-child(2){
                    color: #727272;
                    font-size:0.22rem ;
                }
            }
        }
    }
    .userConNone{
        /*border: 1px solid blue;*/
        .custIcon{
            font-size: 1.5rem;
            text-align: center;
            color: #aacbff;
        }
        p{
            font-size: 0.3rem;
            color: #727272;
            text-align: center;
        }
    }


</style>