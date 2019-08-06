<template>
  <div class="classificationPage">
    <div class="topSearch">
      <Search></Search>
    </div>
    <div class="leftNav">
      <van-tree-select
        :items="allTypeFormat"
        :main-active-index="mainActiveIndex"
        :active-id="activeId"
        :height="568"
        @itemclick="itemClick"
        @navclick="onNavClick"
      />
    </div>
    <div class="drop-down">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="排序" :value="collapsevalue" name="1">
          <div
            class="searchRank"
            :style="{color:black}"
            @click="collapseSlet(item.id)"
            v-for="(item,index) in collapseData"
            :key="index"
          >{{item.content}}</div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="classGoods">
      <van-card
        v-for="(item ,index) in listGoodsData"
        :key="index"
        :tag="item.typeName"
        :price="item.payStage == '2'? '' : item.currentPriceStr" 
        :currency="item.payStage == '2'?'':'￥'"
        :desc="item.subhead"
        :title="item.title"
        :thumb="item.picAddr"
        @click="GoodsDetails(item.id)"
      >
        <div slot="footer">{{item.userNumStr}}人已测</div>
      </van-card>
      <p class="footerText">{{footerTex}}</p>
    </div>
  </div>
</template>

<script>
import Search from "../components/SearchTop";
import Api from "../Api";

// import scrollRefresh from "../components/Toche"
export default {
  name: "classificationPage",
  components: {
    Search
    // scrollRefresh
  },
  data() {
    return {
      footerTex: "",
      loading: false,
      finished: false,
      curPage: 1, //当前页
      pageSize: 6, //每页条数
      canRun: false,
      black: "#727272",
      collapsevalue: "按热度",
      collapseData: [
        {
          id: 1,
          content: "按时间"
        },
        {
          id: 2,
          content: "按价格"
        },
        {
          id: 3,
          content: "按热度"
        }
      ], //搜索导航
      listGoodsData: [], //每个类别商品信息
      allBtnData: [
        {
          text: "全部"
        }
      ],
      allTypeData: [], //返回的左侧导航
      allTypeFormat: [], //重定义左侧导航
      mainActiveIndex: 0, // 左侧高亮元素的index
      activeId: 1, // 默认被选中元素的id
      activeNames: [3], //下拉框的默认状态
      listData: [],
      myDate: "",
      path: "",
      dataId: ""
    };
  },
  beforeCreate() {
    this.$axios({
      url: Api.getAllType,
      method: "get",
      data: ""
    }).then(resp => {
      if (resp.data.code == 200) {
        this.allTypeData = resp.data.datas;
        this.allTypeFormat.unshift(this.allBtnData[0]);
        if (this.allTypeData && this.allTypeData.length > 0) {
          for (var i = 0; i < this.allTypeData.length; i++) {
            var temp = {};
            temp.text = this.allTypeData[i].name;
            temp.id = this.allTypeData[i].id;
            this.allTypeFormat.push(temp);
          }
        }
      }
    });
  },
  created() {
    // var temp = {'tfk':localStorage.getItem('tfk')};
    // this.$store.dispatch("getLogo",temp)

    this.myDate = new Date().getTime();
    this.path = window.location.hash;
    //监听滚动条
    window.addEventListener("scroll", this.onScroll);
    //初始获取全部
    var orderType = this.activeNames[0];
    var param = {};
    param.appTypeId = 0;
    param.orderType = orderType;
    param.curPage = this.curPage;
    param.pageSize = this.pageSize;
    param = this.$qs.stringify(param);
    this.$axios({
      url: Api.getByAppType,
      method: "post",
      data: param
    }).then(resp => {
      if (resp.data.code == 200) {
        var listArr = resp.data.datas;
        for (var i in listArr) {
          if (
            listArr[i].currentPriceStr == "0.00" &&
            (listArr[i].payStage == null||listArr[i].payStage == '')
          ) {
            listArr[i].currentPriceStr = "免费";
          } else if (
            listArr[i].currentPriceStr == "0.00" &&
            listArr[i].payStage == "1"
          ) {
            listArr[i].currentPriceStr = "免费";
          }
        }

        this.listGoodsData = listArr;
        if (this.listGoodsData.length <= 10) {
          this.footerTex = "加载更多";
        }
      }
    });
  },
  beforeDestroy() {
    var endtim = new Date().getTime();
    this.$root.myDay(this.myDate, endtim, this.path);
  },
  methods: {
    onScroll() {
      //滚动条顶部的高度
      let innerHeight =
        document.documentElement.scrollTop || document.body.scrollTop;
      //屏幕尺寸高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //可滚动容器超出当前窗口显示范围的高度
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      //获取滚动条事件发起请求
      if (scrollHeight == windowHeight + innerHeight) {
        //发起请求
        let curPage = (this.curPage += 1);
        var orderType = this.activeNames[0];
        // var param = new URLSearchParams()
        // param.append('appTypeId', this.mainActiveIndex)
        // param.append("orderType", orderType)
        // param.append("curPage", this.curPage)
        // param.append("pageSize", this.pageSize)
        var param = {};
        if (!this.dataId) {
          param.appTypeId = 0;
        } else {
          param.appTypeId = this.dataId;
        }
        param.orderType = orderType;
        param.curPage = this.curPage;
        param.pageSize = this.pageSize;
        param = this.$qs.stringify(param);
        this.$axios({
          url: Api.getByAppType,
          method: "post",
          data: param
        }).then(resp => {
          if (resp.data.code == 200) {
            var listArr = resp.data.datas;
            for (var i in listArr) {
              if (
                listArr[i].currentPriceStr == "0.00" &&
                (listArr[i].payStage == null||listArr[i].payStage == '')
              ) {
                listArr[i].currentPriceStr = "免费";
              } else if (
                listArr[i].currentPriceStr == "0.00" &&
                listArr[i].payStage == "1"
              ) {
                listArr[i].currentPriceStr = "免费";
              }
            }
            if (listArr != null) {
              for (let i = 0; i < listArr.length; i++) {
                this.listGoodsData.push(listArr[i]);
              }
              if (listArr.length == 0) {
                this.footerTex = "没有更多";
              }
            } else {
              this.footerTex = "没有更多";
            }
          }
        });
      }
    },
    //点击作虎左侧按钮高亮
    onNavClick(index) {
      var dataId = this.allTypeFormat[index].id;
      this.dataId = this.allTypeFormat[index].id;
      if (index == 0) {
        dataId = 0;
      }
      this.mainActiveIndex = index;
      this.listData = [];
      this.curPage = 1;
      var orderType = this.activeNames[0];

      var param = {};
      param.appTypeId = dataId;
      param.orderType = orderType;
      param.curPage = this.curPage;
      param.pageSize = this.pageSize;
      param = this.$qs.stringify(param);
      this.$axios({
        url: Api.getByAppType,
        method: "post",
        data: param
      }).then(resp => {
        if (resp.data.code == 200) {
          var listArr = resp.data.datas;
          for (var i in listArr) {
            if (
              listArr[i].currentPriceStr == "0.00" &&
              (listArr[i].payStage == null||listArr[i].payStage == '')
            ) {
              listArr[i].currentPriceStr = "免费";
            } else if (
              listArr[i].currentPriceStr == "0.00" &&
              listArr[i].payStage == "1"
            ) {
              listArr[i].currentPriceStr = "免费";
            }
          }
          this.listGoodsData = listArr;
          if (this.listGoodsData == null || this.listGoodsData.length < 10) {
            this.footerTex = "没有更多了";
          }
        }
      });
    },
    itemClick(data) {
      this.listData = [];
      this.curPage = 1;
      var orderType = this.activeNames[0];
      // var param = new URLSearchParams();
      // param.append('appTypeId',data.id);
      // param.append("orderType", orderType);
      // param.append("curPage", this.curPage)
      // param.append("pageSize", this.pageSize)

      var param = {};
      param.appTypeId = data.id;
      param.orderType = orderType;
      param.curPage = this.curPage;
      param.pageSize = this.pageSize;
      param = this.$qs.stringify(param);
      this.$axios({
        url: Api.getByAppType,
        method: "post",
        data: param
      }).then(resp => {
        if (resp.data.code == 200) {
          var listArr = resp.data.datas;
          for (var i in listArr) {
            if (
              listArr[i].currentPriceStr == "0.00" &&
              (listArr[i].payStage == null||listArr[i].payStage == '')
            ) {
              listArr[i].currentPriceStr = "免费";
            } else if (
              listArr[i].currentPriceStr == "0.00" &&
              listArr[i].payStage == "1"
            ) {
              listArr[i].currentPriceStr = "免费";
            }
          }
          this.listGoodsData = listArr;
          if (this.listGoodsData.length < 10) {
            this.footerTex = "没有更多了";
          }
        }
      });
    },
    //点击下拉框
    collapseSlet(id) {
      if (id == 1) {
        this.listData = [];
        this.curPage = 1;
        this.collapsevalue = "按时间";
        this.activeNames = [id];
        var param = {};
        if (!this.dataId) {
          param.appTypeId = 0;
        } else {
          param.appTypeId = this.dataId;
        }
        param.orderType = id;
        param.curPage = this.curPage;
        param.pageSize = this.pageSize;
        param = this.$qs.stringify(param);
        this.$axios({
          url: Api.getByAppType,
          method: "post",
          data: param
        }).then(resp => {
          if (resp.data.code == 200) {
            var listArr = resp.data.datas;
            for (var i in listArr) {
              if (
                listArr[i].currentPriceStr == "0.00" &&
               (listArr[i].payStage == null||listArr[i].payStage == '')
              ) {
                listArr[i].currentPriceStr = "免费";
              } else if (
                listArr[i].currentPriceStr == "0.00" &&
                listArr[i].payStage == "1"
              ) {
                listArr[i].currentPriceStr = "免费";
              }
            }
            this.listGoodsData = listArr;
          }
        });
      } else if (id == 2) {
        this.listData = [];
        this.curPage = 1;
        this.collapsevalue = "按价格";
        this.activeNames = [id];
        var param = {};
        if (!this.dataId) {
          param.appTypeId = 0;
        } else {
          param.appTypeId = this.dataId;
        }
        param.orderType = id;
        param.curPage = this.curPage;
        param.pageSize = this.pageSize;
        param = this.$qs.stringify(param);
        this.$axios({
          url: Api.getByAppType,
          method: "post",
          data: param
        }).then(resp => {
          if (resp.data.code == 200) {
            var listArr = resp.data.datas;
            for (var i in listArr) {
              if (
                listArr[i].currentPriceStr == "0.00" &&
                (listArr[i].payStage == null||listArr[i].payStage == '')
              ) {
                listArr[i].currentPriceStr = "免费";
              } else if (
                listArr[i].currentPriceStr == "0.00" &&
                listArr[i].payStage == "1"
              ) {
                listArr[i].currentPriceStr = "免费";
              }
            }
            this.listGoodsData = listArr;
          }
        });
      } else if (id == 3) {
        this.listData = [];
        this.curPage = 1;
        this.collapsevalue = "按热度";
        this.activeNames = [id];
        var param = {};
        if (!this.dataId) {
          param.appTypeId = 0;
        } else {
          param.appTypeId = this.dataId;
        }
        param.orderType = id;
        param.curPage = this.curPage;
        param.pageSize = this.pageSize;
        param = this.$qs.stringify(param);
        this.$axios({
          url: Api.getByAppType,
          method: "post",
          data: param
        }).then(resp => {
          if (resp.data.code == 200) {
            var listArr = resp.data.datas;
            for (var i in listArr) {
              if (
                listArr[i].currentPriceStr == "0.00" &&
                (listArr[i].payStage == null||listArr[i].payStage == '')
              ) {
                listArr[i].currentPriceStr = "免费";
              } else if (
                listArr[i].currentPriceStr == "0.00" &&
                listArr[i].payStage == "1"
              ) {
                listArr[i].currentPriceStr = "免费";
              }
            }
            this.listGoodsData = listArr;
          }
        });
      }
    },
    //页面跳转至详情
    GoodsDetails(id) {
      this.$router.push({
        path: "/GoodsDetails",
        query: {
          id: id
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
/*.van-tag{*/
/*    border: 1px solid black;*/
/*    background:burlywood!important;*/
/*}*/
/deep/ .van-collapse-item {
}

.van-collapse {
  /*border: 1px solid black;*/
  height: 0.92rem;
  background: white;
}

/deep/ .van-cell:not(:last-child)::after {
  border: none;
}

/deep/ .van-cell__title {
  height: 0.32rem;

  span {
    font-size: 0.3rem;
  }

  /deep/ .van-cell {
    background: white;

    span {
      font-size: 0.3rem;
      color: black;
    }
  }
}

/deep/ .van-cell {
  /*border-bottom: 1px solid rgba(0, 0, 0, 0.03);*/
}

.van-tree-select__nitem--active::after {
  background: #ffe268;
}

.van-tree-select__nitem {
  line-height: 0.91rem;
  font-size: 0.3rem;
}

.van-tree-select__nav {
  min-width: 1.28rem;
  background: #f5f5f5;
}

.van-tree-select__content {
  background: rgba(250, 250, 250, 0);
  margin-left: 80%;
}

/deep/ .van-card__price {
  margin-top: 28px;
  color: #ffa500;
  font-weight: bold;
}

.van-card__title {
  font-size: 0.3rem;
  font-weight: bold;
  height: 0.36rem;
  line-height: 0.36rem;
  /*border: 1px solid black;*/
  max-height: none;
}

.van-card__footer {
  color: #727272;
}

/deep/ .van-card__title {
  white-space: nowrap;
  /*text-overflow:ellipsis;*/
  display: inline-block;
}

/deep/ .van-card__thumb {
  img {
    border-radius: 2px;
  }
}

/deep/ .van-card__footer {
  position: absolute;
  bottom: 9px;
  right: 12px;
}

/deep/ .van-card__price {
  margin-top: 28px;
}

.van-card {
  position: relative;
  background: #ffffff;
  padding: 0.2rem;
}

.classificationPage {
  position: relative;
}

.topSearch {
  background: white;
  width: 100%;
  position: fixed;
  top: 0;
}

.leftNav {
  border-right: 1px solid rgba(0, 0, 0, 0.03);
  width: 17%;
  height: auto;
  overflow: hidden;
  position: fixed;
  top: 50px;
  left: 0;
  background: #f5f5f5;
}

.drop-down {
  /*border: 1px solid black;*/
  width: 6.2rem;
  height: 0.89rem;
  position: fixed;
  background: white;
  top: 50px;
  right: 0;
}

.classGoods {
  padding-top: 0.1rem;
  width: 83%;
  position: absolute;
  right: 0;
  top: 94px;
  z-index: -1;
  padding-bottom: 80px;

  .footerText {
    font-size: 0.24rem;
    color: #727272;
    text-align: center;
  }
}

.searchRank {
  text-align: right;
  padding-right: 21px;
  padding-bottom: 14px;
}
</style>