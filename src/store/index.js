import Vue from 'vue'
import Vuex from 'vuex'
import homePage from './modules/homePage'
import searchPage from './modules/serachPage'
import checkPage from "./modules/checkPage"
Vue.use(Vuex);
export default new Vuex.Store({
    modules:{
        homePage,
        searchPage,
        checkPage
    }
})