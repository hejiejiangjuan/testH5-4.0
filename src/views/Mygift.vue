<template>
  <div>
    <van-tabs id="titlevan-bas" v-model="active">
      <van-tab class="adam" title="我送出的">
        <cardgift></cardgift>
      </van-tab>
      <van-tab  class="adam" title="我收到的">
        <obgift></obgift>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import cardgift from "@/components/card/cardgift";
import obgift from "@/components/card/obgift";
export default {
  
  data() {
    return {
      active: 0
    };
  },
    components: { cardgift, obgift },
};
</script>

<style  scoped lang="less">
#app {
  width: 100%;
  height: 100%;
}
.mygift-list {
  background: white;
  padding: 0.35rem 0.48rem;
  padding-bottom: 0.1rem;
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
.mygift-top-title{
  width: 83%;
}
.adme-top {
  padding: 0.15rem 0;
}
.adme-copy {
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
  width: 15%;
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
.adam{
  overflow-x: hidden;
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
/deep/.van-tabs__wrap {
  // border-bottom: 1px solid #dfdfdf;
}
/deep/.van-tabs__content{
  overflow-x: hidden;
  margin-top: 1px;
}
</style>
