<template>
  <div class="admin-menu">
    <img class="menu-logo" src="@/assets/img/SURREALM/Admin/logo_menu.png" />
    <div :class="GetMenuStyle('AdminAccountSetting')" @click="PageAccountSetting()">
      <img class="menu-item-icon" src="@/assets/img/SURREALM/Admin/icon_account.svg" />
      <label class="menu-item-txt">帳號管理</label>
      <img class="select-mark" src="@/assets/img/SURREALM/Admin/icon_select_mark.png" />
    </div>
    <div :class="GetMenuStyle('AdminInfo')" @click="PageAdminInfo()">
      <img class="menu-item-icon" src="@/assets/img/SURREALM/Admin/icon_setting.svg" />
      <label class="menu-item-txt">個人設定</label>
      <img class="select-mark" src="@/assets/img/SURREALM/Admin/icon_select_mark.png" />
    </div>

    <!-- <div class="SurrealmMenu">
      <img class="imgAvatar" :src="GetAvatarImage" />
      <div :class="GetMenuStyle('Home')" @click="PageHome">
        <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_home.png" />
        <label class="lblMenu">{{ $t('SURREALM.Menu.Home') }}</label>
      </div>
      <div :class="GetMenuBoxStyle('Lecture')" @click.self="PageLectureOwn">
        <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_lecture.png" @click.self="PageLectureOwn" />
        <label class="lblMenu" @click.self="PageLectureOwn">{{ $t('SURREALM.Menu.Lecture') }}</label>
        <br />

        <div class="pnlSubMenu">
          <div :class="GetSubMenuStyle('LectureOwn')" @click="PageLectureOwn">
            <img class="imgSubMenu" src="@/assets/img/SURREALM/Backend/Menu/icon_lecture_own.png" />
            <label class="lblSubMenu">{{ $t('SURREALM.Menu.LectureOwn') }}</label>
          </div>
          <div :class="GetSubMenuStyle('LectureHistory')" @click="PageLectureHistory">
            <img class="imgSubMenu" src="@/assets/img/SURREALM/Backend/Menu/icon_lecture_history.png" />
            <label class="lblSubMenu">{{ $t('SURREALM.Menu.LectureHistory') }}</label>
          </div>
        </div>
      </div>
      <div style="clear: both"></div>
      <div :class="GetMenuStyle('StudentManager')" @click="PageStudentManager">
        <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_student.png" />
        <label class="lblMenu">{{ $t('SURREALM.Menu.Student') }}</label>
      </div>
      <div :class="GetMenuStyle('Files')" @click="PageFiles">
        <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_files.png" />
        <label class="lblMenu">{{ $t('SURREALM.Menu.Files') }}</label>
      </div>
      <div :class="GetMenuStyle('Systems')" @click="PageSystems">
        <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_system.png" />
        <label class="lblMenu">{{ $t('SURREALM.Menu.System') }}</label>
      </div>
      <div :class="GetMenuStyle('AccountInfo')" @click="PageAccounInfo">
        <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_account_info.png" />
        <label class="lblMenu">{{ $t('SURREALM.Menu.AccountInfo') }}</label>
      </div>
      <div :class="GetMenuStyle('Download')" @click="PageDownload">
        <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_download.png" />
        <label class="lblMenu">{{ $t('SURREALM.Menu.Download') }}</label>
      </div>
    </div> -->
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
    PageAccountSetting() {
      if (this.nowTab != 'AdminAccountSetting') {
        this.$router.push({ path: '/SURREALM/Admin/AccountSetting' });
        this.nowTab = 'AdminAccountSetting';
      }
    },
    PageAdminInfo() {
      if (this.nowTab != 'AdminInfo') {
        this.$router.push({ path: '/SURREALM/Admin/Info' });
        this.nowTab = 'AdminInfo';
      }
    },
  },
};
</script>