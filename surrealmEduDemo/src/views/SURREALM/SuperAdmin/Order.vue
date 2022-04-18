<template>
  <div id="Order">
    <Menu />
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/SuperAdmin/Login" />
    <div class="order-page">
      <div class="title-bar">
        <h1 class="title-txt">訂單管理</h1>
        <button class="title-btn" @click="ShowAddOrder()">
          <img src="@/assets/img/SURREALM/SuperAdmin/icon_add.png" class="btn-icon" />
          <label class="btn-txt">新增訂單</label>
        </button>
        <input class="title-search" type="text" v-model.trim="SearchKeyWord" placeholder="請輸入訂單編號或信箱" />
      </div>
      <div class="order-area">
        <div class="table-title-bar">
          <div class="title-buy-date">
            購買日期
            <button :class="BuyDateStyle()" @click="OrderByBuy()"></button>
          </div>
          <div class="title-email">購買信箱</div>
          <div class="title-order-no">訂單編號</div>
          <div class="title-account-no">可用帳號數(師/生)</div>
          <div class="title-expire-date">
            使用期限
            <button :class="ExpireDateStyle()" @click="OrderByExpire()"></button>
          </div>
          <div class="title-admin">Admin帳號</div>
        </div>
        <div class="table-scroll-area">
          <div class="info-item" v-for="i in FilterInfoList" :key="i.Serial" @click="ShowOrderDetail(i.Serial)">
            <div class="title-buy-date">{{ i.PurchaseDate }}</div>
            <div class="title-email">{{ i.PurchaseEmail }}</div>
            <div class="title-order-no">{{ i.OrderId }}</div>
            <div class="title-account-no">{{ `${i.TeacherNo} / ${i.StudentNo}` }}</div>
            <div class="title-expire-date" :style="ExpireDateColor(i.ExpireDate)">{{ i.ExpireDate }}</div>
            <div class="title-admin" :style="AdminAccountColor(i.AdminAccount)">
              {{ i.AdminAccount == '' ? '未開通' : i.AdminAccount }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <DialogAddOrder :Show="dialogAddOrder.Show" @close-dialog="CloseAddOrder()" />
  </div>
</template>

<script>
import Header from '@/components/SURREALM/SuperAdmin/Header.vue';
import Menu from '@/components/SURREALM/SuperAdmin/Menu.vue';
import DialogAddOrder from '@/components/SURREALM/SuperAdmin/DialogAddOrder.vue';
import { apiGetAdminList } from '@/request.js';

export default {
  mounted() {
    this.GetAdminInfo();
  },
  data() {
    return {
      dialogAddOrder: {
        Show: false,
      },
      SearchKeyWord: '',
      Info: [],
      BuyDateOrder: 'down',
      ExpireDateOrder: '',
    };
  },
  computed: {
    FilterInfoList: function () {
      if (this.SearchKeyWord != '') {
        return this.Info.filter((t) => {
          let PurchaseEmail = t.PurchaseEmail.toLowerCase();
          let AdminAccount = t.AdminAccount.toLowerCase();
          let OrderId = t.OrderId.toLowerCase();
          let Keyword = this.SearchKeyWord.toLowerCase();
          return (
            PurchaseEmail.indexOf(Keyword) != -1 ||
            AdminAccount.indexOf(Keyword) != -1 ||
            OrderId.indexOf(Keyword) != -1
          );
        });
      } else {
        return this.Info;
      }
    },
  },
  methods: {
    BuyDateStyle() {
      let Style = 'btn-order-no';
      if (this.BuyDateOrder == 'up') {
        Style = 'btn-order-up';
      } else if (this.BuyDateOrder == 'down') {
        Style = 'btn-order-down';
      }
      return Style;
    },
    ExpireDateStyle() {
      let Style = 'btn-order-no';
      if (this.ExpireDateOrder == 'up') {
        Style = 'btn-order-up';
      } else if (this.ExpireDateOrder == 'down') {
        Style = 'btn-order-down';
      }
      return Style;
    },
    OrderByBuy() {
      this.ExpireDateOrder = '';
      if (this.BuyDateOrder == '' || this.BuyDateOrder == 'up') {
        this.BuyDateOrder = 'down';
        this.Info.sort(function (a, b) {
          return new Date(a.PurchaseDate) - new Date(b.PurchaseDate);
        });
      } else if (this.BuyDateOrder == 'down') {
        this.BuyDateOrder = 'up';
        this.Info.sort(function (a, b) {
          return new Date(b.PurchaseDate) - new Date(a.PurchaseDate);
        });
      }
    },
    OrderByExpire() {
      this.BuyDateOrder = '';
      if (this.ExpireDateOrder == '' || this.ExpireDateOrder == 'up') {
        this.ExpireDateOrder = 'down';
        this.Info.sort(function (a, b) {
          return new Date(a.ExpireDate) - new Date(b.ExpireDate);
        });
      } else if (this.ExpireDateOrder == 'down') {
        this.ExpireDateOrder = 'up';
        this.Info.sort(function (a, b) {
          return new Date(b.ExpireDate) - new Date(a.ExpireDate);
        });
      }
    },
    AdminAccountColor(Account) {
      return Account == '' ? 'color:#E53049;' : '';
    },
    ExpireDateColor(EDate) {
      let CurrentDate = new Date(this.DateToUTC8(new Date()));
      let ExpireDate = new Date(EDate);
      let Day30Ago = new Date(ExpireDate);
      Day30Ago.setDate(Day30Ago.getDate() - 30);
      return CurrentDate.getTime() > Day30Ago.getTime() ? 'color:#E53049;' : '';
    },
    GetAdminInfo() {
      apiGetAdminList().then((res) => {
        if (res.data.Status == 'ok') {
          this.Info = res.data.Info;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
      // this.Info = [
      //   {
      //     Serial: '1',
      //     PurchaseDate: '2022.03.09',
      //     PurchaseEmail: 'sam@gmail.com',
      //     OrderId: '40453243737',
      //     TeacherNo: '15',
      //     StudentNo: '20',
      //     ExpireDate: '2022.04.22',
      //     AdminAccount: '',
      //   },
      //   {
      //     Serial: '2',
      //     PurchaseDate: '2022.03.15',
      //     PurchaseEmail: 'ian@gmail.com',
      //     OrderId: '40453243739',
      //     TeacherNo: '15',
      //     StudentNo: '20',
      //     ExpireDate: '2023.03.09',
      //     AdminAccount: 'ianAdmin@gmail.com',
      //   }
      // ];
    },
    ShowAddOrder() {
      this.dialogAddOrder.Show = true;
    },
    CloseAddOrder() {
      this.dialogAddOrder.Show = false;
    },
    ShowOrderDetail(Serial) {
      this.$router.push({ path: '/SURREALM/SuperAdmin/OrderDetail?s=' + Serial });
    },
  },
  components: {
    Header,
    Menu,
    DialogAddOrder,
  },
};
</script>
