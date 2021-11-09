<template>
  <div class="studentItem">
    <div :class="SelectedStyle(Student.Selected)">
      <label @click="SelectStudent">{{ Student.Name }}</label>
      <img @click="EditStudent" src="@/assets/img/SURREALM/Backend/StudentManager/icon_edit.png" />
    </div>
    <div class="hoverArea">
      <label class="title">{{ $t('SURREALM.StudentManager.StudentName') }}:</label>
      <label class="content">{{ Student.Name }}</label>
      <label class="title">{{ $t('SURREALM.StudentManager.StudentNickName') }}:</label>
      <label class="content">{{ Student.Nickname }}</label>
      <label class="title">{{ $t('SURREALM.StudentManager.StudentSchool') }}:</label>
      <label class="content">{{ Student.School }}</label>
      <label class="title">{{ $t('SURREALM.StudentManager.StudentEmail') }}:</label>
      <label class="content">{{ Student.Email }}</label>
      <label class="title">{{ $t('SURREALM.StudentManager.StudentTag') }}:</label>
      <div class="tagArea">
        <label v-for="tag in Student.Tags" :key="tag.Serial" class="tagItem">{{ tag.Name }}</label>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StudentItem',
  props: {
    Student: Object,
    // {
    //   Serial: 1,
    //   Name: '學生A',
    //   Nickname:'AAA',
    //   School: '花蓮國中',
    //   Email: 'qwe@asd.com',
    //   Selected: false,
    //   Tags: [
    //     { Serial: 1, Name: '成績前3名' },
    //     { Serial: 2, Name: '90分俱樂部' },
    //   ],
    // },
  },
  data() {
    return {
    };
  },
  methods: {
    SelectedStyle(Selected) {
      return Selected ? 'select' : 'unselect';
    },
    SelectStudent() {
      this.$emit('switch-select', this.Student);
    },
    EditStudent() {
      this.$emit('edit-student');
    },
  },
};
</script>