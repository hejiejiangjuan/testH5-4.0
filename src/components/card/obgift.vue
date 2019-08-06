<template>
  <div class="admagia">
    <div class="my-gift-null" v-if="dataList == null || dataList == ''">
      <img class="images" src="@/assets/imgs/liwu.png" />
      <div class="my-titleo">
        暂无收到的礼物，
        <router-link to="/home" class="linkad">去看看</router-link>
      </div>
      <div class="liwuxianshi">你所收到的礼物会显示在这里</div>
    </div>
    <div v-else>
      <div class="mygift-list" v-for="(item,index) in dataList" :key="index">
        <div class="myobgig-top">
          <div class="myobgig-title">
            <img :src="item.sendAvatar" alt />
            <div class="name">{{item.sendUserName}}</div>
          </div>
          <div class="myobgig-right" @click="detale(index)">
            详情
            <span>></span>
          </div>
        </div>
        <div class="mygift-top">
          <div class="mygift-top-img">
            <img class="imgname" :src="imgConfig+item.picAddr" alt />
          </div>
          <div class="mygift-top-title">
            <div class="mygift-alltitle">
              <span class="mygift-title">{{item.title}}</span>
              <!-- <span class="mygift-titleright">x1份</span> -->
            </div>
            <div class="mone-number"></div>
          </div>
        </div>
        <div class="admge-number">
          <div class="adme-top">购买时间：{{item.getDate}}</div>
          <div
            class="adme-copy"
            @click="clookBt(item.orderNo,item.appraisalId)"
            v-if="item.status == '1'"
          >查看报告</div>
          <div class="adme-cadf" @click="goodsPage(item.appraisalId,item.orderNo)" v-else>去测试</div>
        </div>
      </div>
    </div>
    <p class="footerText"  v-if="dataList.length > 3">{{footerTex}}</p>
  </div>
</template>

<script>
import imgConfig from "../../imgConfig";
export default {
  data() {
    return {
      dataList: [],
      currentPage: 1,
      pageSize: 10,
      imgConfig: "",
      footerTex: ""
    };
  },
  created() {
    this.imgConfig = imgConfig.imgServe;
    window.addEventListener("scroll", this.pageonscroll, true);
    
    var params = new URLSearchParams();
    params.append("currentPage", this.currentPage);
    params.append("pageSize", this.pageSize);
    var list = {
      type: 2
    };
    params.append("param", JSON.stringify(list));
    this.$axios.get("/wx/present/getPresendList", { params }).then(
      res => {
        if (res.data.code == "200") {
          this.dataList = res.data.datas.list;
          if (this.dataList.length <= 10) {
            this.footerTex = "加载更多";
          }
        } else {
        }
      },
      err => {}
    );
  },
  methods: {
    // 点击详情
    detale(index){
      //还需要获取订单号
      this.$router.push({
        path: "/Mydetails",
        query: {
          appraisalId: this.dataList[index].appraisalId,
          orderNo: this.dataList[index].orderNo
        }
      });
    },
    clookBt(orderNo, id) {
      //还需要获取订单号
      this.$router.push({
        path: "/BaoGao",
        query: {
          orderNo: orderNo,
          appraisalId: id
        }
      });
    },
    //点击跳转测前详情
    goodsPage(appraisalId, orderNo) {
    var that = this;
      var obj = { appraisalId: appraisalId, orderNo: orderNo };
      that.$store.dispatch("checkPage", obj).then(resp => {
        var appraisalHomeContent = that.$store.state.checkPage
          .appraisalHomeContent;
        if (appraisalHomeContent != null && appraisalHomeContent.notice != "") {
          //去须知页面
          that.$router.push({
            path: "/XuZhi",
            query: { appraisalId: appraisalId, orderNo: orderNo }
          });
        } else {
          if (
            appraisalHomeContent != null &&
            appraisalHomeContent.content != ""
          ) {
            that.$router.push({
              path: "/QuestionTitle",
              query: {
                appraisalId: appraisalId,
                orderNo: orderNo
              }
            });
          } else if (appraisalHomeContent.divisiveSex == 1) {
            that.$router.push({
              path: "/CheckedSex",
              query: {
                appraisalId: appraisalId,
                orderNo: orderNo,
                testTime: appraisalHomeContent.testTime
              }
            });
          } else if (appraisalHomeContent.divisiveSex == 0) {
            that.$router.push({
              path: "/AnswerPage",
              query: {
                appraisalId: appraisalId,
                orderNo: orderNo,
                testTime: appraisalHomeContent.testTime
              }
            });
          } else if (
            (appraisalHomeContent.notice =
              null || appraisalHomeContent.notice == "")
          ) {
            that.$router.push({});
          }
        }
      });
    },
    //分页
    pageonscroll() {
      //滚动条顶部的高度
      var innerHeight =
        document.documentElement.scrollTop || document.body.scrollTop;
      //获取屏幕的宽度
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //可滚动容器超出当前窗口显示范围的高度
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollHeight == innerHeight + windowHeight) {
        var that = this;
        that.currentPage = that.currentPage += 1;
        var params = new URLSearchParams();
        params.append("currentPage", that.currentPage);
        params.append("pageSize", that.pageSize);
        var list = {
          type: 2
        };
        params.append("param", JSON.stringify(list));
        that.$axios.get("/wx/present/getPresendList", { params }).then(
          res => {
            if (res.data.code == "200") {
              var listArr = res.data.datas.list;
              if (listArr != null) {
                for (let i = 0; i < listArr.length; i++) {
                  that.dataList.push(listArr[i]);
                }
                if (listArr.length == 0) {
                  that.footerTex = "没有更多";
                }
              } else {
                that.footerTex = "没有更多";
              }
            } else {
            }
          },
          err => {}
        );
      }
    }
  }
};
</script>

<style  scoped lang="less">
#app {
  width: 100%;
  height: 100%;
}
.admagia{
   width: 100%;
  margin-bottom: 1.2rem;
}
.mygift-list {
  background: white;
  padding: 0.2rem 0.48rem;
  padding-bottom: 0.1rem;
  margin-top: 0.25rem;
}
.myobgig-top {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.28rem;
}
.myobgig-title {
  width: 65%;
  display: flex;
  align-items: center;
}
.myobgig-title img {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
}
.myobgig-title .name {
  padding-left: 0.1rem;
}
.myobgig-right {
  width: 30%;
  display: flex;
  justify-items: center;
  justify-content: flex-end;
  align-items: center;
}

.admge-number {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.28rem;
  color: #8d8b8c;
  // padding-bottom: 0.25rem;
  margin: 0.3rem 0;
}
.number {
  color: #1f1d1e;
}
.mygift-top-title {
  width: 76%;
  border-bottom: 1px solid #cccccc;
  margin: 0 0.26rem;
}
.adme-top {
  // padding: 0.15rem 0;
}
.adme-copy {
  padding: 0.1rem;
  font-size: 0.24rem;
  color: #1f1d1e;
  background: #fcf9e8;
}

.mygift-top {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 0.2rem;
}
.mygift-alltitle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mygift-top-img {
  width: 1rem;
  height: 1rem;
}
.mygift-top-img .imgname {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}
.mygift-title {
  display: block;
  width: 96%;
  font-size: 0.3rem;
  font-weight: bold;
  overflow: hidden;
  // text-overflow: ellipsis;
  white-space: nowrap;
}
.mygift-titleright {
  display: block;
  width: 15%;
  font-size: 0.28rem;
  padding-left: 0.6rem;
}
.mone-number {
  height: 0.24rem;
  font-size: 0.24rem;
  color: #ffa500;
  font-weight: bold;
  padding: 0.1rem 0rem;
}
.my-gift-null {
  width: 60%;
  height: 4rem;
  margin: 35% auto;
  // border: 1px solid #000000;
  text-align: center;
}
.images {
  width: 2rem;
  height: 2rem;
}
.my-titleo {
  padding-top: 10px;
  font-size: 0.32rem;
  font-weight: 600;
}
.liwuxianshi {
  padding-top: 15px;
  font-size: 0.28rem;
  font-weight: 600;
  color: #999999;
}
.linkad {
  color: #ffc500;
  text-decoration: underline;
}
.adme-cadf {
  padding: 0.1rem 0.2rem;
  font-size: 0.24rem;
  background: #ffc500;
  color: #000000;
  border-radius: 5px;
}
/deep/ .van-tabs__nav--line {
  // width: 60%;
  padding-right: 40%;
}
/deep/ .van-tab--active {
  /*margin-top: 28px;*/
  font-weight: 900;
}
/deep/.van-tabs__line {
  background: #ffe268;
}
// /deep/.van-tabs__wrap {
//   // border-bottom: 1px solid #dfdfdf;
// }
/deep/.van-tabs__content {
  margin-top: 1px;
}
.miades {
  width: 100%;
  margin-bottom: 1.2rem;
}
.footerText {
  font-size: 0.24rem;
  color: #727272;
  text-align: center;
}
</style>
