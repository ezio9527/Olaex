import { baseUrl } from './env'
import Vue from 'vue'
import { userInformApi } from '@/api/getData'
// 用户信息

export default function userInform(back){
    Vue.nextTick(async ()=>{
        var res = await userInformApi();
        if(res.code == 200){
            back(res.data)
        }
    })
    
}