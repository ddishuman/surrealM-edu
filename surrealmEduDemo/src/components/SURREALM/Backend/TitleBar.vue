<template>
  <div class="pnlTitleArea">
    <img class="imgCustomTitle" :src="iconSrc" />
    <label class="lblTitle">{{ title }}</label>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "TitleBar",
  props: {
    iconSrc: String,
    title: String,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>