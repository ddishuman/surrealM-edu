<template>
  <div id="PageStudentManager">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <Menu />
    <div class="pnlPageContent scrollBar">
      <TitleBar
        :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_student.png')"
        :title="$t('SURREALM.StudentManager.PageName')"
      >
        <button class="btn" @click="ShowAddStudent">
          {{ $t('SURREALM.StudentManager.AddStudent') }}
        </button>
        <div class="pnlUploadArea">
          <label class="btn">{{ $t('SURREALM.StudentManager.ImportStudent') }}</label>
          <input
            type="file"
            id="fileStudent"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            class="fuClass"
            @change="ShowImportStudent"
          />
        </div>
        <button class="btn" @click="DownloadExample">
          {{ $t('SURREALM.StudentManager.ImportStudentExample') }}
        </button>
      </TitleBar>
      <div class="studentManager">
        <div class="toolArea">
          <label class="toolTitle">{{ $t('SURREALM.StudentManager.TagFilter') }}</label>
          <select v-model="Student.Tag" class="studentTag" @change="GetStudent(Student.Tag)">
            <option v-for="option in TagOptions" :key="option.Serial" :value="option.Serial">
              {{ option.Name }}
            </option>
          </select>
          <button class="btnWithIcon iconEdit" @click="ShowTagEdit">{{ $t('SURREALM.StudentManager.TagEdit') }}</button>
        </div>
        <div class="toolArea">
          <label class="toolTitle">{{ $t('SURREALM.StudentManager.SelectStudent') }}</label>
          <input
            class="studentKeyword"
            type="text"
            v-model.trim="Student.Keyword"
            :placeholder="$t('SURREALM.LectureOwn.Placeholder.StudentName')"
          />
          <button class="btnWithIcon iconAdd" @click="SwitchAllStudent(true)">
            {{ $t('SURREALM.StudentManager.SelectAll') }}
          </button>
          <button class="btnWithIcon iconRemove" @click="SwitchAllStudent(false)">
            {{ $t('SURREALM.StudentManager.RemoveAll') }}
          </button>
        </div>
        <div class="toolArea">
          <label class="toolTitle">{{ $t('SURREALM.StudentManager.ToolList') }}</label>
          <button class="btnWithIcon iconTag" @click="ShowTagManager">
            {{ $t('SURREALM.StudentManager.StudentTagEdit') }}
          </button>
          <button class="btnWithIcon iconDel" @click="ShowDelStudentTagDialog">
            {{ $t('SURREALM.StudentManager.StudentDel') }}
          </button>
        </div>
        <div class="studentArea">
          <StudentItem
            v-for="item in FilterStudentList"
            :key="item.Serial"
            :Student="item"
            @switch-select="SwitchStudentSelect"
            @edit-student="ShowEditStudentDialog(item)"
          />
        </div>
      </div>
    </div>

    <DialogAddStudent
      :show="dialogAddStudent.show"
      :tagSerial="dialogAddStudent.tagSerial"
      @close-dialog="CloseAddStudent"
      @add-student="AddStudent"
    />
    <DialogEditStudent
      :show="dialogEditStudent.show"
      :serial="dialogEditStudent.serial"
      :email="dialogEditStudent.email"
      :name="dialogEditStudent.name"
      :nickname="dialogEditStudent.nickname"
      @close-dialog="CloseEditStudentDialog"
      @edit-student="EditStudent"
    />
    <DialogTagManager
      :show="dialogTagManager.show"
      :selectStudent="SelectStudentList"
      @close-dialog="CloseTagManager"
    />

    <DialogTagEdit :show="dialogTagEdit.show" @close-dialog="CloseTagEdit" />

    <DialogMsg
      :show="dialogDelStudent.show"
      :title="dialogDelStudent.title"
      :msg="dialogDelStudent.msg"
      :isLeftBtnShow="dialogDelStudent.isLeftBtnShow"
      :txtLeftBtn="dialogDelStudent.txtLeftBtn"
      :txtRightBtn="dialogDelStudent.txtRightBtn"
      @close-dialog="CloseDelStudentTagDialog"
      @click-left="CloseDelStudentTagDialog"
      @click-right="DelStudent"
    ></DialogMsg>

    <Loading
      :active.sync="loadingInfo.isLoading"
      :can-cancel="false"
      :is-full-page="true"
      :color="loadingInfo.color"
      :opacity="loadingInfo.opacity"
      :background-color="loadingInfo.bgColor"
    ></Loading>
  </div>
</template>

<script>
import Header from '@/components/SURREALM/Backend/Header.vue';
import Menu from '@/components/SURREALM/Backend/Menu.vue';
import TitleBar from '@/components/SURREALM/Backend/TitleBar.vue';
import StudentItem from '@/components/SURREALM/Backend/StudentItem.vue';
import DialogAddStudent from '@/components/SURREALM/Backend/DialogAddStudent.vue';
import DialogEditStudent from '@/components/SURREALM/Backend/DialogEditStudent.vue';
import DialogTagManager from '@/components/SURREALM/Backend/DialogTagManager.vue';
import DialogTagEdit from '@/components/SURREALM/Backend/DialogTagEdit.vue';
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { apiGetTag, apiGetStudentDetailByTag, apiDelContact, apiImportContact } from '@/request.js';

export default {
  data() {
    return {
      dialogAddStudent: {
        show: false,
        tagSerial: null,
      },
      dialogEditStudent: {
        show: false,
        serial: null,
        email: '',
        name: '',
        nickname: '',
      },
      dialogTagManager: {
        show: false,
      },
      dialogTagEdit: {
        show: false,
      },
      dialogDelStudent: {
        show: false,
        title: '',
        msg: '',
        isLeftBtnShow: true,
        txtLeftBtn: '',
        txtRightBtn: '',
      },
      TagOptions: [],
      Student: {
        Data: [],
        Tag: -1,
        Keyword: '',
      },
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
    };
  },
  computed: {
    FilterStudentList: function () {
      if (this.Student.Keyword != '') {
        return this.Student.Data.filter((s) => {
          let Name = s.Name.toLowerCase();
          let Keyword = this.Student.Keyword.toLowerCase();
          return Name.indexOf(Keyword) != -1;
        });
      } else {
        return this.Student.Data;
      }
    },
    SelectStudentList: function () {
      return this.Student.Data.filter((s) => {
        return s.Selected == true;
      });
    },
  },
  mounted() {
    this.GetTags();
    this.GetStudent(this.Student.Tag);
  },
  methods: {
    ShowAddStudent() {
      this.dialogAddStudent.tagSerial = this.Student.Tag;
      this.dialogAddStudent.show = true;
    },
    CloseAddStudent() {
      this.dialogAddStudent.show = false;
    },
    ShowImportStudent(event) {
      this.loadingInfo.isLoading = true;
      var postforms = new FormData();
      postforms.append('file', event.target.files[0]);
      apiImportContact(this.Student.Tag, postforms).then((res) => {
        this.loadingInfo.isLoading = false;
        if (res.data.Status == 'ok') {
          this.GetStudent(this.Student.Tag);
          //clear file
          document.getElementById('fileStudent').value = '';
        } else {
          let errmsg = '';
          switch (res.data.Code) {
            case 409:
              errmsg = this.$t('SURREALM.StudentManager.Err.RepeatAdd');
              break;
            case 2001:
              errmsg = this.$t('SURREALM.StudentManager.Err.ImportInvalidAcc');
              break;
            default:
              errmsg = this.$t('SURREALM.ApiErr') + res.data.Code;
              break;
          }
          this.$toasted.show(errmsg, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    ShowEditStudentDialog(studentItem) {
      this.dialogEditStudent.serial = studentItem.Serial;
      this.dialogEditStudent.email = studentItem.Email;
      this.dialogEditStudent.name = studentItem.Name;
      this.dialogEditStudent.nickname = studentItem.Nickname;
      this.dialogEditStudent.show = true;
    },
    CloseEditStudentDialog() {
      this.dialogEditStudent.serial = null;
      this.dialogEditStudent.email = '';
      this.dialogEditStudent.name = '';
      this.dialogEditStudent.nickname = '';
      this.dialogEditStudent.show = false;
    },
    GetTags() {
      apiGetTag().then((res) => {
        if (res.data.Status == 'ok') {
          let allTag = [{ Serial: -1, Name: this.$t('SURREALM.Tags.TagAll') }];
          if (res.data.TagOptions != null) {
            this.TagOptions = allTag.concat(res.data.TagOptions);
          } else {
            this.TagOptions = allTag;
          }
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    GetStudent(tagSerial) {
      apiGetStudentDetailByTag(tagSerial).then((res) => {
        console.log('apiGetStudentDetailByTag:' + JSON.stringify(res.data));
        if (res.data.Status == 'ok') {
          this.Student.Data = res.data.Student;
          this.Student.Data.forEach((t) => {
            t.Selected = false;
          });
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    SwitchStudentSelect(data) {
      var Index = this.Student.Data.findIndex((obj) => obj.Serial == data.Serial);
      let studentItem = this.DeepCopy(data);
      studentItem.Selected = !data.Selected;
      this.Student.Data.splice(Index, 1, studentItem);
    },
    CheckEmptyFilter() {
      if (this.Student.Keyword != '') {
        this.$toasted.show(this.$t('SURREALM.StudentManager.Err.FilterNotEmpty'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
        return false;
      } else if (this.SelectStudentList.length == 0) {
        this.$toasted.show(this.$t('SURREALM.StudentManager.Err.EmptySelect'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
        return false;
      }
      return true;
    },
    ShowTagManager() {
      if (this.CheckEmptyFilter()) {
        this.dialogTagManager.show = true;
      }
    },
    CloseTagManager() {
      this.dialogTagManager.show = false;
      //關閉視窗時 同步tag跟student的資料
      this.GetTags();
      this.GetStudent(this.Student.Tag);
    },
    ShowTagEdit() {
      this.dialogTagEdit.show = true;
    },
    CloseTagEdit() {
      this.dialogTagEdit.show = false;
      //關閉視窗時 同步tag的資料
      this.GetTags();
    },
    ShowDelStudentTagDialog() {
      this.dialogDelStudent.title = this.$t('SURREALM.Tags.Warning');
      this.dialogDelStudent.msg = this.$t('SURREALM.Tags.DelMsg');
      this.dialogDelStudent.isLeftBtnShow = true;
      this.dialogDelStudent.txtLeftBtn = this.$t('SURREALM.Tags.DelLeftBtn');
      this.dialogDelStudent.txtRightBtn = this.$t('SURREALM.Tags.DelRightBtn');
      this.dialogDelStudent.show = true;
    },
    CloseDelStudentTagDialog() {
      this.dialogDelStudent.title = '';
      this.dialogDelStudent.msg = '';
      this.dialogDelStudent.isLeftBtnShow = true;
      this.dialogDelStudent.txtLeftBtn = '';
      this.dialogDelStudent.txtRightBtn = '';
      this.dialogDelStudent.show = false;
    },
    // DelStudentTag() {
    //   if (this.CheckEmptyFilter()) {
    //     let tmpStudentSerialList = this.DeepCopy(this.SelectStudentList);
    //     tmpStudentSerialList.forEach(function (s) {
    //       delete s.Name;
    //       delete s.School;
    //       delete s.Email;
    //       delete s.Selected;
    //       delete s.Tags;
    //     });
    //     let data = { StudentList: tmpStudentSerialList };
    //     apiDelStudentTag(this.Student.Tag, data).then((res) => {
    //       if (res.data.Status == 'ok') {
    //         tmpStudentSerialList.forEach((obj) => {
    //           var Index = this.Student.Data.findIndex((e) => e.Serial == obj.Serial);
    //           this.Student.Data.splice(Index, 1);
    //         });
    //         this.CloseDelStudentTagDialog();
    //       } else {
    //         this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
    //           icon: 'warning',
    //           position: 'bottom-center',
    //           duration: 3500,
    //         });
    //       }
    //     });
    //   }
    // },
    DelStudent() {
      if (this.CheckEmptyFilter()) {
        let tmpStudentSerialList = this.DeepCopy(this.SelectStudentList);
        tmpStudentSerialList.forEach(function (s) {
          delete s.Name;
          delete s.School;
          delete s.Email;
          delete s.Selected;
          delete s.Tags;
          delete s.Nickname;
        });
        let data = { StudentList: tmpStudentSerialList };
        apiDelContact(data).then((res) => {
          if (res.data.Status == 'ok') {
            tmpStudentSerialList.forEach((obj) => {
              var Index = this.Student.Data.findIndex((e) => e.Serial == obj.Serial);
              this.Student.Data.splice(Index, 1);
            });
            this.CloseDelStudentTagDialog();
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      }
    },
    SwitchAllStudent(bool) {
      this.FilterStudentList.forEach((obj) => {
        var Index = this.Student.Data.findIndex((e) => e.Serial == obj.Serial);
        let studentItem = this.DeepCopy(this.Student.Data[Index]);
        studentItem.Selected = bool;
        this.Student.Data.splice(Index, 1, studentItem);
      });
    },
    AddStudent() {
      //data
      //this.Student.Data.push(data);
      this.GetStudent(this.Student.Tag);
    },
    EditStudent(data) {
      var index = this.Student.Data.findIndex((obj) => obj.Serial == data.Serial);
      this.Student.Data[index].Name = data.Name;
      this.Student.Data[index].Nickname = data.Nickname;
    },
    DownloadExample() {
      let url = 'https://surreal-edu.s3.ap-northeast-1.amazonaws.com/surrealm/surrealm_student20210805.xlsx';
      window.open(url);
    },
  },
  components: {
    Header,
    Menu,
    TitleBar,
    StudentItem,
    DialogAddStudent,
    DialogEditStudent,
    DialogTagManager,
    DialogTagEdit,
    DialogMsg,
    Loading,
  },
};
</script>