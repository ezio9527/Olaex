<template>
  <div class="home_div">
    <!-- 轮播图 -->
    <div class="block">
      <el-carousel height="600px" :interval="5000" arrow="always">
        <el-carousel-item v-for="item in bannerArr" :key="item.id">
          <a :href="item.link == '' ? 'javascript:;' : item.link" :target="item.link == '' ? '' : '_blank'">
            <img class="imgFull" :src="item.img" alt=""/>
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 币种行情 -->
    <div class="market">
      <div class="container">
        <div class="leftSpread">
          <h2>{{$t('home.mark')}}</h2>
          <el-button @click="checkPair">{{$t('home.checkPair')}}</el-button>
        </div>
      </div>
      <Trade @update="updateTicket"/>
    </div>
    <el-table :data="ticketData" class="table">
      <el-table-column prop="symbol" :label="$t('home.symbol')"></el-table-column>
      <el-table-column prop="newPrice" :label="$t('home.newPrice')">
        <template slot-scope="scope">
          <span :class="{up: scope.row.up, down: !scope.row.up}">{{ scope.row.newPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rose" :label="$t('home.rose')">
        <template slot-scope="scope">
          <span :class="{up: scope.row.up, down: !scope.row.up}">{{ scope.row.rose }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="high" :label="$t('home.high')"></el-table-column>
      <el-table-column prop="low" :label="$t('home.low')"></el-table-column>
      <el-table-column prop="vol" :label="$t('home.vol')"></el-table-column>
    </el-table>
    <!--装逼图-->
    <div class="show">
      <div class="container">
        <h1>{{$t('home.introduce')}}</h1>
        <p>{{$t('home.title_1')}}{{$t('home.title_2')}}{{$t('home.title_3')}}{{$t('home.title_4')}}</p>
        <span>{{$t('home.introduceContent_1')}},{{$t('home.introduceContent_2')}},{{$t('home.introduceContent_3')}}</span>
        <img class="imgFull" src="../assets/home5.png" alt=""/>
      </div>
    </div>
    <!--<div class="container">-->
      <!--&lt;!&ndash; 服务优势 &ndash;&gt;-->
      <!--<div class="article">-->
        <!--<h2>{{$t('home.introduce')}}</h2>-->
        <!--<div class="article_box">-->
          <!--<ul>-->
            <!--<li>-->
              <!--<p>{{$t('home.title_1')}}</p>-->
              <!--<span>{{$t('home.introduceContent_1')}}</span>-->
            <!--</li>-->
            <!--<li>-->
              <!--<p>{{$t('home.title_2')}}</p>-->
              <!--<span>{{$t('home.introduceContent_2')}}</span>-->
            <!--</li>-->
            <!--<li>-->
              <!--<p>{{$t('home.title_3')}}</p>-->
              <!--<span>{{$t('home.introduceContent_3')}}</span>-->
            <!--</li>-->
            <!--<li>-->
              <!--<p>{{$t('home.title_4')}}</p>-->
              <!--<span>{{$t('home.introduceContent_4')}}</span>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!-- 介绍 -->
    <div class="introduce">
      <div class="container">
        <h1>LHC  eXchange - Make users more focused on trading</h1>
        <h3>Providing secure and reliable digital asset trading and asset management services to millions of users worldwide</h3>
        <el-row>
          <el-col :span="8">
            <img src="../assets/home_1.png"/>
            <h4>Safety and trustworthiness</h4>
            <p>Five years'experience in digital assets financial services</p>
            <p>Professional Distributed Architecture and Anti-DDOS System</p>
          </el-col>
          <el-col :span="8">
            <img src="../assets/home_2.png"/>
            <h4>High-end High-quality</h4>
            <p>Rapid asset transfer and unimpeded trading</p>
            <p>Establishment of Trading Service Centers in Several Countries</p>
          </el-col>
          <el-col :span="8">
            <img src="../assets/home_3.png"/>
            <h4>Customer first</h4>
            <p>Fast, efficient trading experience</p>
            <p>Set up a 100% investor protection fund</p>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 下载app -->
    <!--<div class="downloadBox">-->
      <!--<div class="container">-->
        <!--<h2>{{$t('home.once')}}</h2>-->
        <!--<div class="leftSpread verticalBox">-->
          <!--<div class="leftSpread vertical">-->
            <!--<img src="../assets/android.png"/>-->
            <!--<img class="qrcode" src="../assets/download_android.png"/>-->
          <!--</div>-->
          <!--<div class="leftSpread vertical">-->
            <!--<img src="../assets/ios.png"/>-->
            <!--<img class="qrcode" src="../assets/download_ios.png"/>-->
          <!--</div>-->
          <!--<div v-if="isToken == undefined" class="leftSpread vertical">-->
            <!--<el-button @click="jumpRegister">{{$t('home.onceRe')}}</el-button>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!-- 合作平台 -->
    <!--<div class="partner">-->
      <!--<div class="container">-->
        <!--<h2>{{$t('home.together')}}</h2>-->
        <!--<ul>-->
          <!--<li v-for="item in partenArr" :key="item.id">-->
            <!--<a :href="item.href" target="_blank">-->
              <!--<img class="imgFull" :src="item.image" alt=""/>-->
            <!--</a>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
    <!--</div>-->
    <Foot/>
  </div>
</template>
<script>
import Trade from '@/components/trade'
import Foot from '@/components/Foot'
import {partenApi, bannerApi} from '@/api/getData'

export default {
  data() {
    return {
      bannerArr: [],//banner图
      partenArr: [],//合作平台数据
      isToken: sessionStorage.getItem('userToken'),
      lang: sessionStorage.getItem('language'),
      ticketData: []
    }
  },
  created() {
    this.partenFun();
  },
  mounted() {
    this.bannerFun();
  },
  methods: {
    updateTicket (data) {
      this.ticketData = data.map(item => {
        return {
          symbol: item.symbol,
          newPrice: item.close.toFixed(2),
          rose: (item.rose * 100).toFixed(2) + '%',
          up: item.rose >= 0,
          high: item.high.toFixed(2),
          low: item.low.toFixed(2),
          vol: item.vol
        }
      })
    },
    async partenFun() {//合作平台
      var that = this;
      var res = await partenApi();
      that.partenArr = [];
      if (res.code == 200) {
        that.partenArr = res.data;
      }
    },
    async bannerFun() {//banner图
      var that = this;
      var res = await bannerApi();
      that.bannerArr = [];
      if (res.code == 200) {
        that.bannerArr = res.data;
      }
    },
    checkPair() {
      this.$router.push('/transaction')
    },
    jumpRegister() {
      this.$router.push('/register')
    }
  },
  components: {
    Trade, Foot
  }
}
</script>
<style lang="less">
  .home_div {
    //轮播图
    .block {
      a {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
      .el-carousel__arrow {
        background-color: #001840;
        height: 40px;
        width: 40px;
        & > i {
          color: #85D6E8;
          font-weight: bold;
          font-size: 26px;
        }
      }
      .el-carousel__indicators {
        bottom: 50px;
        background-color: transparent;
        border-radius: 4px;
        overflow: hidden;
        .el-carousel__indicator--horizontal {
          padding: 0;
          border-radius: 0px;
          width: 100px;
          background-color: #4C648C;
        }
        .el-carousel__indicator {
          background-color: #4C648C;

          height: 4px;
          &:nth-child(1) {
            border-radius: 4px 0 0 4px;
          }
          &:nth-last-child(1) {
            border-radius: 0px 4px 4px 0;
          }
        }
        .el-carousel__button {
          background-color: transparent;
        }
        .el-carousel__indicator.is-active {
          background-color: #87D8EA;
        }
      }
    }
    .market {
      .container {
        h2 {
          font-size: 28px;
          margin-right: 30px;
          font-weight: inherit;
        }
        .leftSpread {
          margin-top: 50px;
          .el-button--default {
            background-color: transparent;
            border: 1px solid #87D8EA;
            span {
              color: #87D8EA;
            }
          }
        }
      }
    }
    .table {
      width: 1200px;
      margin: 50px auto;
      .up {
        color: #6FC1A1;
      }
      .down {
        color: #EC5E45;
      }
    }
    .show {
      background: url("../assets/home4.png");
      height: 586px;
      .container {
        width: 1200px;
        height: 100%;
        margin: auto;
        overflow: hidden;
        position: relative;
        img {
          width: 556px;
          position: absolute;
          top: 150px;
          right: 0;
        }
        h1 {
          margin-top: 150px;
        }
      }
    }
    .article {
      h2 {
        margin: 40px 0;
        font-size: 28px;
        font-weight: inherit;
      }
      .article_box {
        ul {
          display: flex;
          flex-direction: row;
          li {
            width: 33%;
            margin-right: 20%;
            &:nth-last-child(1) {
              margin: 0;
            }
            p {
              font-size: 18px;
              color: #ffffff;
              line-height: 40px;
              border-bottom: 1px solid #3C3C3C;
            }
            span {
              font-size: 12px;
              color: #666666;
            }
            img {
              width: 260px;
            }
          }
        }
      }
    }
    .introduce {
      background-color: black;
      color: white;
      text-align: center;
      padding-top: 50px;
      padding-bottom: 50px;
      .container {
        width: 1200px;
        margin: auto;
        img {
          width: 160px;
        }
        h1, h3 {
          text-align: left;
        }
        h3 {
          margin-bottom: 40px;
        }
      }
    }
    .downloadBox {
      padding: 40px 0;
      background-color: #92A6ED;
      margin: 80px 0;
      h2 {
        text-shadow: 0px 2px 3px rgba(80, 155, 172, 0.3);
        font-size: 28px;
        font-style: italic;
        text-align: center;
      }
      .qrcode {
        width: 100px;
        height: 100px;
        margin-left: 20px;
        transition: all 1s ease-out;
        -webkit-transition: all 1s ease-out;
        -moz-transition: all 1s ease-out;
        -o-transition: all 1s ease-out;
        &:hover {
          transform: scale(1.5);
          -webkit-transform: scale(1.5);
          -moz-transform: scale(1.5);
          -o-transform: scale(1.5)
        }
      }
      .vertical {
        margin: 40px 0 0 60px;
        button {
          span {
            color: #92A6ED;
          }
        }
      }
      .verticalBox {
        width: 600px;
        margin: 0 auto;
      }
    }
    .partner {
      h2 {
        margin: 40px 0;
        font-size: 28px;
        font-weight: inherit;
      }
      ul {
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
      }
      li {
        width: 33%;
        margin-bottom: 40px;
        a {
          width: 320px;
          text-align: center;
          display: inline-block;
          cursor: pointer;
          img {
            border-radius: 2px;
            height: 120px;
          }
          p {
            color: #ffffff;
          }
        }
      }
    }
  }
</style>
