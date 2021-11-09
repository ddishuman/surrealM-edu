<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogTagManager">
        <div class="pnlTitle">
          <label>{{ $t('SURREALM.Tags.TagTitle') }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent scrollBar">
          <input
            class="tagKeyword"
            type="text"
            v-model.trim="TagKeyword"
            maxlength="10"
            :placeholder="$t('SURREALM.Tags.Placeholder.Name')"
          />
          <div class="tagScrollArea" v-show="FilterTagList != null && FilterTagList.length != 0">
            <button
              :class="GetTagStyle(tag.Selected)"
              v-for="tag in FilterTagList"
              :key="tag.Serial"
              @click="StudentSwitchTag(tag)"
            >
              {{ tag.Name }}
            </button>
          </div>
          <button class="btnAddTag" v-show="NewTagName != ''" @click="AddTag">
            {{ `+ ${this.$t('SURREALM.Tags.Add')}「${NewTagName}」` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { apiGetTagByStudent, apiAddTag, apiAddStudentTag, apiDelStudentTag } from '@/request.js';

export default {
  name: 'DialogTagManager',
  props: {
    show: Boolean,
    selectStudent: Array,
  },
  data() {
    return {
      StudentList: [],
      TagList: [],
      TagKeyword: '',
    };
  },
  watch: {
    show(bool) {
      if (bool) {
        this.GetTagsByStudent();
      }
    },
    selectStudent(obj) {
      if (obj != null) {
        this.StudentList = this.DeepCopy(obj);
      } else {
        this.StudentList = [];
        //  {
        //     Serial: 1,
        //     Name: '學生A',
        //     School: '花蓮國中',
        //     Email: 'qwe@asd.com',
        //     Selected: false,
        //     Tags: [
        //       { Serial: 1, Name: '成績前3名' },
        //       { Serial: 2, Name: '90分俱樂部' },
        //     ],
        //   },
      }
    },
  },
  computed: {
    FilterTagList: function () {
      if (this.TagKeyword != '') {
        return this.TagList.filter((t) => {
          let Name = t.Name.toLowerCase();
          let Keyword = this.TagKeyword.toLowerCase();
          return Name.indexOf(Keyword) != -1;
        });
      } else {
        return this.TagList;
      }
    },
    NewTagName: function () {
      let index = this.TagList.findIndex((obj) => obj.Name.toLowerCase() == this.TagKeyword.toLowerCase());
      return index >= 0 || this.TagKeyword.toLowerCase() == this.$t('SURREALM.Tags.TagAll') ? '' : this.TagKeyword;
    },
    StudentSerialList: function () {
      let tmpStudentSerialList = this.DeepCopy(this.StudentList);
      tmpStudentSerialList.forEach(function (s) {
        delete s.Name;
        delete s.School;
        delete s.Email;
        delete s.Selected;
        delete s.Tags;
      });
      return tmpStudentSerialList;
    },
  },
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    GetTagsByStudent() {
      let SerialList = Object.values(this.StudentSerialList).map((s) => s.Serial);
      apiGetTagByStudent(SerialList).then((res) => {
        if (res.data.Status == 'ok') {
          if (res.data.TagList == null) {
            this.TagList = [];
          } else {
            this.TagList = res.data.TagList;
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
    GetTagStyle(Selected) {
      return Selected ? 'tagSelect' : 'tagUnSelect';
    },
    AddTag() {
      let Tag = {
        Name: this.NewTagName,
      };
      apiAddTag(Tag).then((res) => {
        if (res.data.Status == 'ok') {
          Tag.Serial = res.data.Serial;
          Tag.Selected = false;
          this.TagList.push(Tag);
          //如果要變成新增Tag 就是Selected true 要再多call this.StudentSwitchTag(Tag)
          //這要在 Add Tag Api內做
          //還要SyncStudentManager那邊的TagList Call this.SyncTagList();
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    StudentSwitchTag(Tag) {
      let index = this.TagList.findIndex((t) => t.Serial == Tag.Serial);
      let data = { StudentList: this.StudentSerialList };
      if (Tag.Selected) {
        apiDelStudentTag(Tag.Serial, data).then((res) => {
          if (res.data.Status == 'ok') {
            this.TagList[index].Selected = false;
            this.$toasted.show(this.$t('SURREALM.Tags.EditOK'), {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      } else {
        apiAddStudentTag(Tag.Serial, data).then((res) => {
          if (res.data.Status == 'ok') {
            this.TagList[index].Selected = true;
            this.$toasted.show(this.$t('SURREALM.Tags.EditOK'), {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
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
  },
};
</script>