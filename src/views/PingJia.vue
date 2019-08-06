<template>
    <div class="pingJia">
        <div class="pingJia-title">用户评价</div>
        <div class="commentDetails" v-for="(item,index) in myEvaluate">
            <div class="userImg">
                <img :src="item.avatar" alt="">
            </div>
            <div class="user-Details">
                <p><span>{{item.nickname}}</span><span>{{item.formatCreateTime}}</span></p>
                <p>{{item.experience}}</p>
            </div>
        </div>
        <div class="footText">{{footerTex}}</div>
    </div>
</template>

<script>
    import Api from "../Api"
    export default {
        name: "PingJia",
        data(){
            return{
                pageSize:1,//当前第几页
                pageNum:10,//默认一页显示多10条
               myEvaluate:[],//评价页的数据
                footerTex:""
            }
        },
        created() {
            //监听滚动条事件
            window.addEventListener("scroll",this.onScorll)
            //请求本页数据
            let appraisalId=this.$route.query.id
            // var param= new URLSearchParams();
            // param.append("apprasailId",appraisalId)
            // param.append("curPage",this.pageSize)
            // param.append("pageSize",this.pageNum)

            var param={};
            param.apprasailId=appraisalId;
            param.curPage=this.pageSize;
            param.pageSize=this.pageNum;
            param=this.$qs.stringify(param)
            this.$axios({
                url:Api.getEvaluateList,
                method:"post",
                data:param
            }).then(resp=>{
                this.myEvaluate=resp.data.datas
                if (resp.data.datas.length<10){
                    this.footerTex="没有更多"
                }
                if (resp.data.datas.length==10){
                    this.footerTex="加载更多"
                }
            })

        },
        methods:{
            onScorll(){
                //获取滚动条到顶部高度
                let innerHeight=document.documentElement.scrollTop||document.body.scrollTop
                //获取屏幕的高度
                let windowHeight=document.documentElement.clientHeight||document.body.clientHeight
                //获取当前容器的高度
                let scorHeight=document.documentElement.scrollHeight||document.body.scrollHeight
                if (innerHeight+windowHeight==scorHeight){
                    //发起请求
                    let appraisalId=this.$route.query.id
                   let pageSie=this.pageSize+=1
                    // var param= new URLSearchParams();
                    // param.append("apprasailId",appraisalId)
                    // param.append("curPage",pageSie)
                    // param.append("pageSize",this.pageNum)

                    var param={};
                    param.apprasailId=appraisalId;
                    param.curPage=pageSie;
                    param.pageSize=this.pageNum;
                    param=this.$qs.stringify(param)
                    this.$axios({
                        url:Api.getEvaluateList,
                        method:"post",
                        data:param
                    }).then(resp=>{
                        for (let i=0;i<resp.data.datas.length;i++){
                            this.myEvaluate.push(resp.data.datas[i])
                        }
                        if (resp.data.datas.length==0){
                            this.footerTex="没有更多"
                        }
                    })
                }

            }
        }
    }
</script>

<style scoped lang="less">
    .footText{
        font-size: 0.24rem;
        color: #727272;
        text-align: center;
    }
    .pingJia {
        padding: 20px;
        .pingJia-title {
            font-size: 0.32rem;
            color: #4b4b4b;
            margin-bottom: 0.4rem;
        }

        .commentDetails {
            margin-top: 0.2rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.04);
            display: flex;
            justify-content: space-between;
            padding-bottom: 0.2rem;

            .userImg {
                width: 0.6rem;
                height: 0.6rem;
                position: relative;
                border-radius: 50%;
                overflow: hidden;

                img {
                    width: 0.6rem;
                    height: 0.6rem;
                    position: absolute;
                    top: 0;
                }
            }

            .user-Details {
                width: 86%;

                p {
                    font-size: 0.24rem;
                    margin: 0;
                    color: rgb(75, 75, 75);

                    span {
                        color: #727272;
                        padding: 0 0.1rem;
                    }
                }

                p:nth-child(2) {
                    padding: 0.2rem 0;
                    font-size: 0.28rem;
                }
            }


        }
    }
</style>