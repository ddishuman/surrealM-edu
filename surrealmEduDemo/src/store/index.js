import Vue from 'vue'
import Vuex from 'vuex'
import { apiUserLogin, apiOpenIDLogin, apiAdminLogin, apiSuperAdminLogin } from '@/request.js' //, apiUserLogout

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
    },
    Admin: {
      ContactName: localStorage.getItem('ContactName'),
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
    },
    setAdminInfo: function (state, Name) {
      state.Admin.ContactName = Name
    },
  },
  actions: {
    LOGIN: function (context, data) {
      return new Promise((resolve) => {
        apiUserLogin(data).then(res => {
          let resp = res.data;
          if (resp.Status == 'ok') {
            context.commit('setProfile', { Name: resp.Data.Name, Account: resp.Data.Account });
            localStorage.setItem('Account', resp.Data.Account);
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
            localStorage.setItem('Token', Vue.prototype.TokenEncode(resp.Data.Token));
            localStorage.setItem('StudentNo', resp.Data.StudentNo);
            localStorage.setItem('StreamingAuth', resp.Data.Streaming);
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
      let SetDontAgain = localStorage.getItem('SetDontAgainDateUTC8');
      localStorage.clear();
      if (SetDontAgain != null) {
        localStorage.setItem('SetDontAgainDateUTC8', SetDontAgain);
      }
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
    },
    ADMINLOGIN: function (context, data) {
      return new Promise((resolve) => {
        apiAdminLogin(data).then(res => {
          //console.log("ADMINLOGIN:" + JSON.stringify(res.data));
          let resp = res.data;
          if (resp.Status == 'ok') {
            localStorage.setItem('ContactName', resp.Data.ContactName);
            localStorage.setItem('AdminToken', Vue.prototype.TokenEncode(resp.Data.Token));
            context.commit('setAdminInfo', resp.Data.ContactName);
          }
          resolve(resp);
        });
      });
    },
    SUPERADMINLOGIN: function (context, data) {
      return new Promise((resolve) => {
        apiSuperAdminLogin(data).then(res => {
          let resp = res.data;
          if (resp.Status == 'ok') {
            localStorage.setItem('SuperAdminToken', Vue.prototype.TokenEncode(resp.Data.Token));
          }
          resolve(resp);
        });
      });
    },
  },
  modules: {
  }
})
