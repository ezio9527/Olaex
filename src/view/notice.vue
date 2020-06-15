<template>
    <div class="contact_div">
        <div class="container">
            <h2>{{$t('nav.about')}}</h2>
            <div class="content">
               <ul>
                   <li v-for="(item,index) in listArr" :key="item.id" @click="detailFun(index)">
                       <h3>{{item.title}}</h3>
                       <span>{{item.createTime}}</span>
                   </li>
               </ul>
           </div>
        </div>
        <Page v-if="listArr.length>10" :page="page" @pageChange="pageChange" />
        <Foot />
    </div>
</template>
<script>
import Foot from '@/components/Foot'
import { noticeApi } from '@/api/getData'
import Page from '@/components/pageTotal'
export default {
    data(){
        return{
            title:'',
            content:'',
            page:{
                currentPage: 1,
                limit: 10,
                total:0
            },
            listArr:[]
        }
    },
    created(){
        this.noticeFun();
    },
    methods:{
        async noticeFun(){
            var that = this;
            var dataArr = new URLSearchParams();
            dataArr.set('status','N');
            dataArr.set('current',that.page.currentPage);
            dataArr.set('size',that.page.limit);
            var res = await noticeApi(dataArr);
            that.listArr = [];
			if(res.code == 200){
                that.page.total = Number(res.data.total);
                that.listArr = res.data.records;
            }
        },
        pageChange(item){
            this.page.currentPage = item.currentPage;
            this.noticeFun();
        },
        detailFun(getIndex){
            var that = this;
            var arr = that.listArr;
            var obj = {};
            arr.forEach((element,index) => {
               if(getIndex == index){
                   obj = element
               } 
            });
            sessionStorage.setItem('detailTxt',JSON.stringify(obj));
            that.$router.push('/detail');
        }
    },
    components:{
        Foot,Page
    }
}
</script>
<style lang="less">
.contact_div{
    h2{
        font-weight: initial;
        font-size: 28px;
    }
    .content{
        border-top: 1px solid #3B3B3B;
        img{
            max-width: 100%;
        }
        ul {
            li{
                h3{
                    font-weight: normal;
                }
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                &:hover{
                    background-color: #575F67;
                }
                span{
                    color: #C3C3C3;
                }
                border-bottom: 1px solid #3B3B3B;
            }
        }
    }
}
</style>