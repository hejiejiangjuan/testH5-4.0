<template>
    <div class="shareCanvas">
        <div class="shareCanvasTitle"><p>邀请好友购买</p>
            <p v-if="openRecruit==1">，你可以赚{{commissionYuan}}元</p>
            <p>
            </p></div>
        <div class="canvars-bg">
            <canvas id="mycanvas" width="300px" height="500px" style="width:150px; height:250px"
                    v-show="false"></canvas>

            <div class="loding" v-if="!canSrc">
                <van-loading type="spinner" size="40px" color="#ffff" />
                <p>加载中...</p>
            </div>

            <img id="myImg "  style="width: 5rem;height: 8.3rem" :src="canSrc" alt="" v-show="canSrc">
        </div>
        <div class="footCon">
            <p>长按上面图片保存，分享给好友</p>
            <div class="shareBtn">
                <div class="shareCon">
                    <div class="shareImg" v-for="(item,index) in shareData" :key="index" @click="shareBtn(index)">
                        <img id="canvImg" :src="item.imgSrc" alt="">
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
                            <button class="tag-read" :data-clipboard-text="sharSrc" @click="copyLink">复制链接</button>
                        </div>
                        <p class="invita">{{sharSrc}}</p>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import Api from "../Api"
    import Clipboard from 'clipboard'
    import {Toast} from 'vant';

    export default {
        name: "shareCanvas",
        data() {
            return {
                appraisalId: "",//测试唯一标识id
                show: false,//下拉框状态
                ratio: 0,//canvas像素比
                text: "奔跑在路上的Me",
                radio: 0,
                shareData: [],//分享图片数据
                sharSrc: "",//分享的链接
                canSrc: "",
                commissionYuan: "",
                openRecruit: 1,//默认开启招募

            }
        },
        created(){

        },
        mounted() {
            this.getDisSystem()
            this.appraisalId = this.$route.query.appraisalId
            this.sharSrc = this.$route.query.sharUrl

            this.initshareCans()
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

        },
        methods: {
            //判断是否开启招募
            getDisSystem() {
                this.$axios({
                    url: Api.getDisSystemSet,
                    method: "post"
                }).then(resp => {
                    if (resp.data.code == 200) {
                        this.openRecruit = resp.data.datas.openRecruit;
                    }
                })
            },
            //上拉框按钮
            showLink() {
                this.show = !this.show
            },
            //分享链接
            copyLink() {
                var clipboard = new Clipboard('.tag-read')
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
                    this.initshareCans(index)
                } else if (index == 1) {
                    this.initshareCans(index)
                }
            },
            //初始化数据
            initshareCans(index) {
                // var param = new URLSearchParams()
                // param.append("appraisalId", this.appraisalId)
                var param={}
                param.appraisalId=this.appraisalId;
                param=this.$qs.stringify(param)
                this.$axios({
                    url: Api.getAppraisalShareInfo,
                    method: "post",
                    data: param
                }).then(resp => {
                    if (resp.data.code == 200) {
                        var myData = resp.data.datas
                        this.commissionYuan = resp.data.datas.commissionYuan
                        if (myData.posterAddr) {
                            this.shareData = [
                                {
                                    id: 1,
                                    imgSrc: myData.posterAddr
                                },
                                {
                                    id: 2,
                                    imgSrc: require("../assets/imgs/7.jpg")
                                },
                            ]
                        } else {
                            this.shareData = [
                                {
                                    id: 2,
                                    imgSrc: require("../assets/imgs/7.jpg")
                                },
                            ]
                        }
                        //判断是否有第一张海报
                        if (myData.posterAddr) {
                            if (index == 0 || !index) {
                                this.sharePosters(resp.data.datas)
                            } else if (index == 1) {
                                this.shareCans(resp.data.datas)
                            }
                        } else if (!myData.posterAddr) {
                            this.shareCans(resp.data.datas)
                        }
                    }
                })
            },
            //第一张海报
            sharePosters(canImgInfo) {
                var canvas = document.getElementById("mycanvas")
                var ctx = canvas.getContext('2d')
                //清空画布
                canvas.height = canvas.height
                this.canSrc = ""
                //绘画海报
                var backImg = new Image();
                var that = this
                backImg.crossOrigin = "Anonymous";
                backImg.src = canImgInfo.posterAddr + "?timestamp=" + new Date().getTime();
                backImg.onload = function () {
                    ctx.scale(that.ratio, that.ratio)
                    ctx.drawImage(backImg, 0, 0, 300, 500)
                    var codeImg = new Image()
                    codeImg.crossOrigin = "Anonymous";
                    codeImg.src = canImgInfo.qraddr + "?timestamp=" + new Date().getTime()
                    codeImg.onload = function () {
                        ctx.drawImage(codeImg, 180, 400, 60, 60)
                        that.canSrc = canvas.toDataURL()
                    }
                }
            },

            //canvas绘画商品(第二张)
            shareCans(canImgInfo) {
                var canvas = document.getElementById("mycanvas")
                var ctx = canvas.getContext('2d');
                //清空画布
                canvas.height = canvas.height
                //还原画布
                this.canSrc = ""
                //背景图片
                var that = this
                ctx.scale(that.ratio, that.ratio)
                let bgImg = new Image()
                bgImg.crossOrigin = "Anonymous";
                bgImg.src = "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4078337160,2491351865&fm=26&gp=0.jpg";
                bgImg.onload = function () {
                    //背景图片
                    ctx.drawImage(bgImg, 0, 0, 300, 500)

                    //画白色框
                    ctx.beginPath()
                    ctx.fillStyle = "white"
                    ctx.fillRect(300 / 2 - 240 / 2, 120, 240, 340)

                    //文字
                    ctx.font = "12px Arial";
                    ctx.textAlign = "center"
                    ctx.fillStyle = "#727272";
                    ctx.fillText(canImgInfo.nickname + " 邀请您一起开通", canvas.width / 2 / that.ratio, 160);

                    ctx.font = "8px Arial";
                    ctx.fillStyle = "#000";
                    ctx.textAlign = "center"
                    ctx.fillText("扫码查看此二维码", canvas.width / 2 / that.ratio, 360);

                    ctx.font = "8px Arial";
                    ctx.fillStyle = "#727272";
                    ctx.textAlign = "center"
                    ctx.fillText("来自【黑豆测评】", canvas.width / 2 / that.ratio, 445);

                    //商品标题
                    ctx.font = "18px Arial";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#000";
                    that.drawText(ctx, canImgInfo.title, canvas.width / 2 / that.ratio, 200, 20, 200, 18)
                    // ctx.fillText(canImgInfo.title,canvas.width/2/that.ratio,200);

                    //商品图片
                    var goodsImg = new Image()
                    goodsImg.crossOrigin = "Anonymous";
                    goodsImg.src = canImgInfo.picAddr + "?timestamp=" + new Date().getTime();
                    goodsImg.onload = () => {
                        ctx.drawImage(goodsImg, 300 / 2 - 140 / 2, 240, 140, 100)
                        //二维码图片
                        var codeImg = new Image()
                        codeImg.crossOrigin = "Anonymous";
                        codeImg.src = canImgInfo.qraddr + "?timestamp=" + new Date().getTime()
                        codeImg.onload = () => {
                            ctx.drawImage(codeImg, 300 / 2 - 70 / 2, 365, 70, 70)

                            //头像
                            var userImg = new Image()
                            userImg.crossOrigin = "Anonymous";
                            userImg.src = canImgInfo.avatar + "?timestamp=" + new Date().getTime();
                            userImg.onload = () => {
                                ctx.beginPath()
                                ctx.arc(300 / 2 - 50 / 2 + 25, 120, 25, 0, Math.PI * 2, false);
                                // ctx.stroke();
                                ctx.clip();
                                ctx.drawImage(userImg, 300 / 2 - 50 / 2, 95, 50, 50)
                                that.canSrc = canvas.toDataURL()
                            }
                            // var userSrc=canInfo.avatar

                        }
                    }
                }
            },
            //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、标题高度 6、文本的宽度 7、字体大小
            drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth, fontSize) {
                var lineWidth = 0;
                var lastSubStrIndex = 0; //每次开始截取的字符串的索引
                for (let i = 0; i < str.length; i++) {
                    lineWidth += ctx.measureText(str[i]).width;
                    if (lineWidth > canvasWidth) {
                        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
                        initHeight += fontSize + 5; //为字体的高度(行间距)
                        lineWidth = 0;
                        lastSubStrIndex = i;
                        titleHeight += fontSize;
                    }
                    if (i == str.length - 1) { //绘制剩余部分
                        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
                    }
                }
                // 标题border-bottom 线距顶部距离
                // titleHeight = titleHeight + 10;
                return titleHeight
            },
        }
    }
</script>

<style scoped lang="less">


    .shareCanvasTitle {
        font-size: 0.3rem;
        /*border: 1px solid black;*/
        height: 50px;
        display: flex;
        justify-content: center;

        p {
            /*border: 1px solid black;*/


        }

        p:nth-child(2) {
            color: #9b704e;
            margin-left: 2px;
        }

        p:nth-child(3) {
            padding-top: 2px;
            color: #9b704e;
            margin-left: 1px;
        }
    }

    .canvars-bg {
        position: relative;
        background: #727272;
        height: 12rem;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-top: 0.3rem;
        padding-bottom:  0.4rem;
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
                /*border: 1px solid blue;*/
                width: 70%;
                display: flex;
                justify-content: flex-start;
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
                    margin-left: 0.2rem;

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