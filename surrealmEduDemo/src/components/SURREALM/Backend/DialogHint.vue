<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogHint">
        <div class="pnlTitle">
          <label>{{ $t('SURREALM.Hint.Title') }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <template v-if="CurrentStep == 1">
            <label class="SubTitle">{{ $t('SURREALM.Hint.SubTitle1') }}</label>
            <img class="HintImage" src="@/assets/img/SURREALM/Backend/Hint/hint1.png" />
            <label class="DescLeft" v-html="$t('SURREALM.Hint.Desc1_1')"></label>
            <label class="DescRight" v-html="$t('SURREALM.Hint.Desc1_2')"></label>
            <img class="ToStep2" src="@/assets/img/SURREALM/Backend/Hint/arrow.png" @click="Step(2)" />
            <label class="PageNumber">{{ CurrentStep }}</label>
          </template>
          <template v-else>
            <img class="HintImage" src="@/assets/img/SURREALM/Backend/Hint/hint2.png" />
            <label class="DescLeft" v-html="$t('SURREALM.Hint.Desc2_1')"></label>
            <label class="DescRight" v-html="$t('SURREALM.Hint.Desc2_2')"></label>
            <img class="ToStep1" src="@/assets/img/SURREALM/Backend/Hint/arrow.png" @click="Step(1)" />
            <label class="PageNumber">{{ CurrentStep }}</label>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogPost',
  props: {
    show: Boolean,
  },
  data() {
    return {
      CurrentStep: 1,
    };
  },
  watch: {},
  computed: {},
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    Step(Index) {
      this.CurrentStep = Index;
    },
  },
};
</script>