<template>
    <div class="datika">
        <div :class="item.btnState ?'options':'optionsBg'" v-for="(item,index) in optionsData" :key="index"  @click="nextPage(item.id,index)">
            <div class="options-a">{{item.option}}</div>
            <div class="options-b">{{item.content}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Datika",
        data(){
            return{
                optionsData:[
                    {
                        id:0,
                        option:"A",
                        content:"尝试加入聊天",
                        btnState:true,//被选中的状态
                    },
                    {
                        id:1,
                        option:"B",
                        content:"有种被抛弃的高举",
                        btnState:true,//被选中的状态
                    },
                    {
                        id:2,
                        option:"C",
                        content:"感到很嫉妒，有点生气地喊他，让他回到身边让他回到身边",
                        btnState:true,//被选中的状态
                    },
                    {
                        id:3,
                        option:"D",
                        content:"不打扰他们，纯粹觉得他们聊得来",
                        btnState:true,//被选中的状态
                    },
                ]
            }

        },
        methods:{
            nextPage(id,index){
                if (id==index) {
                    this.optionsData[index].btnState=!this.optionsData[index].btnState
                    setTimeout( ()=>{
                        this.$router.push("/AnswerQuestions/Topic/TopicTwo")
                    },500)
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .datika{
        margin-top: 20px;
        display: flex;
        justify-content:space-around;
        align-items: center;
        flex-direction: column;
        height:245px;
        .options{
            border: 1px solid black;
            width: 80%;
            font-size: 12px;
            font-weight: bold;
            height: 45px;
            border-radius: 50px 50px;
            justify-content: flex-start;
            display: flex;
            .options-a{
                padding-left: 10px;
                padding-right: 10px;
                line-height: 45px;
                font-size: 18px;
                color:pink;
           }
            .options-b{
                padding-right: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
        }
        .optionsBg{
            border: 1px solid black;
            width: 80%;
            font-size: 12px;
            font-weight: bold;
            height: 45px;
            border-radius: 50px 50px;
            justify-content: flex-start;
            display: flex;
            background: wheat;
            .options-a{
                padding-left: 10px;
                padding-right: 10px;
                line-height: 45px;
                font-size: 18px;
                color:pink;
            }
            .options-b{
                padding-right: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
        }

    }

</style>