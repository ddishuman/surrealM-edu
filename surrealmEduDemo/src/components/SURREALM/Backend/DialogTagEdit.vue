<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogTagEdit">
        <div class="pnlTitle">
          <label>{{ $t('SURREALM.Tags.TagEdit') }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent scrollBar">
          <button class="btnAddTag" @click="AddTag()"></button>
          <input
            class="newTagName"
            type="text"
            v-model.trim="NewTagName"
            maxlength="10"
            :placeholder="$t('SURREALM.Tags.Placeholder.Name')"
          />
          <div class="tagScrollArea" v-show="TagList.length != 0">
            <div class="tagItem" v-for="(tag, index) in TagList" :key="tag.Serial">
              <template v-if="tag.EditMode">
                <button class="btnDoneEdit" @click="DoneEdit(tag, index)"></button>
                <input
                  class="tagNameEdit"
                  type="text"
                  v-model.trim="tag.EditTagName"
                  maxlength="10"
                  :placeholder="$t('SURREALM.Tags.Placeholder.Name')"
                />
                <button class="btnCancel" @click="CancelEdit(tag, index)"></button>
              </template>
              <template v-else>
                <button class="btnStartEdit" @click="StartEdit(tag, index)"></button>
                <label class="tagName">{{ tag.Name }}</label>
                <button class="btnDelTag" @click="ShowDelTagDialog(tag, index)"></button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DialogMsg
      :show="dialogDelTag.show"
      :title="dialogDelTag.title"
      :msg="dialogDelTag.msg"
      :isLeftBtnShow="dialogDelTag.isLeftBtnShow"
      :txtLeftBtn="dialogDelTag.txtLeftBtn"
      :txtRightBtn="dialogDelTag.txtRightBtn"
      @close-dialog="CloseDelTagDialog"
      @click-left="CloseDelTagDialog"
      @click-right="DelTag"
    ></DialogMsg>
  </div>
</template>
<script>
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import { apiGetTag, apiAddTag, apiUpdateTag, apiDelTag } from '@/request.js';

export default {
  name: 'DialogTagEdit',
  props: {
    show: Boolean,
  },
  data() {
    return {
      TagList: [],
      NewTagName: '',
      dialogDelTag: {
        show: false,
        title: '',
        msg: '',
        isLeftBtnShow: true,
        txtLeftBtn: '',
        txtRightBtn: '',
      },
      DelTagInfo: {
        Serial: null,
        Index: null,
      },
    };
  },
  watch: {
    show(bool) {
      if (bool) {
        this.GetTags();
      }
    },
  },
  computed: {},
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    GetTags() {
      apiGetTag().then((res) => {
        if (res.data.Status == 'ok') {
          if (res.data.TagOptions != null) {
            this.TagList = res.data.TagOptions;
            //所有Tag補資料
            this.TagList.forEach((t) => {
              t.EditMode = false;
              t.EditTagName = t.Name;
            });
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
    AddTag() {
      let index = this.TagList.findIndex((obj) => obj.Name.toLowerCase() == this.NewTagName.toLowerCase());
      if (index >= 0 || this.NewTagName.toLowerCase() == this.$t('SURREALM.Tags.TagAll')) {
        this.$toasted.show(this.$t('SURREALM.Tags.Err.TagNameRepeat'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else if (this.NewTagName.trim() == '') {
        this.$toasted.show(this.$t('SURREALM.Tags.Err.TagNameEmpty'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        let Tag = {
          Name: this.NewTagName,
        };
        apiAddTag(Tag).then((res) => {
          if (res.data.Status == 'ok') {
            Tag.Serial = res.data.Serial;
            Tag.EditMode = false;
            Tag.EditTagName = this.NewTagName;
            this.TagList.push(Tag);
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
    StartEdit(Tag, Index) {
      let tmpTag = this.DeepCopy(Tag);
      tmpTag.EditMode = true;
      this.TagList.splice(Index, 1, tmpTag);
    },
    DoneEdit(Tag, Index) {
      let index = this.TagList.findIndex((obj) => obj.Name.toLowerCase() == Tag.EditTagName.toLowerCase());
      if (index >= 0 || Tag.EditTagName.toLowerCase() == this.$t('SURREALM.Tags.TagAll')) {
        this.$toasted.show(this.$t('SURREALM.Tags.Err.TagNameRepeat'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else if (Tag.EditTagName == '') {
        this.$toasted.show(this.$t('SURREALM.Tags.Err.TagNameEmpty'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        let data = {
          Name: Tag.EditTagName,
        };
        apiUpdateTag(Tag.Serial, data).then((res) => {
          if (res.data.Status == 'ok') {
            let tmpTag = this.DeepCopy(Tag);
            tmpTag.EditMode = false;
            tmpTag.Name = tmpTag.EditTagName;
            this.TagList.splice(Index, 1, tmpTag);
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
    CancelEdit(Tag, Index) {
      let tmpTag = this.DeepCopy(Tag);
      tmpTag.EditMode = false;
      tmpTag.EditTagName = tmpTag.Name;
      this.TagList.splice(Index, 1, tmpTag);
    },
    ShowDelTagDialog(Tag, Index) {
      this.DelTagInfo.Serial = Tag.Serial;
      this.DelTagInfo.Index = Index;
      this.dialogDelTag.title = this.$t('SURREALM.Tags.Warning');
      this.dialogDelTag.msg = this.$t('SURREALM.Tags.DelTagMsg');
      this.dialogDelTag.isLeftBtnShow = true;
      this.dialogDelTag.txtLeftBtn = this.$t('SURREALM.Tags.DelLeftBtn');
      this.dialogDelTag.txtRightBtn = this.$t('SURREALM.Tags.DelRightBtn');
      this.dialogDelTag.show = true;
    },
    CloseDelTagDialog() {
      this.DelTagInfo.Serial = null;
      this.DelTagInfo.Index = null;
      this.dialogDelTag.title = '';
      this.dialogDelTag.msg = '';
      this.dialogDelTag.isLeftBtnShow = true;
      this.dialogDelTag.txtLeftBtn = '';
      this.dialogDelTag.txtRightBtn = '';
      this.dialogDelTag.show = false;
    },
    DelTag() {
      apiDelTag(this.DelTagInfo.Serial).then((res) => {
        if (res.data.Status == 'ok') {
          this.TagList.splice(this.DelTagInfo.Index, 1);
          this.$toasted.show(this.$t('SURREALM.Tags.DelDone'), {
            icon: 'check',
            position: 'bottom-center',
            duration: 3500,
          });
          this.CloseDelTagDialog();
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
  },
  components: {
    DialogMsg,
  },
};
</script>