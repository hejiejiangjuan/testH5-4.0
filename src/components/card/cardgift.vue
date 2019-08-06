<template>
  <div class="miades">
    <div class="my-gift-null" v-if="dataList ==null || dataList == ''">
      <img class="images" src="@/assets/imgs/liwu.png" />
      <div class="my-titleo">
        还没有送出过礼物，
        <router-link to="/home" class="linkad">去看看</router-link>
      </div>
      <div class="liwuxianshi">你所赠送的礼物会显示在这里</div>
    </div>
    <div class="mygift-list" v-else v-for="(item, index) in dataList" :key="index">
      <div class="mygift-top">
        <div class="mygift-top-img">
          <img class="imgname" :src="imgConfig+item.picAddr" alt />
        </div>
        <div class="mygift-top-title">
          <div class="mygift-alltitle">
            <span class="mygift-title">{{item.title}}</span>
            <span class="mygift-titleright">x{{item.commodityNum}}份</span>
          </div>
          <div class="mone-number">￥{{item.paymentStr}}</div>
        </div>
      </div>
      <div class="admge-number">
        <div>
          <div class="adme-top">购买时间：{{item.createDate}}</div>
          <div>
            订单编号：
            <span class="number">{{item.orderNo}}</span>
          </div>
        </div>
        <button
          class="adme-copy"
          v-if="item.isShow"
          :data-clipboard-text="item.orderNo"
          @click="coplyClick(index)"
        >复制</button>
        <div class="adme-copy" v-else>已复制</div>
      </div>
      <ul class="ul-mygift">
        <li class="ul-li">
          <div class="spanli">领取编号</div>
          <div class="spanli">领取人</div>
          <div class="spanli">赠送状态</div>
        </li>
        <li class="ul-li" v-if="item.presentList == null">
          <div class="spanne">01</div>
          <div class="spanneirong">未领取</div>
          <van-button size="mini" @click="zengsong(index)">待赠</van-button>
        </li>
        <li class="ul-li" v-else v-for="(num,id) in item.presentList" :key="id">
          <div class="spanne">0{{id+1}}</div>
          <div class="spanneirong">{{num.getUserName}}</div>
          <div class="spannei">已领取</div>
        </li>
      </ul>
    </div>
    <p class="footerText"  v-if="dataList.length >= 3">{{footerTex}}</p>
  </div>
</template>

<script>
import Api from "../../Api";
import Clipboard from "clipboard";
import imgConfig from "../../imgConfig";
import { setTimeout } from "timers";
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
  mounted() {
    this.imgConfig = imgConfig.imgServe;
    this.getPresendList();
    window.addEventListener("scroll", this.paging);
    var params = new URLSearchParams();
    params.append("currentPage", this.currentPage);
    params.append("pageSize", this.pageSize);
    var list = {
      type: 1
    };
    params.append("param", JSON.stringify(list));
    this.$axios.get("/wx/present/getPresendList", { params }).then(
      res => {
        if (res.data.code == "200") {
          var arrList = res.data.datas.list;
          for (var i in arrList) {
            arrList[i]["isShow"] = true;
          }
          this.dataList = arrList;
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
    // 赠送跳转
    zengsong(index) {
      this.$router.push({
        path: "/share",
        query: {
          dataList: JSON.stringify(this.dataList[index])
        }
      });
    },
    coplyClick(index) {
      var clipboard = new Clipboard(".adme-copy");
      clipboard.on("success", e => {
        if (this.dataList[index].orderNo == e.text) {
          this.dataList[index].isShow = false;
          var that = this;
          var t1 = setTimeout(function() {
            that.dataList[index].isShow = true;
          }, 1000);
          window.clearTimeout(t1);
        }
        //释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // if(this.dataList[index].orderNo == e.text){
        //    this.isShow = true;
        // }
        clipboard.destroy();
      });
    },
    // 初始化列表
    getPresendList(currentPage) {},
    //分页
    paging() {
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
        this.currentPage = this.currentPage += 1;
        var that = this;
        var params = new URLSearchParams();
        params.append("currentPage", that.currentPage);
        params.append("pageSize", that.pageSize);
        var list = {
          type: 1
        };
        params.append("param", JSON.stringify(list));
        that.$axios.get("/wx/present/getPresendList", { params }).then(
          res => {
            if (res.data.code == "200") {
              var arrList = res.data.datas.list;
              for (var i in arrList) {
                arrList[i]["isShow"] = true;
              }
              if (arrList != null) {
                for (let i = 0; i < arrList.length; i++) {
                  that.dataList.push(arrList[i]);
                }
                if (arrList.length == 0) {
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
.mygift-list {
  background: white;
  padding: 0.25rem 0.48rem;
  padding-bottom: 0.1rem;
  margin-top: 0.25rem;
}
.admge-number {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.28rem;
  color: #8d8b8c;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #dfdfdf;
}
.number {
  color: #1f1d1e;
}
.mygift-top-title {
  width: 83%;
}
.adme-top {
  padding: 0.15rem 0;
}
.adme-copy {
  border: none;
  background: none;
  font-size: 0.28rem;
  color: #1f1d1e;
  padding-top: 0.15rem;
}
.ul-mygift {
  font-size: 0.3rem;
}
.ul-li {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0;
}
.spanli {
  // width: 33%;
  font-size: 0.28rem;
  // font-weight: bold;
  color: #929292;
}
.spanneirong {
  // width: 33%;
  // text-align: center;
  font-size: 0.24rem;
}
.spannei {
  padding-right: 0.4rem;
  font-size: 0.24rem;
}
.spanne {
  padding-left: 0.4rem;
  font-size: 0.24rem;
}
.mygift-top {
  width: 100%;
  display: flex;
  align-items: center;
}
.mygift-alltitle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.2rem;
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
  width: 90%;
  font-size: 0.3rem;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mygift-titleright {
  display: block;
  width: 20%;
  font-size: 0.28rem;
  padding-left: 0.6rem;
}
.mone-number {
  font-size: 0.24rem;
  color: #ffa500;
  font-weight: bold;
  padding: 0.1rem 0.26rem;
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
/deep/.van-button {
  background: #ffe268;
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
