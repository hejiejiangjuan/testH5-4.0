//定义仓库
import axios from 'axios'
import qs from 'qs'
export default {
    state:{
        comData:""
    },
    actions:{
        getLogo(context,temp){
            var that = this;
            var param = qs.stringify(temp)
            axios({
                url: "/wx/home/getLogo",
                method: "post",
                data: param
            }).then(resp => {
                if (resp.data.code==200){
                    var myData=resp.data.datas
                    context.commit("getData",myData)
                }
                // that.tenantName = resp.data.datas.tenantName
                // that.logo = resp.data.datas.logo;
            })
        },
    },
    mutations:{
        getData(state,myData){
            state.comData=myData
        }
    },
    getters:{

    }

}