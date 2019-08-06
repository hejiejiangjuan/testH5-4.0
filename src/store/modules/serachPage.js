import Api from '../../Api'
import axios from 'axios'
export default {
    state:{
        value:'',//搜索框的值
        CategoryData: [
            {
                checked:false,
                title:"这里是标题",
                desc:"这里是描述信息",
                price:"20",
                tag:"性格",
                img: '/img/5.d1257f90.jpg',
            },
            {
                checked:false,
                title:"这里是标题",
                desc:"这里是描述信息",
                price:"20",
                tag:"爱情",
                img: '/img/6.d6625bfd.jpg',
            },
            {
                checked:false,
                title:"这里是标题",
                desc:"这里是描述信息",
                price:"20",
                tag:"健康",
                img:  '/img/7.ef89033c.jpg',
            },
        ],//类别的数据
        serData:[]
    },
    actions:{
        //搜索
        getVal(context,obj) {
            context.commit("setVal", obj.str)
            axios({
                url: Api.searchAppraisal,
                method:"post",
                data:obj.param
            }).then(resp=>{
                if (resp.data.code==200){
                   let serchData=resp.data.datas
                    context.commit("getSerch",serchData)
                }
            })
        }
        //搜索按钮


    },
    mutations:{
        setVal(state,str){
            state.value=str
        },
        getSerch(state,data){
            state.serData=data
        }

    },

    getters:{

    }

}