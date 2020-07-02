<template>
	<div class="Turn_div">
		<!--资产划转-->
		<el-row :gutter="60">
			<el-col :xs="24" :sm="24" :md="12" :lg="12">
				<el-form ref="form" :model="form">
          <el-form-item class="title" prop="region" v-show="!(form.toValue == '余币宝' || form.toValue == 'earn' || form.toValue == '餘幣寶')">
            <div class="content">
              <img src="../assets/USDT.png" alt="" />
              <span>USDT</span>
            </div>
            <p>{{$t('trasfer.available')}} {{abiliyPrice}} USDT </p>
          </el-form-item>
          <!--余币宝的币种选择-->
          <el-form-item :label="$t('recharge.select')" style="display: block;text-align: right" v-show="form.toValue == '余币宝' || form.toValue == 'earn' || form.toValue == '餘幣寶'">
            <img :src="coinImgAdd" slot="label" style="vertical-align: middle"/>
            <el-select v-model="form.region" :placeholder="$t('form.select')" @change="selectCoin">
              <el-option v-for="item in coinArr" :key="item.id" :value="item">
                <img v-if="item == 'USDT-ERC20' || item == 'USDT-OMIN'" src="../assets/USDT.png" />
                <img v-else :src="require('../assets/'+ item +'.png')" />
                <span>{{item}}</span>
              </el-option>
            </el-select>
            <span>{{$t('trasfer.available')}} {{abiliyPrice}} {{form.region}} </span>
          </el-form-item>

					<div class="transfer_box">
						<div class="exchangBtn" @click="changeBoxFun"><img src="../assets/exchangeIcon.png" /></div>
						<div class="exchangContent">
							<el-form-item>
								<p>{{$t('contract.from')}}：</p>
								<el-select v-model="form.fromValue" @change="selectFrom">
									<el-option v-for="item in getFromArr" :key="item.id" :label="item" :value="item"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<p>{{$t('contract.to')}}：</p>
								<el-select v-model="form.toValue" @change="selectTo">
									<el-option v-for="item in getToArr" :key="item.id" :label="item" :value="item"></el-option>
								</el-select>
							</el-form-item>
						</div>
					</div>

          <el-form-item :label="$t('trasfer.turn')" :rules="[{ required: true, message: $t('trasfer.turnEmpty')},{pattern:/^(0(\.\d*[1-9]+\d*)?)$|^([1-9]\d*)(\.\d*)?$/,message:$t('trasfer.turnEmpty'),trigger:'blur'}]" prop="number">
            <el-input v-model="form.number" autocomplete="off" :placeholder="$t('trasfer.turnEmpty')">
              <template slot="append">{{form.region}}</template>
            </el-input>
          </el-form-item>

					<el-button @click="submitFun('form')" class="themeBtn">{{$t('trasfer.sureTurn')}}</el-button>
				</el-form>
			</el-col>
        	<el-col :xs="24" :sm="24" :md="12" :lg="12">
        		<div class="tipBox">

        		</div>
        	</el-col>
        </el-row>
	</div>

</template>

<script>
import codeStatus from '@/config/codeStatus'
import { convertPageApi,convertApi, earnApi, earnInApi, earnOutApi } from '@/api/getData'
export default {
  data(){
    return{
      form:{
        region:'USDT',
        number:'',
        fromValue:'',
        toValue:'',
        link:'',
        asset:'',
        imageUrl:''
      },
      getTotalArr:[],
      getFromArr:[],
      getToArr:[],
      abiliyPrice:0,
      earnId: '', // 余币宝提币收益ID
      // coinArr:['USDT-ERC20','USDT-OMIN','BTC','LTC','EOS','XRP','BCH','ETH','ETC'],
      coinArr:['USDT', 'BTC','ETH'],
      coinImgAdd: require('../assets/USDT.png')
    }
	},
	computed:{
		getTotal(){
			var arr = [this.$t('assets.wallet'),this.$t('assets.contact'),this.$t('assets.earn'),this.$t('assets.lever')];
			this.getTotalArr = arr;
			return arr
		},
		getFrom(){
			var arr = [this.$t('assets.wallet'),this.$t('assets.contact'),this.$t('assets.earn'),this.$t('assets.lever')];
			this.getFromArr = arr;
			return arr
		},
		getTo(){
			var arr = [this.$t('assets.contact'),this.$t('assets.earn'),this.$t('assets.lever')];
			this.getToArr = arr;
			return arr
		},
		getFromValue(){
			return this.form.fromValue
		}
	},
	watch:{
		getFromValue(newValue){
			this.formFun();
		}
	},
	created(){
		var that = this;
		that.form.fromValue = that.getFrom[0];
		that.form.toValue = that.getTo[0]
	},
	mounted(){
		var that = this;

	},
	methods:{
		changeBoxFun(){
			var that = this;
			var fromArr = that.getFromArr;
			var toArr = that.getToArr;

			that.getFromArr = toArr;
			that.getToArr = fromArr;

			var formValueTxt = that.form.fromValue;
			var toValueTxt = that.form.toValue;



			that.form.fromValue = toValueTxt;
			that.form.toValue = formValueTxt;
		},
		async formFun(){//获取信息
			var that = this;
			if(that.form.typeTxt != ''){
				var typeTxt = '';
				if(that.form.fromValue == this.$t('assets.wallet')){
					typeTxt = 'WALLET';
				}else if(that.form.fromValue == this.$t('assets.contact')){
					typeTxt = 'CONTRACT';
				}else if(that.form.fromValue == this.$t('assets.earn')){
          const dataArr = new URLSearchParams();
          dataArr.set('type', this.form.region);
          var res = await earnApi(dataArr);
          if(res.success && res.data.records.length > 0){
            const data = res.data.records[0]
            const operatePrice = Number(data.operatePrice || 0)
            const price = Number(data.price || 0)
            this.earnId = data.id
            that.abiliyPrice = operatePrice + price
          } else {
            that.abiliyPrice = 0
          }
          return;
				}else if(that.form.fromValue == this.$t('assets.lever')){
          typeTxt = 'CURRENCY';
        }
				var dataArr = new URLSearchParams();
				dataArr.set('type',that.form.region);
				dataArr.set('from',typeTxt);
				var res = await convertPageApi(dataArr);
				if(res.success){
					var obj = res.data;
					that.abiliyPrice = (obj.price).toFixed(2)
				}else{
					codeStatus(res.code,function(msg){
						that.$message.error(msg)
					})
				}
			}

		},
		submitFun(form){//提交划转
			var that = this;
			that.$refs[form].validate(async (valid) => {
				if(valid){
					var dataArr = new URLSearchParams();
					var typeTxt = '';
          if(that.form.fromValue == this.$t('assets.wallet')){
						typeTxt = 'WALLET';
          }else if(that.form.fromValue == this.$t('assets.contact')){
						typeTxt = 'CONTRACT';
          }else if(that.form.fromValue == this.$t('assets.earn')){
            typeTxt = 'EARN';
            // 从余币宝划转出来
            dataArr.set('surplusId', this.earnId);
            dataArr.set('symbols',this.form.region);
            dataArr.set('numbers',this.form.number);
            var res = await earnOutApi(dataArr);
            if(res.success){
              that.$message({
                type:'success',
                message:that.$t('assets.trasferSuccess')
              })
              that.$refs[form].resetFields();
              this.formFun()
            }else{
              codeStatus(res.code,function(msg){
                that.$message.error(msg)
              })
            }
            return
          }else if(that.form.fromValue == this.$t('assets.lever')){
            typeTxt = 'CURRENCY';
          }
					var toTypeTxt = '';
          if(that.form.toValue == this.$t('assets.wallet')){
						toTypeTxt = 'WALLET';
          }else if(that.form.toValue == this.$t('assets.contact')){
						toTypeTxt = 'CONTRACT';
          }else if(that.form.toValue == this.$t('assets.earn')){
            // 划转到余币宝
            dataArr.set('surplusId', '0');
            dataArr.set('symbols',this.form.region);
            dataArr.set('numbers',this.form.number);
            var res = await earnInApi(dataArr);
            if(res.success){
              that.$message({
                type:'success',
                message:that.$t('assets.trasferSuccess')
              })
              that.$refs[form].resetFields();
              this.formFun()
            }else{
              codeStatus(res.code,function(msg){
                that.$message.error(msg)
              })
            }
            return
          }else if(that.form.toValue == this.$t('assets.lever')){
            toTypeTxt = 'CURRENCY';
          }
					dataArr.set('type',that.form.region);
					dataArr.set('from',typeTxt);
					dataArr.set('to',toTypeTxt);
					dataArr.set('numbers',that.form.number);
					var res = await convertApi(dataArr);
					if(res.success){
						that.$message({
							type:'success',
							message:that.$t('assets.trasferSuccess')
						})
						that.$refs[form].resetFields();
            this.formFun()
					}else{
						codeStatus(res.code,function(msg){
							that.$message.error(msg)
						})
					}
				}
			})
		},
		selectFrom(value){//选择from
		  if (value == '余币宝' || value == 'earn' || value == '餘幣寶') {
        this.getToArr = [this.$t('assets.wallet')]
        this.form.toValue = this.getToArr[0];
        return
      }
      this.getToArr = (this.getTotal).filter(function(element){
        return element != value
      });
			if(value == this.form.toValue){
        this.form.toValue = this.getToArr[0];
			}
		},
		selectTo(value){//选择To
      this.getFromArr = this.getTotal.filter(function(element){
        return element != value
      });
			if(value == this.form.fromValue){
        this.form.fromValue = this.getFromArr[0];
			}
		},
    selectCoin(value){
      if(value == 'USDT-ERC20' || value == 'USDT-OMIN'){
        this.coinImgAdd = require('../assets/USDT.png')
      }else{
        this.coinImgAdd = require('../assets/'+ value +'.png')
      }
      this.formFun()
    }
	}
}
</script>

<style lang="less">
.Turn_div{
	.el-row{
		background-color: #1C1C27;
		padding: 20px 0;
		margin: 20px 0 40px 0!important;
	}
	.title{
		border: none!important;
		padding: 0!important;
		margin: 0;
		.content{
			display: flex;
			flex-direction: row;
			align-items: center;
			&>img{
				padding-right: 8px;
			}
		}
		.el-form-item__content{
			&::after,&::before{
				display: none!important;
			}
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 0;
			p{
				color:#8E8E8E
			}
		}
	}
	.el-form-item{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		border:1px solid #3B3B3B;
		padding:10px;
		border-radius:4px;
		.el-form-item__label{
			text-align: left;
		}
		.el-input-group__append{
			border: none!important;
			background-color: transparent;
			cursor: pointer;
		}
		.el-input__inner{
			border: none;
			background-color: transparent;
			padding: 0;
		}
	}
	.el-button{
		width: 100%;
		margin: 20px 0;
	}
	/*划转*/
	.transfer_box{
		position: relative;
		top: 0;
		margin-bottom: 20px;
		display: flex;
		flex-direction: row;
		.exchangContent{
			position: relative;
			top: 0;
			left: 106px;
			width: 80%;
			.el-form-item{
				padding: 1.5px;
				.el-form-item__content{
					display: flex;
					flex-direction: row;
					align-items: center;
					p{
						margin: 0;
						padding:0 10px ;
					}
				}
			}
			.el-select{
				width: 100%;
			}
		}
		.exchangBtn{
			position: absolute;
			top: 0;
			background-color: #222732;
			padding: 22px;
			z-index: 99;
			border-radius: 4px 0 0 4px;
			cursor: pointer;
		}
	}
}
</style>
