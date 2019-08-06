<template>
  <div>
    <div class="admingas">
      <canvas
        id="mycanvas"
        v-show="false"
        width="300"
        height="450"
        style="width:300px; height:500px;"
      ></canvas>
      <img class="cansarImg" :src="canSrc" alt />
    </div>

    <div class="btn">
      <!-- <button class="baocun" @click="saveAdm">保存到手机</button> -->
      <div class="imgBtn">长按二维码保存分享图片到本地</div>
    </div>
  </div>
</template>

<script>
import imgConfig from "../imgConfig";
import Api from "../Api";
import { Toast } from "vant";
export default {
  name: "BaoGaoCanvas",
  data() {
    return {
      allContent: {},
      content: "",
      ratio: "",
      canSrc: "",
      imglist: "",
      imgConfig: "",
      myData: {},
      appraisalId: "",
      userInfo: {}
    };
  },
  mounted() {
    this.imgConfig = imgConfig.imgServe;
    Toast.loading({
      mask: true,
      message: "加载中..."
    });
    this.allContent = JSON.parse(this.$route.query.allContent);
    this.content = this.allContent.report[0].content;
    //个人信息的请求
    this.$axios({
      url: Api.getCurUserInfo,
      method: "get",
      data: ""
    }).then(resp => {
      if (resp.data.code == 200) {
        this.userInfo = resp.data.datas;
        this.getLogo();
      }
    });

    //获取canvas
    var canvas = document.getElementById("mycanvas");
    var ctx = canvas.getContext("2d");
    //获取像素比
    var getPixelRatio = function(ctx) {
      var backingStore =
        ctx.backingStorePixelRatio ||
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;
      return (window.devicePixelRatio || 1) / backingStore;
    };
    var ratio = getPixelRatio(ctx);
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.width = canvas.width * ratio;
    canvas.height = canvas.height * ratio;
    this.ratio = ratio;
  },
  methods: {
    erweiMa() {
      var params = new URLSearchParams();
      params.append("appraisalId", this.allContent.appraisalId);
      this.$axios.post("/wx/appraisal/getShareCode", params).then(
        res => {
          if (res.data.code == "200") {
            var myData = res.data.datas;
            this.shareCans(
              this.imglist,
              this.content,
              this.allContent,
              this.userInfo,
              myData
            );
          }
        },
        err => {}
      );
    },
    getLogo() {
      var params = new URLSearchParams();
      params.append("tfk", localStorage.getItem("tfk"));
      this.$axios.post("/wx/home/getLogo", params).then(
        res => {
          if (res.data.code == "200") {
            this.imglist = res.data.datas.posterAddr;
            this.erweiMa();
          }
        },
        err => {}
      );
    },
    // 点击下载
    saveAdm() {
      this.downIamge(this.canSrc, "add");
      // let link = document.createElement("a");
      // link.href = this.canSrc;
      // link.download = "fenxiang.png";
      // link.click();
    },
    downIamge(imgsrc, name) {
      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/jpg");
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        a.download = name;
        a.href = url;
        a.dispatchEvent(event);
      };
      image.src = imgsrc;
    },
    shareCans(img, content, myData, imgtouxiang, myimg) {
      var canvas = document.getElementById("mycanvas");
      var ctx = canvas.getContext("2d");
      //清空画布
      canvas.height = canvas.height;
      //还原画布
      this.canSrc = "";
      //背景图片
      var that = this;
      ctx.scale(that.ratio, that.ratio);
      let bgImg = new Image();
      bgImg.crossOrigin = "Anonymous";
      bgImg.src = this.imgConfig + this.imglist;
      bgImg.onload = function() {
        //背景图片
        ctx.drawImage(bgImg, 0, 0, 300, 450);
        //画白色框
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(300 / 2 - 240 / 2, 50, 300 - 60, 450 - 80);

        var name = myData.titleInfo.title;
        ctx.font = "12px Arial";
        ctx.fillStyle = "#727272";
        ctx.textAlign = "center";
        ctx.fillText(name, canvas.width / 2 / that.ratio, 85);

        ctx.beginPath();
        ctx.fillStyle = "#F7B500";
        ctx.fillRect(300 / 2 - 50, 95, 90, 25);

        ctx.font = "10px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("测试结果为：", canvas.width / 2 / that.ratio, 110);

        //内容
        var text = content.replace(/<[\/\!]*[^<>]*>/gi, "");
        var title = text.substring(0, 104);
        if (title.length == 104) {
          title = title + "...";
        }
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        that.drawText(
          ctx,
          title,
          canvas.width / 2 / that.ratio,
          140,
          20,
          200,
          18
        );
        //二维码图片
        var codeImg = new Image();
        codeImg.crossOrigin = "Anonymous";
        codeImg.src = myimg + "?timestamp=" + new Date().getTime();

        codeImg.onload = () => {
          ctx.drawImage(codeImg, 300 / 2 - 50, 310, 100, 100);

          //头像
          var userImg = new Image();
          userImg.crossOrigin = "Anonymous";
          userImg.src = imgtouxiang.avatar;
          Toast.success("加载成功！");
          userImg.onload = () => {
            ctx.beginPath();
            ctx.arc(300 / 2, 45, 20, 0, Math.PI * 2);
            // ctx.stroke();
            ctx.clip();
            ctx.drawImage(userImg, 300 / 2 - 30, 20, 55, 45);
            that.canSrc = canvas.toDataURL();
          };
        };
      };
    },

    //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、标题高度 6、文本的宽度 7、字体大小
    drawText(
      ctx,
      str,
      leftWidth,
      initHeight,
      titleHeight,
      canvasWidth,
      fontSize
    ) {
      var lineWidth = 0;
      var lastSubStrIndex = 0; //每次开始截取的字符串的索引
      for (let i = 0; i < str.length; i++) {
        lineWidth += ctx.measureText(str[i]).width;
        if (lineWidth > canvasWidth) {
          ctx.fillText(
            str.substring(lastSubStrIndex, i),
            leftWidth,
            initHeight
          ); //绘制截取部分
          initHeight += fontSize + 5; //为字体的高度(行间距)
          lineWidth = 0;
          lastSubStrIndex = i;
          titleHeight += fontSize;
        }
        if (i == str.length - 1) {
          //绘制剩余部分
          ctx.fillText(
            str.substring(lastSubStrIndex, i + 1),
            leftWidth,
            initHeight
          );
        }
      }
      // 标题border-bottom 线距顶部距离
      // titleHeight = titleHeight + 10;
      return titleHeight;
    }
  }
};
</script>

<style  scoped lang="less">
.admingas {
  position: fixed;
  top: 0.3rem;
  height: 100%;
  width: 100%;
  text-align: center;
}
.btn {
  width: 100%;
  height: 1rem;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.baocun {
  border: none;
  width: 90%;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  background: #f7b500;
  border-radius: 5px;
  font-size: 0.3rem;
}

.cansarImg {
  max-width: 80%;
}
.imgBtn {
  font-size: 0.3rem;
}
</style>
