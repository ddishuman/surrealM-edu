<template>
  <div class="dialog-full" v-show="Show">
    <div class="dialog-gray" @click.self="CloseDialog()">
      <div class="dialog-import">
        <div class="title-area">
          <img class="icon-alart" src="@/assets/img/SURREALM/Admin/icon_upload.png" />
          <label class="title-txt">批次匯入</label>
        </div>
        <div class="keyin-desc">身分</div>
        <select v-model="Type" class="keyin-input">
          <option v-for="option in TypeOptions" :key="option.Text" :value="option.Value">
            {{ option.Text }}
          </option>
        </select>
        <div class="keyin-desc">上傳文件</div>
        <div class="keyin-import">
          <div class="import-show">+</div>
          <input
            type="file"
            id="fileAccount"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            class="import-hidden-fu"
            @change="ImportUser"
          />
        </div>
      </div>
    </div>
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
import { apiImportAccount } from '@/request.js';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
  name: 'DialogImport',
  props: {
    Show: Boolean,
    Msg: String,
  },
  data() {
    return {
      Type: 'teacher',
      TypeOptions: [
        { Text: '老師', Value: 'teacher' },
        { Text: '學生', Value: 'student' },
      ],
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
    };
  },
  mounted() {},
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },

    ImportUser(event) {
      this.loadingInfo.isLoading = true;
      var postforms = new FormData();
      postforms.append('file', event.target.files[0]);
      apiImportAccount(this.FirstWordUpperCase(this.Type), postforms).then((res) => {
        // console.log('ImportUser res' + JSON.stringify(res.data));
        this.loadingInfo.isLoading = false;
        document.getElementById('fileAccount').value = '';
        if (res.data.Status == 'ok') {
          this.ImportDown();
          this.CloseDialog();
          this.$toasted.show('匯入完成', {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        } else {
          this.$toasted.show(res.data.Error, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    ImportDown() {
      this.$emit('import-down');
    },
  },
  components: {
    Loading,
  },
};
</script>