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
    path: "/SURREALM/Backend/Download",
    name: "SURREALMDownload",
    component: () => import("@/views/SURREALM/Backend/Download.vue"),
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
    path: "/SURREALM/Client/Download",
    name: "SURREALMClientDownload",
    component: () => import("@/views/SURREALM/Client/Download.vue"),
  },
  {
    path: "/SURREALM/Admin",
    redirect: {
      name: "SURREALMAdminSetInfo",
    },
  },
  {
    path: "/SURREALM/Admin/Login",
    name: "SURREALMAdminLogin",
    component: () => import("@/views/SURREALM/Admin/Login.vue"),
  },
  {
    path: "/SURREALM/Admin/SetInfo",
    name: "SURREALMAdminSetInfo",
    component: () => import("@/views/SURREALM/Admin/SetInfo.vue"),
  },
  {
    path: "/SURREALM/Admin/ForgetPW",
    name: "SURREALMAdminForgetPW",
    component: () => import("@/views/SURREALM/Admin/ForgetPW.vue"),
  },
  {
    path: "/SURREALM/Admin/ResetPW",
    name: "SURREALMAdminResetPW",
    component: () => import("@/views/SURREALM/Admin/ResetPW.vue"),
  },
  {
    path: "/SURREALM/Admin/AccountSetting",
    name: "SURREALMAdminAccountSetting",
    component: () => import("@/views/SURREALM/Admin/AccountSetting.vue"),
  },
  {
    path: "/SURREALM/Admin/Info",
    name: "SURREALMAdminInfo",
    component: () => import("@/views/SURREALM/Admin/Info.vue"),
  },
  {
    path: "/SURREALM/SuperAdmin",
    redirect: {
      name: "SURREALMSAdminOrder",
    },
  },
  {
    path: "/SURREALM/SuperAdmin/Login",
    name: "SURREALMSAdminLogin",
    component: () => import("@/views/SURREALM/SuperAdmin/Login.vue"),
  },
  {
    path: "/SURREALM/SuperAdmin/Order",
    name: "SURREALMSAdminOrder",
    component: () => import("@/views/SURREALM/SuperAdmin/Order.vue"),
  },
  {
    path: "/SURREALM/SuperAdmin/OrderDetail",
    name: "SURREALMSAdminOrderDetail",
    component: () => import("@/views/SURREALM/SuperAdmin/OrderDetail.vue"),
  },
  {
    path: "/TokenFailure",
    name: "TokenFailure",
    component: () => import("@/views/TokenFailure.vue"),
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("Token");
  const isLogin = token == null ? false : true;
  const adminToken = localStorage.getItem("AdminToken");
  const isAdminLogin = adminToken == null ? false : true;
  const superAdminToken = localStorage.getItem("SuperAdminToken");
  const isSuperAdminLogin = superAdminToken == null ? false : true;
  let lowerCasePath = to.path.toLowerCase();
  let system = "surrealm";


  if (lowerCasePath.includes("superadmin")) {
    system = "superadmin";
  } else if (lowerCasePath.includes("admin")) {
    system = "admin";
  }

  if (system == "surrealm") {
    if (isLogin) {
      next();
    }
    else {
      if (lowerCasePath.includes("register") || lowerCasePath.includes("active") ||
        lowerCasePath.includes("forgetpw") || lowerCasePath.includes("resetpw") ||
        lowerCasePath.includes("tokenfailure")) {
        next();
      }
      else if (lowerCasePath !== "/surrealm/login") {
        next("/SURREALM/Login");
      } else {
        next();
      }
    }
  } else if (system == "admin") {
    if (isAdminLogin) {
      next();
    }
    else {
      if (lowerCasePath.includes("setinfo") || lowerCasePath.includes("forgetpw") || lowerCasePath.includes("resetpw")) {
        next();
      }
      else if (lowerCasePath !== "/surrealm/admin/login") {
        next("/SURREALM/Admin/Login");
      } else {
        next();
      }
    }
  }
  else if (system == "superadmin") {
    if (isSuperAdminLogin) {
      next();
    }
    else {
      if (lowerCasePath !== "/surrealm/superadmin/login") {
        next("/SURREALM/SuperAdmin/Login");
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
