<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogPost">
        <div class="pnlTitle">
          <label>{{ edit ? $t('SURREALM.Post.Title') : $t('SURREALM.Systems.LectureLog') }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <label class="subTitle">{{ $t('SURREALM.Post.Content') }}</label>
          <textarea
            v-model.trim="PostContent"
            class="PostContent"
            :placeholder="$t('SURREALM.Post.Placeholder.TenWord')"
            :disabled="!edit"
          ></textarea>
          <div class="toolArea" v-show="edit">
            <button class="btnNoBg" @click="CloseDialog">
              {{ $t('SURREALM.Post.Cancel') }}
            </button>
            <button class="btnNoBg" @click="SendPost">
              {{ $t('SURREALM.Post.Send') }}
            </button>
          </div>
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
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { apiAddPost } from '@/request.js';

export default {
  name: 'DialogPost',
  props: {
    show: Boolean,
    serial: Number,
    edit: Boolean,
    msg: String,
  },
  data() {
    return {
      PostContent: '',
      LectureSerial: null,
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
    };
  },
  watch: {
    serial(num) {
      this.LectureSerial = num;
    },
    msg(str) {
      this.PostContent = str;
    },
  },
  computed: {},
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    SendPost() {
      if (this.PostContent.length < 10) {
        this.$toasted.show(this.$t('SURREALM.Post.Placeholder.TenWord'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else if (this.PostContent.length > 300) {
        this.$toasted.show(this.$t('SURREALM.Post.Err.MaxNum'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        let PostMsg = {
          Type: 'Lecture',
          Msg: this.PostContent,
        };
        this.loadingInfo.isLoading = true;
        apiAddPost(this.LectureSerial, PostMsg).then((res) => {
          this.loadingInfo.isLoading = false;
          if (res.data.Status == 'ok') {
            this.$toasted.show(this.$t('SURREALM.Post.Sent'), {
              icon: 'check',
              position: 'bottom-center',
              duration: 3500,
            });
            this.CloseDialog();
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
  components: {
    Loading,
  },
};
</script>