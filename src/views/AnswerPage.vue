<template>
  <div class="AnswerPage">
    <div class="Answer">
      <div class="progress">
        <div class="num">
          <span>{{listNum}}</span>
          /{{allNum}}
        </div>
        <div class="pro">
          <van-progress :percentage="percentage" color="#ffe268" :show-pivot="false" />
        </div>
        <!--                <div class="tIcon"><van-icon name="clock-o" /></div>-->
        <!--                <div class="tim">19:48</div>-->
        <div class="icon" @click="dialogBtn">
          <van-icon name="question-o" />
        </div>
      </div>
    </div>
    <!-- 正常结构 -->
    <div class="lunBo-box" v-if="questionType != '2'">
      <div id="beijin" v-bind:style="{width:widthLen +'rem',marginLeft:margin+'rem'}">
        <div class="img animated bounceInRight" v-for="(item,index1) in anserData" :key="index1">
          <div class="theTitle">
            <p class="Title">{{item.quesDes}}</p>

            <div class="ansBox">
              <div
                class="options"
                v-for="(item1,index2) in item.appAnswerVos"
                :key="index2"
                @click="checkraio(item1.id,index1)"
              >
                <p>{{item1.indexChar}}</p>
                <p class="checkCon">{{item1.answerDes}}</p>
                <div>
                  <van-radio-group v-model="radio[index1]">
                    <van-radio :name="item1.id" checked-color="#ffe268"></van-radio>
                  </van-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 树形结构 -->
    <div class="lunBo-box" v-if="questionType == '2'">
      <div id="beijin" v-bind:style="{width:widthLen +'rem',marginLeft:margin+'rem'}">
        <div class="img animated bounceInRight" v-for="(item,index1) in anserData" :key="index1">
          <div class="theTitle">
            <p class="Title">{{item.quesDes}}</p>

            <div class="ansBox">
              <div
                class="options"
                v-for="(item1,index2) in item.appAnswerVos"
                :key="index2"
                @click="checkOptios(item1.id,index1,item1.questionRank)"
              >
                <p>{{item1.indexChar}}</p>
                <p class="checkCon">{{item1.answerDes}}</p>
                <div>
                  <van-radio-group v-model="radio[index1]">
                    <van-radio :name="item1.id" checked-color="#ffe268"></van-radio>
                  </van-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lastOptin">
      <div
        class="lastOptinBtn"
        @click="lastOptins()"
        v-if="listNum>1&&listNum!=allNum && questionType != '2'"
      >上一题</div>
      <!-- <div
        class="lastOptinBtn"
        @click="lastOpTwo(questionRank)"
        v-if="listNum>1&&listNum!=allNum && questionType == '2' && questionRank != -1"
      >上一题</div>-->
      <div class="lastOptinBtn" @click="submitAdm" v-show="showsubmit">提交</div>
    </div>
    <!-- <div
      class="lastOptin1"
      v-if="(listNum==allNum && questionType == '2') || (questionRank== -1 && questionType == '2')"
    >
      <div class="lastBtn" @click="lastOptins">上一题</div>
      <div class="lastBtn" @click="submit">提交</div>
    </div>-->
    <div class="lastOptin1" v-if="listNum==allNum &&questionType != '2'">
      <div class="lastBtn" @click="lastOptins">上一题</div>
      <div class="lastBtn" @click="submit">提交</div>
    </div>

    <van-dialog v-model="show" title="测前提示">
      <div>
        <!-- <p class="text">1.测试一共<span>{{allNum}}</span>题，请尽量在<span>{{testTime}}</span>分钟内完成；</p>
        <p class="text">2.答案没有对错之分，如实作答即可，若遇到难以抉择的问题，请根据第一感觉作答，你的作答将得到严格保密；</p>-->
        <p class="text" v-html="beforeTip"></p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog } from "vant";
import Api from "../Api";
import { Toast } from "vant";
export default {
  name: "AnswerPage",
  data() {
    return {
      show: false,
      radio: [], //单选按钮的数组
      anserData: [], //后台的数据
      allNum: "", //总题目数量
      listNum: 1, //变化的数量
      // submitData: [],//提交的数组
      widthLen: "",
      margin: 0,
      percentage: 0, //进度条的变化
      percentage1: 0, //进度条案平均值
      percentageNum: 0,
      appraisalId: 0, //定义测试的唯一标识
      gender: 0, //区分男女，默认不区分
      orderNo: "",
      testTime: "",
      myDate: "",
      path: "",
      beforeTip: "", //测前提示,
      questionType: "", //题目类型
      questionRank: 0, //当前题目
      showsubmit: false
    };
  },
  created() {
    if (this.$route.query.gender) {
      this.gender = this.$route.query.gender;
    }
    this.questionType = sessionStorage.getItem("questionType");
    let appraisalId = this.$route.query.appraisalId;
    this.orderNo = this.$route.query.orderNo;
    this.testTime = this.$route.query.testTime;
    // var param = new URLSearchParams();
    // param.append("appraisalId", appraisalId);

    var param = {};
    param.appraisalId = appraisalId;
    if (this.orderNo) {
      // param.append("orderNo", this.orderNo);
      param.orderNo = this.orderNo;
    }
    param = this.$qs.stringify(param);
    this.$axios({
      url: Api.getAppraisalQuestion,
      method: "post",
      data: param
    }).then(resp => {
      let anserData = resp.data.datas;
      let allNum = anserData.length; //拿到总的题目数量
      // this.percentage=Math.ceil(100/anserData.length)
      this.widthLen = anserData.length * 19.73;
      if (resp.data.code == 200) {
        this.anserData = anserData;
        this.allNum = allNum;
        this.percentageNum = allNum;
        for (let i = 0; i < this.anserData.length; i++) {
          this.appraisalId = this.anserData[i].appraisalId;
        }
      }else{
        Toast.fail(resp.data.message);
      }
    });
    //测前提示
    // var para=new URLSearchParams()
    // para.append("appraisalId", appraisalId)
    var param = {};
    param.appraisalId = appraisalId;
    param = this.$qs.stringify(param);
    this.$axios({
      url: Api.getNotice,
      method: "post",
      data: param
    }).then(resp => {
      if (resp.data.code == 200) {
        this.beforeTip = resp.data.datas;
      }
    });
  },
  mounted() {
    this.myDate = new Date().getTime();
    this.path = window.location.hash;
  },
  beforeDestroy() {
    var endtim = new Date().getTime();
    this.$root.myDay(this.myDate, endtim, this.path);
  },
  methods: {
    //树形提交
    submitAdm() {
      var that = this;
      that.submit();
    },
    // 树形结构跳转
    checkOptios(id, index1, questionRank) {
      if ( questionRank == "" || questionRank == 0 ) {
         questionRank = index1 +1;
         if(questionRank == index1+1){
           questionRank = index1 +2
         }
        }
      this.questionRank = questionRank;
      this.radio[index1] = id;
      if (questionRank == -1 || questionRank > this.allNum) {
        this.showsubmit = true;
        return;
      } else {
        this.showsubmit = false;
      }
      //   this.percentage1 = Math.ceil(100 / this.percentageNum);
      this.percentage1 = (questionRank / this.percentageNum).toFixed(2) * 100;
      if (this.percentage < 100) {
        this.percentage = this.percentage1;

        if (this.percentage > 100) {
          this.percentage = 100;
        }
      }
      var that = this;
      if (index1 < this.anserData.length - 1) {
        this.listNum = questionRank;
        setTimeout(function() {
          that.margin = (questionRank - 1) * -7.5;
        }, 200);
      }
      this.$forceUpdate();
    },
    //正常下一题和按钮
    checkraio(id, index1) {
      this.radio[index1] = id;
      this.percentage1 = Math.ceil(100 / this.percentageNum);
      if (this.percentage < 100) {
        this.percentage += this.percentage1;
        if (this.percentage > 100) {
          this.percentage = 100;
        }
      }
      var that = this;
      if (index1 < this.anserData.length - 1) {
        this.listNum = index1 + 1 + 1;
        setTimeout(function() {
          that.margin = (index1 + 1) * -7.5;
        }, 200);
      }
      this.$forceUpdate();
    },
    // // 树形上一题
    // lastOpTwo(questionRank) {
    //   var that = this;
    //   if (that.margin < 0) {
    //     setTimeout(function() {
    //       that.margin = that.margin + 7.5;
    //     }, 200);
    //   }
    //   this.listNum--;
    //   this.percentage -= this.percentage1;
    // },
    //上一题
    lastOptins() {
      var that = this;
      if (that.margin < 0) {
        setTimeout(function() {
          that.margin = that.margin + 7.5;
        }, 200);
      }
      this.listNum--;
      this.percentage -= this.percentage1;
    },
    //提交
    submit() {
      if (
        !this.radio ||
        (this.radio.length < this.allNum && this.questionType != 2)
      ) {
        return;
      }
      let str = this.radio.join(",");
      // var param = new URLSearchParams()
      // param.append("appraisalId", this.appraisalId)
      // param.append("answerIds", str)
      // param.append("gender", this.gender)

      var param = {};
      param.appraisalId = this.appraisalId;
      param.answerIds = str;
      param.gender = this.gender;
      if (this.orderNo) {
        // param.append("orderNo", this.orderNo)
        param.orderNo = this.orderNo;
      }
      param = this.$qs.stringify(param);
      this.$axios({
        url: Api.submitAnswer,
        method: "post",
        data: param
      }).then(resp => {
        if (resp.data.code == 200) {
          this.$router.push({
            path: "/BaoGao",
            query: {
              reportIdStr: resp.data.datas,
              orderNo: this.orderNo,
              appraisalId: this.appraisalId
            }
          });
        } else {
          Toast("没有相应的报告");
        }
      });
    },
    dialogBtn() {
      this.show = true;
    }
  }
};
</script>

<style scoped lang="less">
.clear:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clear {
  zoom: 1;
}
.ansBox {
  /*border: 1px solid black;*/
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  /*flex-direction: column;*/
  align-content: flex-start;
  /*align-items: center;*/
  height: 5.2rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
/deep/.van-button {
  span {
    color: orange;
  }
}
/deep/ .van-card__title {
  border: 1px solid black;
  color: white;
}

.progress {
  display: flex;
  justify-content: space-around;
  padding: 0 15px;
  align-items: center;
  /*border: 1px solid black;*/
  height: 45px;

  .pro {
    border: 1px solid black;
    width: 50%;
    border-radius: 3px;
    /*padding-top:7px;*/
  }

  .num {
    font-size: 12px;

    span {
      font-weight: bold;
      font-size: 16px;
    }
  }

  .tim {
    border: 1px solid black;
  }

  .icon {
    /*border: 1px solid black;*/
    font-size: 0.36rem;
  }

  /*.tIcon {*/
  /*    border: 1px solid black;*/
  /*    padding-top: 1px;*/
  /*}*/
}

.lunBo-box {
  width: 100%;
  position: relative;
  overflow: hidden;
  height: 8rem;
  /*border: 1px solid black;*/

  #beijin {
    /*border: 1px solid blue;*/
    margin: auto;
    overflow: hidden;
    /*position: absolute;*/
    /*height: 9rem;*/
    /*left: 0;*/
    transition: all 0.3s linear;
    .img {
      /*border: 1px solid #ff5e6d;*/
      left: 0;
      /*height: 9rem;*/
      width: 7.5rem;
      float: left;
    }
  }
}

.theTitle {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .Title {
    width: 90%;
    font-size: 16px;
    font-weight: bold;
    /*background: white;*/
  }

  .options {
    border: 1px solid rgba(0, 0, 0, 0.44);
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    height: 30px;
    font-size: 14px;
    border-radius: 4px;
    margin-top: 0.2rem;
    background: white;
    p {
      margin: 0;
    }
    .checkCon {
      padding: 0 0.15rem;
      text-align: left;
      width: 100%;
    }
  }
}

.lastOptin {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.2rem;
  /*position: absolute;*/
  /*bottom: 0;*/

  .lastOptinBtn {
    width: 90%;
    background: #ffe268;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;
    font-size: 16px;
  }
}

.lastOptin1 {
  width: 89%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.4rem;
  margin-top: 0.2rem;
  /*position: absolute;*/
  /*bottom: 0;*/
  .lastBtn {
    width: 48%;
    text-align: center;
    border-radius: 3px;
    background: #ffe268;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
  }
}

.text {
  font-size: 14px;
  color: #727272;
  padding: 15px;
  margin: 0;
}
</style>