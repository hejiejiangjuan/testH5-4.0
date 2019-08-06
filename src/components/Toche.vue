<template>
    <div class="mu-load-more"
         @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">
        <div class="mu-refresh-control" v-if="!isNaN(top) && top !== 0"
             :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }">
            <svg-icon icon-class="gengxin" class="mu-refresh-svg-icon" v-if="state === 0 || state === 1"
                      :style="{ transform: 'rotate(' + (top * 2) + 'deg)' }"></svg-icon>
        </div>
        <div class="mu-refresh-control son" v-if="state === 2" :style="{ 'margin-top': marginTop + 'px' }">
            <svg-icon icon-class="jianchagengxin" class="mu-refresh-svg-icon refresh" v-if="state === 2"></svg-icon>
        </div>
        <slot></slot>
    </div>

</template>

<script>
    export default {
        name: "Toche",
        props: {
            offset: {type: Number, default: 40},
            enableInfinite: {type: Boolean, default: true},
            enableRefresh: {type: Boolean, default: true},
            onRefresh: {type: Function, default: undefined, required: false},
            onInfinite: {type: Function, default: undefined, require: false}
        },
        data() {
            return {
                top: 0,
                state: 0,
                startY: 0,
                startScroll: 0,
                touching: false,
                infiniteLoading: false,
                refreshShow: true,
                infiniteState: true,
                showLoad: false,
                marginTop: 0
            }
        },
        created() {
            if (this.enableRefresh === false) {
                this.refreshShow = false
            }
            window.addEventListener('scroll', this.onScroll)
        },
        destroyed() {
            window.removeEventListener('scroll', this.onScroll)
        },
        methods: {
            // 触摸开始（手指放在触摸屏上）
            touchStart(e) {
                if (window.pageYOffset > 0) return
                if (!this.enableRefresh) return this.startY = e.targetTouches[0].pageY
                this.startScroll = this.$el.scrollTop || 0
                //开启滑动记录
                this.touching = true
            },

            touchMove(e) {
                // 这里控制是否可以上下拉    代表正在滑动
                if (!this.enableRefresh || this.$el.scrollTop > 0 || !this.touching) {
                    return
                }
                //  获取拉取的间隔差   当前移动的y点      初始的y点        初始顶部距离
                let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
                //如果是往上滑的话，就取消事件
                if (diff > 0) {
                    e.preventDefault()
                    // 对状态进行处理，看是否处于刷新中
                    this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)
                }
                if (this.state === 2) {//in refreshing
                    return
                }
                if (this.top >= this.offset) {
                    this.state = 1
                } else {
                    this.state = 0
                }
            },
            // 触摸结束（手指从触摸屏上移开）
            touchEnd() {
                if (!this.enableRefresh) {
                    return this.touching = false
                }
                if (this.state === 2) {
                    this.state = 2
                    this.top = 0
                    return
                }
                if (this.top >= this.offset) {
                    this.refresh()
                } else {
                    this.state = 0
                    this.top = 0
                }
            },
            refresh() {
                this.marginTop = this.top
                this.state = 2
                this.top = 0
                this.onRefresh(this.refreshDone)
            },
            refreshDone() {
                this.state = 0
                this.top = 0
                this.marginTop = 0
            },
            infinite() {
                this.infiniteLoading = true
                this.onInfinite(this.infiniteDone)
            },
            infiniteDone(length) {
                const self = this
                if (length === 0) {
                    self.infiniteState = false
                }
                this.showLoad = false
                self.infiniteLoading = false
            },
            onScroll() {
                if (this.onInfinite) {
                    let scrollTop = this.getScrollTop()
                    let scrollHeight = this.getScrollHeight()
                    let windowHeight = this.getWindowHeight()
                    if (scrollTop + windowHeight === scrollHeight) {
                        this.showLoad = true
                        this.infinite()
                    }
                }
            },
            // 滚动条在Y轴上的滚动距离
            getScrollTop() {
                var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0
                if (document.body) {
                    bodyScrollTop = document.body.scrollTop
                }
                if (document.documentElement) {
                    documentScrollTop = document.documentElement.scrollTop
                }
                scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
                return scrollTop
            },

            // 文档的总高度
            getScrollHeight() {
                var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0
                if (document.body) {
                    bodyScrollHeight = document.body.scrollHeight;
                }
                if (document.documentElement) {
                    documentScrollHeight = document.documentElement.scrollHeight;
                }
                scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight
                return scrollHeight
            },
            // 浏览器视口的高度
            getWindowHeight() {
                var windowHeight = 0
                if (document.compatMode === 'CSS1Compat') {
                    windowHeight = document.documentElement.clientHeight
                } else {
                    windowHeight = document.body.clientHeight
                }
                return windowHeight
            }

        }
    }
</script>

<style lang="less" scoped>
    .mu-load-more {
        position: relative;
        overflow: hidden;
    }
    .mu-refresh-control {
        display: flex;
        margin: 0 auto;
        width: 80px;
        height: 80px;
        color: #2196f3;
        align-items: center;
        justify-content: center;
        background-color: #FFF;
        border-radius: 50%;
        -webkit-box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
        position: absolute;
        left: 50%;
        margin-left: -38px;
        margin-top: 24px;
        z-index: 90;
    }
    .mu-refresh-svg-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        fill: currentColor;
    }
    .refresh {
        -webkit-transform: rotate(360deg);
        animation: rotation 1s linear infinite;
        -moz-animation: rotation 1s linear infinite;
        -webkit-animation: rotation 1s linear infinite;
        -o-animation: rotation 1s linear infinite;
    }
    @-webkit-keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    .son {
        position: absolute;
        animation: lightAni 1s linear 1;
    }
    @keyframes lightAni {
        0% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-50px);
        }
        100% {
            transform: translateY(-100px);
        }
    }
</style>
