<template>
    <div class="myCanvas">
        <p class="myCanvas-title">长按后“发送给朋友”，朋友可以成为下级推广员</p>
        <p class="myCanvas-con">下级推广成功，您获得佣金</p>
        <div class="canvasBg">
            <canvas id="myCanvas" width="280" height="460" v-show="false"></canvas>
            <img id="myCanimg" :src="canImgSrc" alt="" v-show="canImgSrc">
        </div>
    </div>
</template>

<script>
    import Api from "../Api"
    export default {
        name: "MyCanvas",
        data(){
          return{
              ratio:0,
              canImgSrc:""
          }
        },
        mounted(){
            // this. myCanvas()
            //获取canvas
            var canvas = document.getElementById("myCanvas")
            var ctx = canvas.getContext('2d');
            //获取像素比
            var getPixelRatio = function (ctx) {
                var backingStore = ctx.backingStorePixelRatio ||
                    ctx.webkitBackingStorePixelRatio ||
                    ctx.mozBackingStorePixelRatio ||
                    ctx.msBackingStorePixelRatio ||
                    ctx.oBackingStorePixelRatio ||
                    ctx.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            };
            var ratio = getPixelRatio(ctx);
            canvas.style.width = canvas.width + 'px';
            canvas.style.height = canvas.height + 'px';
            canvas.width = canvas.width * ratio;
            canvas.height = canvas.height * ratio;
            this.ratio=ratio
            this. initPage()
            var userKey = localStorage.getItem("curUserKey")
            this.$root.createShare(null,null,null,window.location.origin+"/#/AcceptInvitation?userKey=" + userKey);
        },
        methods:{
            //页面数据初始化
            initPage(){
                // var param=new URLSearchParams()
                // param.append("urlHash","#/AcceptInvitation");
                var param={};
                param.urlHash="#/AcceptInvitation";
                param=this.$qs.stringify(param)
                this.$axios({
                    url:Api.getInviteDisUserInfo,
                    method:"post",
                    data:param
                }).then(resp=>{
                    if (resp.data.code==200){
                        var info=resp.data.datas
                        this.myCanvas(info)
                    }
                })
            },
            //canvas画布
            myCanvas(info){
                var canvas=document.getElementById("myCanvas")
                var ctx=canvas.getContext('2d')
                var bgimg=new Image()
                var that=this
                bgimg.crossOrigin="Anonymous";
                bgimg.src='https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=763221890,1167872403&fm=26&gp=0.jpg'+"?timestamp="+new Date().getTime()
                bgimg.onload=function () {
                    ctx.scale(that.ratio,that.ratio)
                    ctx.drawImage(bgimg,0,0,280,460)
                    //二维码图片
                    var codeImg=new Image()
                    codeImg.crossOrigin="Anonymous";
                    codeImg.src=info.qraddr+"?timestamp="+new Date().getTime()
                    codeImg.onload=function () {
                        ctx.drawImage(codeImg,160,310,50,50)

                        //画头像
                        var userImg=new Image()
                        userImg.crossOrigin="Anonymous";
                        userImg.src=info.avatar+"?timestamp="+new Date().getTime()
                        userImg.onload=function () {
                            ctx.beginPath()
                            ctx.arc(80,110,25,0,2*Math.PI,false)
                            // ctx.stroke()
                            ctx.clip();
                            ctx.drawImage(userImg,55,85,50,50)
                            that.canImgSrc=canvas.toDataURL()
                        }
                    }
                    //画个框
                    ctx.lineWidth=5
                    ctx.fillStyle="#ffffff"
                    ctx.fillRect(280/2-230/2, 460/2-360/2, 230, 360);
                    ctx.strokeStyle="#d9a25b"
                    ctx.strokeRect(280/2-230/2, 460/2-360/2, 230, 360);
                    ctx.lineWidth=1
                    ctx.strokeRect(280/2-215/2, 460/2-345/2, 215, 345);

                    //文字
                    ctx.font="12px Arial";
                    ctx.fillStyle="#000"
                    ctx.fillText(info.nickname,55, 155);
                    ctx.font="10px Arial";
                    ctx.fillStyle="#727272"
                    ctx.fillText("邀请您一起推广",55, 170);

                    ctx.font="20px Arial";
                    ctx.fillStyle="#72432B"
                    ctx.fillText("加入我们",55, 220);
                    ctx.font="20px Arial";
                    ctx.fillStyle="#72432B"
                    ctx.fillText("把知识传给更多人",55, 250);

                    ctx.font="10px Arial";
                    ctx.fillStyle="#727272"
                    ctx.fillText("扫码加入",165, 375);

                }
            }
        }
    }
</script>

<style scoped lang="less">
    #myCanimg{
        width: 5rem;
        height: 8.3rem;
    }
    .canvasBg{
        display: flex;
        justify-content: center;
        #myCanvas{
            /*border: 1px solid black;*/
        }
    }

    .myCanvas-title{
        font-size: 0.3rem;
        text-align: center;
        color: #727272;
    }
    .myCanvas-con{
        font-size: 0.3rem;
        text-align: center;
        color: #9b704e;
    }
</style>