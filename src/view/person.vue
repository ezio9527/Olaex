<template>
    <div class="person_div">
        <div class="container">
        	<h2>{{$t('person.title')}}</h2>
	        <el-menu :default-active="personIndex" class="el-menu-demo" mode="horizontal" @select="handleNav" router>
                <!--<el-menu-item index="person">{{$t('person.verification')}}</el-menu-item>-->
                <el-menu-item index="set">{{$t('person.set')}}</el-menu-item>
            </el-menu>
            <router-view></router-view>
	    </div>
		<Foot />
    </div>
</template>
<script>
import Foot from '@/components/Foot'
export default {
    data(){
        return{


        }
    },
    computed: {
        personIndex: function(){
            return this.$route.path.replace('/', '');
		},
    },
    methods:{
		handleNav(key, keyPath) {//点击切换导航
			// console.log(key, keyPath);
        },
    },
    components:{
		Foot
    }
}
</script>
<style lang="less">
.person_div{
	.container{
		&>h2{
			font-weight: normal;
			font-size: 28px;
		}
		.el-menu{
			border-bottom: 1px solid #3B3B3B!important;
			margin-bottom: 40px;
			.el-menu-item{
				padding-left: 0;
				&:hover,&:focus{
					background-color: transparent!important;
					color: #87D8EA;
				}
			}
			.el-menu-item.is-active{
				color: #87D8EA!important;
			}
		}
	}
}
</style>
