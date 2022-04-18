<template>
  <div class="dialog-full" v-show="Show">
    <div class="dialog-gray" style="background-color: rgba(0, 0, 0, 0.1)">
      <div class="dialog-spadmin-hint">
        <button class="dialog-close" @click="CloseDialog()"></button>
        <label class="hint-txt" v-html="Msg"></label>
        <div class="btn-tool" v-show="Button">
          <button class="btn-left" @click="LeftClick()">{{ Lefttxt }}</button>
          <button class="btn-right" @click="RightClick()">{{ Righttxt }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogMsg',
  props: {
    Show: Boolean,
    Msg: String,
    Button: Boolean,
    Righttxt: String,
    Lefttxt: String,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    RightClick() {
      this.$emit('right-click');
    },
    LeftClick() {
      this.$emit('left-click');
    },
  },
};
</script>