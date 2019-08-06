<template>
    <div class="Canvars">
        <div class="canvars-bg">
            <canvas id="mycanvas" width="300px" height="500px" style="width:150px; height:250px" v-show="false"></canvas>
            <div class="loding" v-if="!imgsrc">
                <van-loading type="spinner" size="40px" color="#ffff" />
                <p>加载中...</p>
            </div>
            <img class="myCanImg "  style="width:5rem;height: 8.3rem " :src="imgsrc" alt=""  v-show="imgsrc">
<!--            animated bounceInDown delay-1s-->
        </div>
        <div class="footCon">
            <p>长按上面图片保存，分享给好友</p>
            <div class="shareBtn">
                <div class="shareCon">
                    <div class="shareImg" v-for="(item,index) in shareData" @click="shareBtn(index)">
                        <img :src="item.imgSrc" alt="">
                        <div :class="radio==index?'radio':'radioTwo'">
                            <div class="checkIcon">
                                <van-icon name="checked"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="shakeLink">
                    <p @click="showLink">邀请方式</p>
                </div>
            </div>
        </div>
        <van-popup v-model="show" position="bottom">
            <div class="invitationWay">
                <p>邀请方式</p>
                <div class="invitationWay-con">
                    <p>方式一</p>
                    <div class="invitationWay-text">
                        <p>微信内直接分享</p>
                        <p class="invitation">点击微信右上角三个“...”</p>
                        <p class="invitation">通过【发送给好友】【分享到朋友圈】推广</p>
                    </div>
                </div>
                <div class="invitationWay-con">
                    <p>方式二</p>
                    <div class="invitationWay-text">
                        <div class="copyBtn"><p>复制以下链接，转发推广：</p>
                            <button class="tag-read" :data-clipboard-text="host+'/#/home?userKey='+sharUrl" @click="copyLink">复制链接</button>
                        </div>
                        <p class="invita">{{host}}/#/home?userKey={{sharUrl}}</p>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import 'weixin-js-sdk';
    import Clipboard from 'clipboard'
    import {Toast} from 'vant';
    import Api from "../Api"
    export default {
        name: "MyCanvars",
        data() {
            return {
                testClickIn:0,
                // Cheight:0,
                // Cwidth:0,
                show: false,//下拉框状态
                ratio: 0,//canvas像素比
                text: "奔跑在路上的Me",
                radio: 0,
                shareData: [],//分享图片数据
                sharUrl:"",
                imgsrc:'',
                host:""
            }
        },
        created(){
            this.host=window.location.origin
        },
        mounted() {
            this.initCanvas()
            //获取canvas
            var canvas = document.getElementById("mycanvas")
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
            this.ratio = ratio
            this.$root.createShare();

        },

        methods: {
            //上拉框按钮
            showLink() {
             var shareUserkey=localStorage.getItem("curUserKey");
                this.sharUrl=shareUserkey
                this.show = !this.show
            },
            //分享链接
            copyLink() {
                var clipboard = new Clipboard('.tag-read');
                clipboard.on("success", e => {
                    // this.showShare=false
                    Toast.success('复制成功');
                    //释放内存
                    clipboard.destroy()
                })
                clipboard.on("error", e => {
                    Toast.fail('浏览器不兼容');
                    clipboard.destroy()
                })
            },
            //选择那张canvas
            shareBtn(index) {
                this.radio = index
                if (index == 0) {
                    this.initCanvas(index)
                } else if (index == 1) {
                    this.initCanvas(index)
                }
            },
            //初始化请求默认店铺推广
            initCanvas(index) {
                this.$axios({
                    url: Api.getHomeShareInfo,
                    method: "post",
                }).then(resp => {
                    if (resp.data.code == 200) {
                       var myData=resp.data.datas
                        //判断生成几个按钮
                        if (myData.posterAddr) {
                            this.shareData=[
                                {
                                    id: 1,
                                    imgSrc:myData.posterAddr
                                },
                                {
                                    id: 2,
                                    imgSrc: require("../assets/imgs/7.jpg")
                                },
                            ]
                        }else {
                            this.shareData=[
                                {
                                    id: 2,
                                    imgSrc: require("../assets/imgs/7.jpg")
                                },
                            ]
                        }

                       //判断是否有第一张海报
                      if (myData.posterAddr){
                          if (index==0||!index){
                              this.myCans(resp.data.datas,index)
                          } else if (index==1){
                              this.twoCans(resp.data.datas)
                          }
                      } else if (!myData.posterAddr){
                          this.twoCans(resp.data.datas)
                      }
                    }
                })
            },

            //店铺推介canvas
            myCans(shareInfo,index) {

                //获取canvas
                var canvas = document.getElementById("mycanvas");
                var ctx = canvas.getContext('2d');
                // 清空画布
                this.imgsrc=""
                canvas.height = canvas.height-1
                ctx.clearRect(0,0,canvas.width,canvas.height);
                // 背景图片对象
                var bgimg = new Image();
                var that = this;
                bgimg.crossOrigin="Anonymous";
                bgimg.src =shareInfo.posterAddr+"?timestamp="+new Date().getTime();
                bgimg.onload = function () {
                    ctx.scale(that.ratio, that.ratio);
                    ctx.drawImage(bgimg, 0, 0, 300, 500);
                    //文字
                    ctx.font = "14px Arial";
                    ctx.textAlign = "center"
                    ctx.fillStyle = "white";
                    ctx.fillText(shareInfo.nickname, canvas.width / 2 / that.ratio, 140);

                    ctx.font = "14px Arial";
                    ctx.textAlign = "center"
                    ctx.fillStyle = "white";
                    ctx.fillText("向你推荐优质的店铺知识", canvas.width / 2 / that.ratio, 160);

                    ctx.font = "26px Arial";
                    ctx.textAlign = "center"
                    ctx.fillStyle = "white";
                    ctx.fillText("不可错过的精品课程", canvas.width / 2 / that.ratio, 240);

                    ctx.font = "20px Arial";
                    ctx.textAlign = "center"
                    ctx.fillStyle = "white";
                    ctx.fillText("邀请你和我一起成长", canvas.width / 2 / that.ratio, 270);

                    ctx.font = "10px Arial";
                    ctx.textAlign = "center"
                    ctx.fillStyle = "white";
                    ctx.fillText("扫码识别，查看好课", canvas.width / 2 / that.ratio, 430);

                    //二维码
                    var imgCode = new Image()
                    imgCode.crossOrigin="Anonymous";
                    var codeSrc = shareInfo.qraddr
                    imgCode.src = codeSrc+"?timestamp="+new Date().getTime()
                    imgCode.onload=function () {
                        var CodeX = 300 / 2 - 70 / 2;
                        ctx.drawImage(imgCode, CodeX, 335, 70, 70)
                        var X = 300 / 2 - 80 / 2
                        ctx.strokeStyle = "white"
                        ctx.strokeRect(X, 330, 80, 80);

                        //头像图片对象
                        var imge = new Image()
                        imge.crossOrigin="Anonymous";
                        //赋值头像地址
                        var imgSrc = shareInfo.avatar
                        imge.src = imgSrc+"?timestamp="+new Date().getTime();
                        imge.onload = function () {
                            //获取头像居中的位置
                            var Uimg = 300 / 2 - 50 / 2;
                            var x = Uimg + 25
                            ctx.save()
                            ctx.beginPath();
                            ctx.arc(x, 85, 25, 0, Math.PI * 2, false);
                            // ctx.stroke();
                            ctx.clip();
                            ctx.drawImage(imge, Uimg, 60, 50, 50)
                            if (index==undefined){
                                that.imgsrc=canvas.toDataURL()
                            }
                            else {
                                // that.state=true
                                that.imgsrc=canvas.toDataURL()
                                // setTimeout(()=>{
                                //     that.state=false
                                //     this.imgsrc=""
                                //     that.imgsrc=canvas.toDataURL()
                                //     // "image/png",1
                                // },500)
                            }
                        };
                    }

                }
            },
            //商品推举canvas
            twoCans(canInfo) {
                this.imgsrc="";
                var canvas = document.getElementById("mycanvas");
                var ctx = canvas.getContext('2d');
                //清空画布
                canvas.height = canvas.height+1
                ctx.clearRect(0,0,canvas.width,canvas.height);
                //背景图片
                var that = this;
                ctx.scale(that.ratio, that.ratio);
                var bgImg = new Image();
                bgImg.crossOrigin="Anonymous";
                bgImg.src = canInfo.posterAddr+"?timestamp="+new Date().getTime();
                bgImg.onload = function () {
                    //背景图片
                    ctx.drawImage(bgImg, 0, 0, 300, 500);
                    var conImg = new Image();
                    conImg.crossOrigin="Anonymous";
                    conImg.src = "http://img4.imgtn.bdimg.com/it/u=1583584532,2185478906&fm=26&gp=0.jpg"+"?timestamp="+new Date().getTime();
                    conImg.onload=function () {
                        ctx.drawImage(conImg, 300 / 2 - 240 / 2, 120, 240, 340);
                        //二维码图片

                        var codeImg = new Image();
                        codeImg.crossOrigin="Anonymous";
                        codeImg.src = canInfo.qraddr+"?timestamp="+new Date().getTime();
                        codeImg.onload = function () {
                            ctx.drawImage(codeImg, 300 / 2 - 70 / 2, 305, 70, 70);

                            //绘画头像
                            var userImg = new Image();
                            userImg.crossOrigin="Anonymous";
                            var userSrc = canInfo.avatar;
                            userImg.src = userSrc+"?timestamp="+new Date().getTime();
                            userImg.onload = function () {
                                ctx.beginPath()
                                ctx.arc(50, 70, 25, 0, Math.PI * 2, false);
                                // ctx.stroke();
                                ctx.clip();
                                ctx.drawImage(userImg, 25, 45, 50, 50)
                            }
                        };
                        // 文字
                        ctx.font = "12px Arial";
                        ctx.textAlign = "center"
                        ctx.fillStyle = "white";
                        ctx.fillText(canInfo.nickname, 120, 75);
                        ctx.font = "10px Arial";
                        // ctx.textAlign = "center"
                        ctx.fillStyle = "white";
                        ctx.fillText("向你推举优质的知识店铺", 140, 90);

                        ctx.font = "8px Arial";
                        ctx.fillStyle = "#000";
                        ctx.textAlign = "center"
                        ctx.fillText("扫码查看此二维码", canvas.width / 2 / that.ratio, 300);

                        ctx.font = "8px Arial";
                        ctx.fillStyle = "#727272";
                        ctx.textAlign = "center";
                        ctx.fillText("来自【黑豆测评】", canvas.width / 2 / that.ratio, 385);

                        //商品标题
                        ctx.font = "20px Arial";
                        ctx.textAlign = "center";
                        ctx.fillStyle = "#000";
                        ctx.fillText("不可错过的好课好类容", canvas.width / 2 / that.ratio, 190);
                        ctx.font = "16px Arial";
                        ctx.textAlign = "center";
                        ctx.fillStyle = "#000";
                        ctx.fillText("抓住每一次成长的机会", canvas.width / 2 / that.ratio, 220);
                        // that.imgsrc=canvas.toDataURL('image/png')
                        setTimeout(()=>{
                            that.imgsrc=canvas.toDataURL()
                        },200)

                    }

                }

            },

        },
    }
</script>

<style scoped lang="less">
    /*.myCanImg{*/
    /*    width:6rem;*/
    /*    height:10rem;*/
    /*}*/

    .canvars-bg {
        position: relative;
        background: #727272;
        height: 12rem;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-top: 0.3rem;
        padding-bottom: 0.4rem;
        /*text-align: center;*/
        .loding{
            position:fixed;
            width: 2rem;
            height: 2rem;
            padding-top: 0.2rem;
            background: rgba(233, 233, 233, 0.4);
            border-radius: 3px;
            top:0;
            right: 0;
            left: 0;
            bottom: 0;
            margin: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            p{
                font-size: 0.3rem;
                color: white;
            }
        }

        #mycanvas {
            /*border: 1px solid red;*/
            background: white;
            /*transform: scale(2);*/
            /*height: 250px;*/
            /*width: 150px;*/
        }
    }

    .footCon {
        /*border: 1px solid black;*/
        background: white;
        position: fixed;
        bottom:50px;
        width: 100%;

        p {
            background: #00b200;
            font-size: 0.2rem;
            color: white;
            text-align: center;
            margin: 0;
            padding: 0.1rem 0;

        }

        .shareBtn {
            display: flex;
            justify-content: space-between;
            padding: 0 0.3rem;

            .shareCon {
                width: 32%;
                display: flex;
                justify-content: space-between;
                margin-top: 0.2rem;
                padding-bottom: 0.2rem;

                .shareImg {
                    position: relative;
                    height: 1rem;
                    width: 1rem;
                    border-radius: 50%;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    img {
                        position: absolute;
                        top: 0;
                        right: 0;
                        height: 1rem;
                        width: 1rem;
                    }

                    .radio {
                        .checkIcon {
                            font-size: 0.4rem;
                            color: #00b200;
                        }
                    }

                    .radioTwo {
                        .checkIcon {
                            display: none;
                            font-size: 0.4rem;
                            color: #00b200;
                        }

                    }
                }
            }

            .shakeLink {
                justify-content: center;
                align-items: center;
                display: flex;
                width: 27%;

                p {
                    background: white;
                    font-size: 0.24rem;
                    text-align: center;
                    border: 1px solid #00b200;
                    border-radius: 50px 50px;
                    height: 0.6rem;
                    line-height: 0.6rem;
                    width: 1.6rem;
                    color: #00b200;
                }
            }

        }
    }

    .invitationWay {
        /*border: 1px solid black;*/
        height: 4.6rem;
        width: 100%;

        p {
            font-size: 0.3rem;
            color: black;
            text-align: center;
            font-weight: bold;
        }

        .invitationWay-con {
            display: flex;
            justify-content: flex-start;
            padding: 0 0.3rem;
            margin-top: 0.5rem;

            p {
                font-weight: inherit;
                font-size: 0.28rem;
                /*color: #727272;*/
                text-align: left;
                margin: 0;
            }

            .invitationWay-text {
                margin-left: 0.4rem;

                p {
                    color: black;
                    margin-bottom: 0.2rem;
                }

                .invitation {
                    font-size: 0.24rem;
                    margin: 0;
                    color: #727272;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 5.3rem;
                    /*border: 1px solid black;*/
                }

                .invita {
                    width: 4.8rem;
                    font-size: 0.24rem;
                    margin: 0;
                    color: #727272;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    /*border: 1px solid black;*/
                }

                .copyBtn {
                    display: flex;
                    justify-content: space-between;
                    height: 0.4rem;
                    /*border: 1px solid black;*/
                    margin-bottom: 0.2rem;
                    width: 5.3rem;

                    .tag-read {
                        border: 1px solid #00b200;
                        color: #00b200;
                        padding: 0 0.1rem;
                        border-radius: 10px;
                        font-size: 0.24rem;
                        height: 25px;
                        background: white;
                    }
                }

            }
        }
    }
</style>