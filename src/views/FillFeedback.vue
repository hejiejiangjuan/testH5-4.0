<template>
    <div class="fillFeedback">
        <div class="fillFeedInput">
            <div class="fillInput">
                <van-field v-model="value" style="height: 5.0rem" type="textarea" :autosize="true" maxlength="200"
                           placeholder="请输入反馈内容" @input="footNum"/>
                <p>{{Num}}/200</p>
            </div>
        </div>

        <div class="backimgModule">
            <div class="backImg-title">
                <p>相关截图</p>
                <p>{{backImg.length}}/3</p>
            </div>
            <div class="backImgInfo">
                <div class="backImg" v-for="(item,index) in backImg">
                    <img :src="item" alt="">
                    <p @click="delBackImg(index)">
                        <van-icon name="clear"/>
                    </p>
                </div>
               <!--                 <div class="backImg">
                                    <img src="../assets/imgs/6.jpg" alt="">
                                </div>
                                <div class="backImg">
                                    <img src="../assets/imgs/6.jpg" alt="">
                                </div>
                                <div class="backImg">
                                    <img src="../assets/imgs/6.jpg" alt="">
                                </div>-->
                <div class="screenshots" v-if="backImg.length<3">
                    <van-icon name="plus" @click="uplode"/>
                </div>
            </div>
        </div>


        <!--        <div class="inputhone">-->
        <!--            <van-field v-model="number"  label="联系方式" placeholder="请输入您的邮箱或手机" />-->
        <!--        </div>-->
        <div class="subBtn">
            <p @click="subackInfo">提交反馈</p>
        </div>
    </div>
</template>

<script>
    import wx from 'weixin-js-sdk';
    import Api from "../Api"
    import imgServe from '../imgConfig'
    import {Toast} from 'vant';

    export default {
        name: "FillFeedback",
        data() {
            return {
                fileList: [],//上传数组
                value: "",//输入的内容
                number: "",
                Num: 0,
                backImg: [],//渲染的图片数组
                subImg: [],//提交的图片数组
            }
        },
        // mounted() {

        // },
        methods: {
            //提交反馈
            subackInfo() {
                // var param = new URLSearchParams()
                var tfk=localStorage.getItem("tfk");
                var param={};
                if (!this.value) {
                    Toast('反馈内容不为空');
                    return
                }
                // param.append("content", this.value)
                // param.append("picArray", JSON.stringify(this.subImg))
                param.content=this.value;
                param.picArray=JSON.stringify(this.subImg);
                param.tfk=tfk;
                param=this.$qs.stringify(param);
                this.$axios({
                    url: Api.addFeedback,
                    method: "post",
                    data: param
                }).then(resp => {
                    if (resp.data.code == 200) {
                        this.$router.push("/successBack")
                    }
                })
            },
            //删除照片
            delBackImg(index) {
                for (var i = 0; i < this.backImg.length; i++) {
                    if (i == index) {
                        this.backImg.splice(index, 1)
                    }
                }
                for (var j = 0; j < this.subImg.length; j++) {
                    if (j == index) {
                        this.subImg.splice(index, 1)
                    }
                }
            },
            //字数的限制
            footNum(e) {
                if (e.length <= 200) {
                    this.Num = e.length
                }
            },
            //图片回显
            uplode() {
                var that = this
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        var localIds = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        // var tempFilePaths = res.tempFilePaths;
                        wx.uploadImage({
                            localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                var serverId = res.serverId; // 返回图片的服务器端ID
                                // var param = new URLSearchParams();
                                // param.append("mediaId", serverId);
                                var param={};
                                param.mediaId=serverId;
                                param=that.$qs.stringify(param)
                                that.$axios({
                                    url: Api.wxUpload,
                                    method: "post",
                                    data: param
                                }).then(resp => {
                                    if (resp.data.code == 200) {
                                        that.backImg.push(imgServe.imgServe + resp.data.datas);
                                        that.subImg.push(resp.data.datas)
                                    }
                                })
                            }
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped lang="less">
    /deep/ .van-field__body {
        font-size: 0.3rem;
    }

    .inputhone {
        /*border: 1px solid black;*/
        padding: 0 0.2rem;
        background: white;
    }

    /deep/ .van-field {
        border: none;
    }

    .backimgModule {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: white;

        .backImg-title {
            /*border: 1px solid black;*/
            display: flex;
            justify-content: space-between;
            width: 90%;

            p:nth-child(1) {
                font-size: 0.3rem;
                margin: 0.2rem;
            }

            p:nth-child(2) {
                font-size: 0.3rem;
                color: #9e9e9e;
                margin: 0.2rem;
            }
        }

        .backImgInfo {
            display: flex;
            justify-content: flex-start;
            border-bottom: 1px solid #f5f5f5;
            width: 90%;
            padding-bottom: 0.2rem;

            .backImg {
                /*border: 1px solid black;*/
                width: 1rem;
                height: 1rem;
                margin-left: 0.2rem;
                position: relative;

                p {
                    font-size: 0.4rem;
                    position: absolute;
                    top: -26px;
                    right: -7px;
                    color: #727272;
                }

                img {
                    width: 1rem;
                    height: 1rem;
                    position: absolute;
                    top: 0;
                }
            }

            .screenshots {
                border: 1px solid #b6b6b6;
                width: 1rem;
                height: 1rem;
                text-align: center;
                line-height: 1rem;
                font-size: 0.3rem;
                margin-left: 0.2rem;
                color: #727272;
            }
        }
    }

    .subBtn {
        display: flex;
        justify-content: center;

        p {
            text-align: center;
            width: 80%;
            /*border: 1px solid black;*/
            border-radius: 5px;
            height: 0.8rem;
            line-height: 0.8rem;
            font-size: 0.32rem;
            background: #00b200;
            color: white;
        }
    }

    .fillFeedInput {
        display: flex;
        justify-content: center;
        background: white;

        .fillInput {
            /*border-bottom: 1px solid #c9c9c9;*/
            height: 300px;
            background: white;
            width: 95%;
            position: relative;

            p {
                font-size: 0.3rem;
                color: #9e9e9e;
                text-align: right;
                /*padding: 0 0.3rem;*/
                position: absolute;
                bottom: 0.3rem;
                right: 0.3rem;
            }
        }
    }

</style>