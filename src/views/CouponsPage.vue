<template>
    <!--优惠券页面-->
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
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CouponsPage",
        data(){
            return{
                active:0,
                MeData: [
                    //模拟测评的数据
                    {
                        title: "未使用",
                        content: "内容1",
                        icon: "bookmark",
                        Text: "暂无任何优惠券",
                        Text1: "你可使用的优惠券会显示在这里",

                    },
                    {
                        title: "已使用",
                        content: "内容2",
                        icon: "bookmark",
                        Text: "暂无任何优惠券",
                        Text1: "你已使用的优惠券会显示在这里",
                    },
                    {
                        title: "已失效",
                        content: "内容2",
                        icon: "bookmark",
                        Text: "暂无任何优惠券",
                        Text1: "你已失效的优惠券会显示在这里",
                    },

                ]
            }
        }
    }
</script>

<style scoped lang="less">
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