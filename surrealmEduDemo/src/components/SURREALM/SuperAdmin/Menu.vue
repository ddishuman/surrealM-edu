<template>
  <div class="super-admin-menu">
    <img class="menu-logo" src="@/assets/img/SURREALM/Admin/logo_menu.png" />
    <div :class="GetMenuStyle('SAdminOrder')" @click="PageOrder()">
      <img class="menu-item-icon" src="@/assets/img/SURREALM/SuperAdmin/icon_order.png" />
      <label class="menu-item-txt">訂單管理</label>
      <img class="select-mark" src="@/assets/img/SURREALM/SuperAdmin/icon_select_mark.png" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: 'Menu',
  data() {
    return {
      nowTab: '',
      nowApp: '',
    };
  },
  mounted() {
    this.nowTab = this.GetRouteName();
    this.nowApp = this.GetRouteAppName();
    this.SetVH();
    window.addEventListener('resize', this.SetVH);
    window.addEventListener('orientationchange', this.SetVH);
  },
  methods: {
    SetVH() {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
    },
    GetRouteName() {
      return this.$router.currentRoute.name.replace('SURREALM', '');
    },
    GetRouteAppName() {
      var path = this.$route.fullPath;
      if (path.includes('Lecture')) {
        return 'Lecture';
      } else {
        return '';
      }
    },
    GetMenuStyle(menuName) {
      return this.nowTab == menuName ? 'menu-item-select' : 'menu-item-unselect';
    },
    PageOrder() {
      if (this.nowTab != 'SAdminOrder') {
        this.$router.push({ path: '/SURREALM/SuperAdmin/Order' });
        this.nowTab = 'SAdminOrder';
      }
    },
  },
};
</script>