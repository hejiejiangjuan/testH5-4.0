//定义仓库
import Api from '../../Api'
import axios from 'axios'
import qs from 'qs'
export default {
    state:{
        appraisalHomeContent:[],
    },
    actions:{
        checkPage(context,obj) {
            //判断是否需要进男女选择页
            // var param = new URLSearchParams();
            // param.append("appraisalId",obj.appraisalId)
            var param={}
            param.appraisalId=obj.appraisalId
            param=qs.stringify(param)
           return  axios({
                url: Api.getAppraisalHomeContent,
                method: "post",
                data: param
            }).then(resp => {
               if (resp.data.code==200){
                   var appraisalHomeContent=resp.data.datas
                    context.commit("getInfo",appraisalHomeContent)
               }
            })
        }
    },
    mutations:{
        getInfo(state,myData){
            state.appraisalHomeContent=myData
        }

    },
    getters:{

    }

}