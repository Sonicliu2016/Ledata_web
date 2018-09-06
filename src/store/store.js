import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const module = {
  state:{
    navIndex:'2',
  }
}

const store = new Vuex.Store(module);
export default store