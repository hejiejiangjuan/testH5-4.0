<template>

    <div>
        <div class="cePinNav">
            <van-tabs v-model="active">
                <van-tab v-for="(item,index) in MeData" :key="index" :title="item.title">
                    <div class="MeContent">
                        <div class="contentNone">
                            <div class="contentNoneIcon contentNoneCon">
                                <van-icon :name="item.icon"/>
                            </div>
                            <div class="contentNoneText contentNoneCon">{{item.Text}}</div>
                            <div class="contentNoneText1 contentNoneCon">{{item.Text1}}</div>
                            <div class="contentNoneBtn contentNoneCon">
                                <van-button type="default">去看看</van-button>
                            </div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "GiftPage",
        data(){
            return{
                active:0,
                MeData: [
                    //模拟测评的数据
                    {
                        title: "我送出的",
                        content: "内容1",
                        icon: "gift-o",
                        Text: "还没有送出过礼物，不如去挑个精品给Ta？",
                        Text1: "您所购买的礼物会显示在这里",

                    },
                    {
                        title: "我收到的礼物",
                        content: "内容2",
                        icon: "point-gift-o",
                        Text: "还没有收到礼物哦",
                        Text1: "您收到的礼物会显示在这里",
                    },

                ]
            }
        }
    }
</script>

<style scoped lang="less">
    .van-button{
        width: 170px;
        background:wheat;;
    }
    .van-goods-action-mini-btn {
        font-size: 14px;
    }
    .cePinNav {
        width: 100%;

    .contentNone {
        padding: 30px 0;
        height: 200px;
        width: 100%;
        /*background: whitesmoke;*/
        display: flex;
        flex-direction: column;
        justify-content: center;

    .contentNoneCon {
        text-align: center;
    }

    .contentNoneIcon {
        font-size: 64px;
    }

    .contentNoneText {
        font-size: 16px;
        font-weight: bold;
        color: black;
    }

    .contentNoneText1 {
        margin-top: 10px;
        margin-bottom: 30px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.35);
    }
    }
    }
</style>