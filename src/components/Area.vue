<template>
    <el-select class="selectArea" v-model="form.erea" @change="changeValue" :placeholder="$t('form.select')">
        <el-option v-for="item in areaArr" :key="item.id" :label="item.code" :value="item.code"></el-option>
    </el-select>
    
</template>
<script>
import { areaNumApi } from '@/api/getData'
export default {
    data(){
        return{
            form:{
                email:'',
                area:'',
            },
            areaArr:[],
        }
    },
    created(){
        this.areaFun();
    },
    methods:{
        async areaFun(){
            var that = this;
            var res = await areaNumApi();
            if(res.code == 200){
                that.areaArr = res.data;
            }
        },
        changeValue(value){
            var that = this;
            var type = '';
            var arr = that.areaArr;
            arr.forEach(element => {
               if(value == element.code) {
                   type = element.type;
               }
            });
            var obj = {
                'type':type,
                'code':value
            }
            that.$emit('selectValue',obj);
        }
    }
}
</script>
<style lang="less">

.selectArea{
    .el-input__inner{
        border-radius: 0 4px 4px 0;
        border-left: none!important;
        text-align: right!important;
        &:focus{
            border-color: #3B3B3B!important;
        }
    }
    
}
.el-select-dropdown__item.selected{
    color:#87D8EA!important;
}
</style>