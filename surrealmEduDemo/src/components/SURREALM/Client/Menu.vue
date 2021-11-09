<template>
  <div class="SurrealmMenu">
    <img class="imgAvatar" :src="GetAvatarImage" />
    <div :class="GetMenuBoxStyle('Lecture')" @click.self="PageLectureOwn">
      <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_lecture.png" @click.self="PageLectureOwn" />
      <label class="lblMenu" @click.self="PageLectureOwn">{{ $t('SURREALM.Menu.Lecture') }}</label>
      <br />

      <div class="pnlSubMenu">
        <div :class="GetSubMenuStyle('ClientLectureOwn')" @click="PageLectureOwn">
          <img class="imgSubMenu" src="@/assets/img/SURREALM/Backend/Menu/icon_lecture_own.png" />
          <label class="lblSubMenu">{{ $t('SURREALM.Menu.LectureOwn') }}</label>
        </div>
        <div :class="GetSubMenuStyle('ClientLectureHistory')" @click="PageLectureHistory">
          <img class="imgSubMenu" src="@/assets/img/SURREALM/Backend/Menu/icon_lecture_history.png" />
          <label class="lblSubMenu">{{ $t('SURREALM.Menu.ClientLectureHistory') }}</label>
        </div>
      </div>
    </div>
    <div style="clear: both"></div>
    <div :class="GetMenuStyle('ClientFiles')" @click="PageFiles">
      <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_files.png" />
      <label class="lblMenu">{{ $t('SURREALM.Menu.Files') }}</label>
    </div>
    <div :class="GetMenuStyle('ClientSystems')" @click="PageSystems">
      <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_system.png" />
      <label class="lblMenu">{{ $t('SURREALM.Menu.System') }}</label>
    </div>
    <div :class="GetMenuStyle('ClientAccountInfo')" @click="PageAccounInfo">
      <img class="imgIcon" src="@/assets/img/SURREALM/Backend/Menu/icon_account_info.png" />
      <label class="lblMenu">{{ $t('SURREALM.Menu.AccountInfo') }}</label>
    </div>
    <!-- <div :class="GetMenuStyle('ClientHint')">
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
      //return this.$router.currentRoute.name.toLowerCase();
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
    PageLectureOwn() {
      if (this.nowTab != 'ClientLectureOwn') {
        this.$router.push({ path: '/SURREALM/Client/LectureOwn' });
        this.nowTab = 'ClientLectureOwn';
      }
    },
    PageLectureHistory() {
      if (this.nowTab != 'ClientLectureHistory') {
        this.$router.push({ path: '/SURREALM/Client/LectureHistory' });
        this.nowTab = 'ClientLectureHistory';
      }
    },
    PageAccounInfo() {
      if (this.nowTab != 'ClientAccountInfo') {
        this.$router.push({ path: '/SURREALM/Client/AccountInfo' });
        this.nowTab = 'ClientAccountInfo';
      }
    },
    PageFiles() {
      if (this.nowTab != 'ClientFiles') {
        this.$router.push({ path: '/SURREALM/Client/Files' });
        this.nowTab = 'ClientFiles';
      }
    },
    PageSystems() {
      if (this.nowTab != 'ClientSystems') {
        this.$router.push({ path: '/SURREALM/Client/Systems' });
        this.nowTab = 'ClientSystems';
      }
    },
  },
};
</script>