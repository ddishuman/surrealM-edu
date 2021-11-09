import Vue from "vue";
import VueRouter from "vue-router";
//import VueGtag from "vue-gtag";
//import store from "@/store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: {
      name: "SURREALMLogin",
    },
  },
  {
    path: "/SURREALM",
    redirect: {
      name: "SURREALMLogin",
    },
  },
  {
    path: "/SURREALM/Login",
    name: "SURREALMLogin",
    component: () => import("@/views/SURREALM/Account/Login.vue"),
  },
  {
    path: "/SURREALM/Register",
    name: "SURREALMRegister",
    component: () => import("@/views/SURREALM/Account/Register.vue"),
  },
  {
    path: "/SURREALM/RegisterDone",
    name: "SURREALMRegisterDone",
    component: () => import("@/views/SURREALM/Account/RegisterDone.vue"),
  },
  {
    path: "/SURREALM/Active",
    name: "SURREALMActive",
    component: () => import("@/views/SURREALM/Account/Active.vue"),
  },
  {
    path: "/SURREALM/ForgetPW",
    name: "SURREALMForgetPW",
    component: () => import("@/views/SURREALM/Account/ForgetPW.vue"),
  },
  {
    path: "/SURREALM/ForgetPWDone",
    name: "SURREALMForgetPWDone",
    component: () => import("@/views/SURREALM/Account/ForgetPWDone.vue"),
  },
  {
    path: "/SURREALM/ResetPW",
    name: "SURREALMResetPW",
    component: () => import("@/views/SURREALM/Account/ResetPW.vue"),
  },
  {
    path: "/SURREALM/ResetPWDone",
    name: "SURREALMResetPWDone",
    component: () => import("@/views/SURREALM/Account/ResetPWDone.vue"),
  },
  {
    path: "/SURREALM/Backend",
    redirect: {
      name: "SURREALMGuide",
    },
  },
  {
    path: "/SURREALM/Backend/Home",
    name: "SURREALMHome",
    component: () => import("@/views/SURREALM/Backend/Home.vue"),
  },
  {
    path: "/SURREALM/Backend/Guide",
    name: "SURREALMGuide",
    component: () => import("@/views/SURREALM/Backend/Guide.vue"),
  },
  {
    path: "/SURREALM/Backend/AccountInfo",
    name: "SURREALMAccountInfo",
    component: () => import("@/views/SURREALM/Backend/AccountInfo.vue"),
  },
  {
    path: "/SURREALM/Backend/LectureOwn",
    name: "SURREALMLectureOwn",
    component: () => import("@/views/SURREALM/Backend/LectureOwn.vue"),
  },
  {
    path: "/SURREALM/Backend/LectureHistory",
    name: "SURREALMLectureHistory",
    component: () => import("@/views/SURREALM/Backend/LectureHistory.vue"),
  },
  {
    path: "/SURREALM/Backend/StudentManager",
    name: "SURREALMStudentManager",
    component: () => import("@/views/SURREALM/Backend/StudentManager.vue"),
  },
  {
    path: "/SURREALM/Backend/Files",
    name: "SURREALMFiles",
    component: () => import("@/views/SURREALM/Backend/Files.vue"),
  },
  {
    path: "/SURREALM/Backend/Systems",
    name: "SURREALMSystems",
    component: () => import("@/views/SURREALM/Backend/Systems.vue"),
  },
  {
    path: "/SURREALM/Client",
    redirect: {
      name: "SURREALMClientGuide",
    },
  },
  {
    path: "/SURREALM/Client/Guide",
    name: "SURREALMClientGuide",
    component: () => import("@/views/SURREALM/Client/Guide.vue"),
  },
  {
    path: "/SURREALM/Client/AccountInfo",
    name: "SURREALMClientAccountInfo",
    component: () => import("@/views/SURREALM/Client/AccountInfo.vue"),
  },
  {
    path: "/SURREALM/Client/LectureOwn",
    name: "SURREALMClientLectureOwn",
    component: () => import("@/views/SURREALM/Client/LectureOwn.vue"),
  },
  {
    path: "/SURREALM/Client/LectureHistory",
    name: "SURREALMClientLectureHistory",
    component: () => import("@/views/SURREALM/Client/LectureHistory.vue"),
  },
  {
    path: "/SURREALM/Client/Files",
    name: "SURREALMClientFiles",
    component: () => import("@/views/SURREALM/Client/Files.vue"),
  },
  {
    path: "/SURREALM/Client/Systems",
    name: "SURREALMClientSystems",
    component: () => import("@/views/SURREALM/Client/Systems.vue"),
  },
  {
    path: "/TokenFailure",
    name: "TokenFailure",
    component: () => import("@/views/TokenFailure.vue"),
  },
  {
    path: "/SURREALM/OpenIDTest",
    name: "OpenIDTest",
    component: () => import("@/views/SURREALM/Account/OpenIDTest.vue"),
  },
  {
    path: "/SURREALM/OpenIDRes",
    name: "OpenIDRes",
    component: () => import("@/views/SURREALM/Account/OpenIDRes.vue"),
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("Token");
  const isLogin = token == null ? false : true;
  var system = "surrealm";
  // if (to.path.toLowerCase().includes("surrealm")) {
  //   system = "surrealm";
  // }
  if (system == "surrealm") {
    if (isLogin) {
      // if (to.path !== "/SURREALM/Login") {
      //   next();
      // } else {
      //   next("/SURREALM/Home");
      // }
      next();
    }
    else {
      if (to.path === "/SURREALM/Register" || to.path === "/SURREALM/RegisterDone" || to.path === "/SURREALM/Active" ||
        to.path === "/SURREALM/ForgetPW" || to.path === "/SURREALM/ForgetPWDone" || to.path === "/SURREALM/ResetPW" ||
        to.path === "/SURREALM/ResetPWDone" || to.path === "/SURREALM/OpenIDTest" || to.path === "/SURREALM/OpenIDRes") {
        next();
      }
      else if (to.path !== "/SURREALM/Login") {
        next("/SURREALM/Login");
      } else {
        next();
      }
    }
  }
});

router.afterEach((to) => {
  Vue.nextTick(() => {
    let pageName = to.name.replace('SURREALM', '');
    document.title = "SURREALM " + pageName;
  });
});

export default router;
