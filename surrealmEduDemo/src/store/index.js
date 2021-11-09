import Vue from 'vue'
import Vuex from 'vuex'
import { apiUserLogin, apiOpenIDLogin } from '@/request.js' //, apiUserLogout

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Profile: {
      Name: localStorage.getItem('Name'),
      Account: localStorage.getItem('Account')
    },
    SURREALM: {
      Register: {
        Email: '',
      },
      ForgetPW: {
        Email: '',
      }
    }
  },
  mutations: {
    setProfile: function (state, data) {
      state.Profile.Name = data.Name
      state.Profile.Account = data.Account
    },
    clearProfile: function (state) {
      state.Profile = {}
    },
    setRegisterEmail: function (state, Email) {
      state.SURREALM.Register.Email = Email;
    },
    setForgetPWEmail: function (state, Email) {
      state.SURREALM.ForgetPW.Email = Email;
    }
  },
  actions: {
    LOGIN: function (context, data) {
      return new Promise((resolve) => {
        apiUserLogin(data).then(res => {
          let resp = res.data;
          if (resp.Status == 'ok') {
            context.commit('setProfile', { Name: resp.Data.Name, Account: resp.Data.Account });

            localStorage.setItem('Account', resp.Data.Account);
            localStorage.setItem('Birthday', resp.Data.Birthday);
            localStorage.setItem('Language', resp.Data.Language);
            localStorage.setItem('Name', resp.Data.Name);
            localStorage.setItem('Nation', resp.Data.Nation);
            localStorage.setItem('Nickname', resp.Data.Nickname);
            localStorage.setItem('OpenID', resp.Data.OpenID);
            localStorage.setItem('Phone', resp.Data.Phone);
            localStorage.setItem('Role', resp.Data.Role);
            localStorage.setItem('School', resp.Data.School);
            localStorage.setItem('Sex', resp.Data.Sex);
            localStorage.setItem('Subject', resp.Data.Subject);
            localStorage.setItem('Photo', resp.Data.Photo);
            localStorage.setItem('Token', resp.Data.Token);
          }
          resolve(resp);
        });
      });
    },
    OPENIDLOGIN: function (context, data) {
      return new Promise((resolve) => {
        apiOpenIDLogin(data).then(res => {
          let resp = res.data;
          //console.log("OPENIDLOGIN: " + JSON.stringify(resp) );
          if (resp.Code == 0) {
            context.commit('setProfile', { Name: resp.Data.Name, Account: resp.Data.Account });

            localStorage.setItem('Account', resp.Data.Account);
            localStorage.setItem('Birthday', resp.Data.Birthday);
            localStorage.setItem('Language', resp.Data.Language);
            localStorage.setItem('Name', resp.Data.Name);
            localStorage.setItem('Nation', resp.Data.Nation);
            localStorage.setItem('Nickname', resp.Data.Nickname);
            localStorage.setItem('OpenID', resp.Data.OpenID);
            localStorage.setItem('Phone', resp.Data.Phone);
            localStorage.setItem('Role', resp.Data.Role);
            localStorage.setItem('School', resp.Data.School);
            localStorage.setItem('Sex', resp.Data.Sex);
            localStorage.setItem('Subject', resp.Data.Subject);
            localStorage.setItem('Photo', resp.Data.Photo);
            localStorage.setItem('Token', resp.Data.Token);
          }
          resolve(resp);
        });
      });
    },
    LOGOUT: function (context) {
      //Vue.$cookies.remove('accessToken');
      localStorage.clear();
      //apiUserLogout();
      context.commit('clearProfile')
    },
    SetNameAccount: function (context, data) {
      context.commit('setProfile', data);
    },
    Register: function (context, data) {
      context.commit('setRegisterEmail', data.account);
    },
    ForgetPW: function (context, data) {
      context.commit('setForgetPWEmail', data.account);
    }
  },
  modules: {
  }
})
