<template>
  <div class="SurrealmMenu">
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
    <!-- <div :class="GetMenuStyle('Hint')">
      <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_hint.png" />
      <label class="lblMenu">{{ $t('SURREALM.Menu.Hint') }}</label>
    </div> -->
  </div>
</template>

<script>
export default {
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
  },
  computed: {
    GetAvatarImage() {
      let ImgSrc = localStorage.getItem('Photo');
      return ImgSrc == '' ? require('@/assets/img/SURREALM/Backend/avatar_default.png') : ImgSrc;
    },
  },
  methods: {
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
    GetMenuBoxStyle(menuBoxName) {
      return this.nowApp == menuBoxName ? 'pnlMenuBoxSelect' : 'pnlMenuBoxUnSelect';
    },
    GetSubMenuStyle(menuName) {
      return this.nowTab == menuName ? 'pnlSubMenuSelect' : 'pnlSubMenuUnSelect';
    },
    GetMenuStyle(menuName) {
      return this.nowTab == menuName ? 'pnlMenuSelect' : 'pnlMenuUnSelect';
    },
    PageHome() {
      if (this.nowTab != 'Home') {
        this.$router.push({ path: '/SURREALM/Backend/Home' });
        this.nowTab = 'Home';
      }
    },
    PageLectureOwn() {
      if (this.nowTab != 'LectureOwn') {
        this.$router.push({ path: '/SURREALM/Backend/LectureOwn' });
        this.nowTab = 'LectureOwn';
      }
    },
    PageLectureHistory() {
      if (this.nowTab != 'LectureHistory') {
        this.$router.push({ path: '/SURREALM/Backend/LectureHistory' });
        this.nowTab = 'LectureHistory';
      }
    },
    PageAccounInfo() {
      if (this.nowTab != 'AccountInfo') {
        this.$router.push({ path: '/SURREALM/Backend/AccountInfo' });
        this.nowTab = 'AccountInfo';
      }
    },
    PageStudentManager() {
      if (this.nowTab != 'StudentManager') {
        this.$router.push({ path: '/SURREALM/Backend/StudentManager' });
        this.nowTab = 'StudentManager';
      }
    },
    PageFiles() {
      if (this.nowTab != 'Files') {
        this.$router.push({ path: '/SURREALM/Backend/Files' });
        this.nowTab = 'Files';
      }
    },
    PageSystems() {
      if (this.nowTab != 'Systems') {
        this.$router.push({ path: '/SURREALM/Backend/Systems' });
        this.nowTab = 'Systems';
      }
    },
  },
};
</script>