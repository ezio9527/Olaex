<template>
  <div class="assetsRecord_div">
    <!-- 资产流水 -->
    <div class="assets_top">
      <el-form ref="form" :model="form">
        <el-form-item prop="region">
          <el-select v-model="form.region" :placeholder="form.select" @change="selectValue">
            <el-option :label="$t('assets.walletAssets')" value="WALLET"></el-option>
            <!--<el-option :label="$t('assets.contactAssets')" value="CONTRACT"></el-option>-->
            <!--<el-option :label="$t('assets.earnAssets')" value="EARN"></el-option>-->
            <!--<el-option :label="$t('assets.leverAssets')" value="LEVER"></el-option>-->
            <el-option :label="$t('assets.spotAssets')" value="CURRENCY"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-button class="themeBtn">{{$t('assetsRecord.btn')}}</el-button> -->
      </el-form>
    </div>

    <el-table class="fishTable" :data="tableData" :empty-text="$t('tip.noRecord')">
      <el-table-column prop="typeTxt" :label="$t('table.type')">
        <template slot-scope="scope">
          <p>
            <span>{{scope.row.typeTxt}}</span>
            <span class="remark">{{(scope.row.concatTxt == '' ? '' : scope.row.concatTxt)}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="flowPrice" :label="$t('table.num')+'('+coin+')'">
        <template slot-scope="scope">
          {{scope.row.symbol}} {{scope.row.flowPrice}}
        </template>
      </el-table-column>

      <el-table-column prop="createTime" :label="$t('table.time')"></el-table-column>
    </el-table>
    <page-total v-if="page.total > 10" :page="page" @pageChange="pageChange"></page-total>
  </div>
</template>

<script>
import pageTotal from '@/components/pageTotal'
import {assetsRecordApi, earnListApi} from '@/api/getData'

export default {
  data() {
    return {
      coin: 'USDT',
      form: {
        region: 'WALLET'
      },
      tableData: [],
      page: {
        currentPage: 1,
        limit: 10,
        total: 0,
      }
    }
  },
  created() {
    this.recordFun();
  },
  methods: {
    async recordFun() {//流水记录
      // *******
      let that = this;
      let dataArr = new URLSearchParams();
      let res
      // 查余币宝
      if (this.form.region == 'EARN') {
        this.coin = ''
        res = await earnListApi(new URLSearchParams());
      } else {
        this.coin = 'USDT'
        dataArr.set('type', that.form.region);
        dataArr.set('current', that.page.currentPage);
        dataArr.set('size', that.page.limit);
        res = await assetsRecordApi(dataArr);
      }
      that.tableData = [];
      if (res.success) {
        that.page.total = Number(res.data.total);
        let obj = this.form.region == 'EARN' ? res.data.records : res.data.records.records
        if (obj.length > 0) {
          obj.forEach(element => {
            var typeTxt;
            switch (element.flowType) {
              case 'WITHDRAW':
                typeTxt = that.$t('assets.withdraw')
                break;
              case 'RECHARGE':
                typeTxt = that.$t('assets.recharge')
                break;
              case 'WITHDRAW_REJECT':
                typeTxt = that.$t('assets.withdrawFail')
                break;
              case 'PLATFORM_ADD':
                typeTxt = that.$t('assets.behindRecharge')
                break;
              case 'PLATFORM_SUB':
                typeTxt = that.$t('assets.behindReduce')
                break;
              case 'TRANSFER_IN':
                typeTxt = that.$t('assets.carry')
                break;
              case 'CONVERT_OUT':
                typeTxt = that.$t('assets.transferEnter')
                break;
              case 'CONVERT_IN':
                typeTxt = that.$t('assets.trasferInfo')
                break;
              case 'HANDLE':
                typeTxt = that.$t('assets.handWarehouse')
                break;
              case 'FIXED':
                typeTxt = that.$t('assets.forceWarehouse')
                break;
              case 'PROFIT':
                typeTxt = that.$t('assets.profileWarehouse')
                break;
              case 'LOSS':
                typeTxt = that.$t('assets.lossWarehouse')
                break;
              case 'BOUGHT':
                typeTxt = that.$t('nav.currency')
                break;
              case 'CONTRACT':
                typeTxt = that.$t('nav.contract')
                break;
              default:
                break;
            }
            var one, two, concatTxt;
            if (element.remark != '') {
              let front, behind
              if (element.remark.indexOf('⇋') != -1) {
                front = element.remark.split('⇋')[0];
                behind = element.remark.split('⇋')[1];
              } else {
                let front = (element.remark).substr(0, 4);
                let behind = (element.remark).substr(5, 9);
              }
              if (front == '钱包账户') {
                one = that.$t('assetsRecord.walletAccount')
              } else if (front == '余币宝账户') {
                one = that.$t('assetsRecord.earnAccount')
              } else if (front == '合约账户') {
                one = that.$t('assetsRecord.contactAccount')
              } else {
                one = ''
              }
              if (behind == '钱包账户') {
                two = that.$t('assetsRecord.walletAccount')
              } else if (front == '余币宝账户') {
                one = that.$t('assetsRecord.earnAccount')
              } else if (behind == '合约账户') {
                two = that.$t('assetsRecord.contactAccount')
              } else {
                two = ''
              }
              // concatTxt = one == '' ? '' : '（'+one +'⇋'+ two+'）';
              concatTxt = one == '' ? '' : '（' + one + (two == '' ? '' : '⇋' + two) + '）';
            } else {
              concatTxt = ''
            }
            element.typeTxt = typeTxt;
            element.concatTxt = concatTxt;
            if (this.form.region == 'EARN') {
              element.flowPrice = Number(element.price).toFixed(2) + '(' + element.type + ')';
            } else {
              element.flowPrice = Number(element.flowPrice).toFixed(2);
            }

            that.tableData.push(element);
          });
        }
      }
    },
    selectValue() {//选择流水记录类型
      var that = this;
      that.recordFun();
    },
    pageChange(item) {//切换页码
      this.page.currentPage = item;
      this.recordFun();
    }
  },
  components: {
    pageTotal
  }
}
</script>

<style lang="less">
  .assetsRecord_div {
    .assets_top {
      padding: 40px 20px;
      background-color: #1C1C27;
      border-radius: 4px;
      margin-bottom: 40px;
      .el-form {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        & > div {
          margin: 0 20px 0 0;
        }
      }
    }
  }
</style>
