<template>
  <div class="user-table">
    <div class="user-table-title">
      <div class="item-name" :style="GetTxtColor">姓名</div>
      <div class="item-acc" :style="GetTxtColor">帳號</div>
    </div>
    <div class="user-table-scrollarea">
      <div class="user-table-item" v-for="u in UserInfo" :key="u.Serial">
        <label class="item-name">{{ u.Name }}</label>
        <label class="item-acc">{{ u.Account }}</label>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserTable',
  props: {
    Type: String,
    UserInfo: Array,
    //[{ Serial: 1, Name: 'AAA', Account: 'aaa@teacher.com.tw', School: '' }]
  },
  data() {
    return {};
  },
  computed: {
    GetInfoIcon() {
      return this.Type == 'teacher'
        ? require('@/assets/img/SURREALM/Admin/icon_teacher_s.png')
        : require('@/assets/img/SURREALM/Admin/icon_student_s.png');
    },
    GetInfoDel() {
      return this.Type == 'teacher'
        ? require('@/assets/img/SURREALM/Admin/icon_teacher_del.png')
        : require('@/assets/img/SURREALM/Admin/icon_student_del.png');
    },
    GetHoverIcon() {
      return this.Type == 'teacher'
        ? require('@/assets/img/SURREALM/Admin/icon_teacher_l.png')
        : require('@/assets/img/SURREALM/Admin/icon_student_l.png');
    },
    GetHoverPointer() {
      return this.Type == 'teacher'
        ? require('@/assets/img/SURREALM/Admin/icon_teacher_triangle.png')
        : require('@/assets/img/SURREALM/Admin/icon_student_triangle.png');
    },
    GetInfoDelClass() {
      return this.Type == 'teacher' ? 'info-del-teacher' : 'info-del-student';
    },
    GetBgColor() {
      return this.Type == 'teacher' ? { backgroundColor: '#d2ceff' } : { backgroundColor: '#A6E5F2' };
    },
    GetTxtColor() {
      return this.Type == 'teacher' ? { color: '#6058ad' } : { color: '#218da4' };
    },
  },
  methods: {},
};
</script>