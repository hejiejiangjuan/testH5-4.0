<template>
  <div class="admintop">
    <div class="penpal">
      点击右上角
      <span>【发送给朋友】</span>赠送
      <span>《{{title}}》</span> 给好友
    </div>
    <ul class="ulpenpal">
      <li>每份测评仅供一人领取一次</li>
      <li>
        若因系统问题导致赠送失败请直接
        <van-button
          size="mini"
          class="tag-read"
          :data-clipboard-text="shareUrl"
          @click="copyLink"
        >复制链接</van-button>发送给好友
      </li>
    </ul>
    <img class="imges" src="@/assets/imgs/aaa.jpg" alt />
  </div>
</template>

<script>
import imgConfig from "../imgConfig";
import wx from "weixin-js-sdk";
import { Toast } from "vant";
import Api from "../Api";
import { Dialog } from "vant";
import Clipboard from "clipboard";
export default {
  data() {
    return {
      screenWidth: 0,
      screenHeight: 0,
      title: "",
      picAddr: "",
      shareUrl: "",
      dataList: {},
      imgConfig: "",
    };
  },
  created() {
    this.imgConfig = imgConfig.imgServe;
    this.dataList = JSON.parse(this.$route.query.dataList);
    this.title = this.dataList.title;
    this.picAddr = this.dataList.picAddr;
  },
  mounted() {
    this.initCurpage();
  },
  beforeDestroy() {
    this.$root.createShare(this.title, null, this.picAddr, this.shareUrl);
  },
  methods: {
    // 创建分享链接
    initCurpage() {
      var that = this;
      that.shareUrl =
        window.location.origin +
        "/#/Mydetails?orderNo=" +
        that.dataList.orderNo +
        "&appraisalId=" +
        that.dataList.appraisalId;
      that.$root.createShare(
        that.dataList.title,
        that.dataList.subhead,
        that.imgConfig+that.dataList.picAddr,
        window.location.origin +
          "/#/Mydetails?orderNo=" +
          that.dataList.orderNo +
          "&appraisalId=" +
          that.dataList.appraisalId
      );
    },
    //分享链接
    copyLink() {
      var clipboard = new Clipboard(".tag-read");
      clipboard.on("success", e => {
        Toast.success("复制成功");
        //释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        Toast.fail("浏览器不兼容");
        clipboard.destroy();
      });
    }
  }
};
</script>

<style scoped lang="less">
.penpal {
  width: 71%;
  height: 30%;
  margin: 0 auto;
  margin-top: 0.6rem;
  font-size: 0.4rem;
}
.penpal span {
  font-weight: 600;
}
.ulpenpal {
  width: 76%;
  height: 30%;
  margin: 0 auto;
  margin-top: 0.2rem;
  font-size: 0.28rem;
  color: #959595;
}
.ulpenpal li {
  line-height: 0.5rem;
}
.ulpenpal li::before {
  content: "•"; /* 自定义图标，也可以使用字体图标 如：content: "\f105"; font-family: FontAwesome;*/
  color: #959595; /* 自定义颜色 */
}
.imges {
  width: 100%;
  height: 7rem;
}
/deep/.van-button {
  background: #ffe268;
}
</style>
