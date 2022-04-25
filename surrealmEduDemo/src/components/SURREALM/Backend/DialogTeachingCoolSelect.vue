<template>
  <div class="pnlDialogFull" v-show="show">
    <div class="pnlDialogGray" style="background: rgba(0, 0, 0, 0.7)">
      <div class="pnlDialogTeachingCool">
        <div class="pnlTitle">
          <input
            class="filterKeyIn"
            type="text"
            v-model.trim="FilterKeyword"
            :placeholder="$t('SURREALM.LectureOwn.Placeholder.ModelName')"
          />
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <div v-if="FilterModelOption.length == 0" class="nullModel">
            {{ $t('SURREALM.LectureOwn.Err.NullModel', { keyin: FilterKeyword }) }}
          </div>
          <div class="modelItem" v-for="model in FilterModelOption" :key="model.Serial">
            <img :src="model.PhotoUrl" />
            <label>{{ model.Name }}</label>
            <button @click="SelectItem(model)"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogTeachingCoolSelect',
  props: {
    show: Boolean,
    option: Array,
  },
  data() {
    return {
      FilterKeyword: '',
    };
  },
  computed: {
    FilterModelOption: function () {
      if (this.FilterKeyword != '') {
        return this.option.filter((m) => {
          let Name = m.Name.toLowerCase();
          let Keyword = this.FilterKeyword.toLowerCase();
          return Name.indexOf(Keyword) != -1;
        });
      } else {
        return this.option;
      }
    },
  },
  methods: {
    CloseDialog() {
      this.FilterKeyword = '';
      this.$emit('close-dialog');
    },
    SelectItem(model) {
      this.$emit('add-answer', model);
    },
  },
};
</script>