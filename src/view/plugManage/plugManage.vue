<template>
  <div class="plugManage">
    <div class="search-div">
      <Button type="primary" @click="addApplyButton">添加插件</Button>
    </div>
    <div class="table">
        <div class="left">
          <Table border :columns="columns" :data="tableData" stripe ref="tableData"></Table>
        </div>
    </div>
    <pluginDialog v-if="pluginDialog.show" :itemData="itemData" :appId="appId" :pluginAppid="pluginAppid" v-on:refreshPlugList="refreshPlugList"/>
  </div>
</template>

<script>
  import columns from './notDeployData'
  import * as http from '@/api/plug'
  import { Modal,Message,Notice } from 'iview'
  import {mapGetters} from 'vuex'
  import pluginDialog from '../components/operation/pluginDialog.vue'
  export default {
    data(){
      return{
        columns:columns(this),   //表格列表
        appId:'',    //小程序appID
        pluginAppid:'',   //插件appId
        tableData:[],  //插件列表数据
        statusMap:{   //插件审核状态
          '1':'申请中',
          '2':'申请通过',
          '3':'已拒绝',
          '4':'已超时',
        },
        itemData: {title: '添加插件', type : 1 },  //type 1 添加插件  2 更新插件
      }
    },
    components: {
      pluginDialog
    },
    computed: {
      ...mapGetters({
        'pluginDialog':'getpluginDialog',
      })
    },
    created(){
      this.appId = this.$route.params.appid;
      this.getPlugList();
    },
    methods:{
      //插件列表
      getPlugList(){
        return new Promise((resolve, reject)=>{
          http.selectPluginList({appId: this.appId}).then(res => {
            if(res.data.code === '0'){
              this.tableData = res.data.data
              resolve(res.data)
            }else {
              reject(res.data)
            }
          }).catch(err => {
            console.log(err)
            reject(err)
          })
        })
      },

      //点击应用按钮
      addApplyButton(){
        this.itemData = {title: '添加插件', type : 1 }
        let list = {type : 1, value: 'pluginDialog'}
        this.$store.dispatch('executeEvent',{list:list})
      },

      //点击更新按钮
      updateButton(pluginAppid){
        this.pluginAppid = pluginAppid;
        this.itemData = {title: '更新插件', type : 2 }
        let list = {type : 1, value: 'pluginDialog'}
        this.$store.dispatch('executeEvent',{list:list})
      },

      //点击删除按钮
      deleteButton(name,params,item){
        return http[name](params).then((res)=>{
          Modal.remove()
          if(res.data.code==='0' || res.data.code==='ok'){
            this.getPlugList();
          }else {
            this.$Message.error(res.data.msg)
          }
        })
      },

      //刷新列表
      refreshPlugList(data){
        if(data){
          this.getPlugList();
        }
      }
    }
  }
</script>

<style scoped lang="less">
.plugManage{
  padding: 15px 15px 40px 15px;
  .search-div{
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .ivu-form-item{
      margin-bottom: 10px;margin-right: 10px;
      span.title{
        display: inline-block;width: 65px;text-align: right;
      }
    }
  }
  .table{
    display: flex;
    justify-content: space-between;
    .left{width: 100%;}
    .right{width: 48%;}
  }
}
</style>
