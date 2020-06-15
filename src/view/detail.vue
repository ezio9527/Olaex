<template>
    <div class="detail_div">
        <div class="container">
            <h2>{{title}}</h2>
           <div class="content" v-html="content"></div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            title:'',
            content:'',
        }
    },
    created(){
        var that = this;
        var getContent = JSON.parse(sessionStorage.getItem('detailTxt'));
        that.title = getContent.title;
        that.content = getContent.content;
    }
}
</script>
<style lang="less">
.detail_div{
    .content{
        border-top: 1px solid #3B3B3B;
        color: #C3C3C3;
        padding: 20px 0;
        line-height: 30px;
        img{
            max-width: 100%;
        }
    }
}

</style>