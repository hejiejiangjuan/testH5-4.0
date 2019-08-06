<template>
    <div>
        <!--        <p class="searchText">点击搜索</p>-->
        <!--        <div class="searchTab">-->
        <!--            <div class="searchTab-title">-->
        <!--                <div class="searchTab-itmes" v-for="(item,index) in searchTitle" @click="searchVal(item.tab)">-->
        <!--                    {{item.tab}}-->
        <!--                </div>-->
        <!--            </div>-->
        <!--        </div>-->
        <div>
            <p class="searchText">热门推举</p>
            <div class="prinGoods" v-for="(item ,index) in goodsData" :key="index" @click="goodsDetails(item.id)">
                <div class="">
                    <van-card :tag="item.tag" :price="item.currentPriceStr" :desc="item.subhead" :title="item.title"
                              :thumb="item.picAddr">
                        <div slot="footer">
                            {{item.userNumStr}}人已测
                        </div>
                    </van-card>
                </div>
            </div>
            <!--            <div class="footText">-->
            <!--                没有更多了-->
            <!--            </div>-->
        </div>
    </div>
</template>

<script>
    import Api from '../Api'

    export default {
        name: "SearchCon",
        data() {
            return {
                // searchTitle: [
                //     {
                //         id: 1,
                //         tab: "情商"
                //     },
                //     {
                //         id: 1,
                //         tab: "心理健康"
                //     },
                //     {
                //         id: 1,
                //         tab: "阴郁"
                //     },
                //     {
                //         id: 1,
                //         tab: "性"
                //     }, {
                //         id: 1,
                //         tab: "童年阴影"
                //     }, {
                //         id: 1,
                //         tab: "内向"
                //     }, {
                //         id: 1,
                //         tab: "自卑"
                //     },
                //
                //
                // ],
                goodsData: [],
                curPage: 1,//当前页
                pageSize: 10,//获取条数
                myDate: "",
                path: "",
            }
        },
        beforeCreate() {
            this.$axios({
                url: Api.getHotList,
                method: "get",
                data: ""
            }).then(resp => {
                let hotData = resp.data.datas
                if (resp.data.code == 200) {
                    this.goodsData = hotData
                }
            });
        },
        created() {
            this.myDate = new Date().getTime()
            this.path = window.location.hash
        },
        beforeDestroy() {
            var endtim = new Date().getTime()
            this.$root.myDay(this.myDate, endtim, this.path)
        },
        methods: {
            //选择标签
            searchVal(str) {
                // var param = new URLSearchParams()
                // param.append('curPage', this.curPage)
                // param.append("pageSize", this.curPage)
                // param.append("content", str)
                var param={}
                param.curPage=this.curPage;
                param.pageSize=this.pageSize;
                param.content=str;
                param=this.$qs.stringify(param)
                var obj = {
                    param: param,
                    str: str
                }
                this.$store.dispatch("getVal", obj)
                this.$router.push("/SearchPage/CategoryList")
            },
            goodsDetails(id) {
                this.$router.push({
                    path: "/GoodsDetails",
                    query: {
                        id: id
                    }
                })
            },

        }

    }
</script>

<style scoped lang="less">
    .van-card__footer {
        color: #727272;
    }
    /deep/ .van-card__price {
        color: #ffa500;
        font-weight: bold;
    }
    .van-card__title{
        font-weight: bold;
        font-size: 0.3rem;
        height: 0.32rem;
        max-height: none;
        padding-top: 0.1rem;
    }
    /deep/ .van-card__footer {
        position: absolute;
        bottom: 12px;
        right: 12px;
    }

    /deep/ .van-card__price {
        margin-top: 28px;
    }

    .listGoods {
        position: relative;
    }

    .searchTab {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f7f8fa;
        width: 100%;

        .searchTab-title {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            width: 90%;

            .searchTab-itmes {
                background: white;
                margin: 5px 10px;
                border-radius: 1px;
                padding: 5px 5px;
                font-size: 14px;
            }
        }
    }

    .searchText {
        font-size: 14px;
        color: #727272;
        padding-left: 20px;
    }

    .prinGoods {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .footText {
        text-align: center;
        font-size: 14px;
        color: #727272;
        padding-bottom: 22px;
    }
</style>