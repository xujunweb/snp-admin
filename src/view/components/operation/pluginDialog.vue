<template>
  <div>
    <Modal
      v-model="showEdit.show"
      :title="itemData.title"
      width="500"
      :loading="loading"
      :mask-closable="false"
      @on-ok="updateConfig(itemData.type)"
      @on-cancel="cancel">
      <div class="modal-content">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <FormItem prop="sysName" v-if="itemData.type == 1">
            <span class="label">*插件appID：</span>
            <Input v-model="formInline.pluginAppid" placeholder="请输入插件appID" clearable style="width: 200px" />
          </FormItem>
          <FormItem prop="weix">
            <span class="label"><span v-if="itemData.type == 2">*</span>用户版本：</span>
            <Input v-model="formInline.userVersion" placeholder="请输入用户版本" clearable style="width: 200px" />
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {applyPlugin, updatePlugin} from '@/api/plug'
export default {
  name: "pluginDialog",
  props:{
    itemData:{
      type:Object,
      default () {return {}}
    },
    appId:{
      type:String,
      default () {return {}}
    },
    pluginAppid:{
      type:String,
      default () {return {}}
    }
  },
  data(){
    return{
      formInline:{
        pluginAppid:'',
        userVersion:'',
      },
      loading:true,
      ruleInline: {
        userVersion: [
          // { required: true, message: 'Please fill in the password.', trigger: 'blur' },
        ]
      }
    }
  },
  computed:{
    ...mapGetters({
      'showEdit':'getpluginDialog'
    })
  },
  methods:{
    //重置按钮loading
    resetLoading(){
      setTimeout(() => {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      }, 1000)
    },
    //提交修改
    updateConfig(type){
      if(!this.formInline.pluginAppid && type == 1){
        this.$Message.error('请输入插件appID')
        this.resetLoading()
        return
      }
      if(!this.formInline.userVersion && type == 2){
        this.$Message.error('请输入用户版本')
        this.resetLoading()
        return
      }
      console.log('appId===' + this.appId)
      var data = {
        pluginAppid:this.pluginAppid && this.pluginAppid || this.formInline.pluginAppid,
        appId:this.appId,
        userVersion:this.formInline.userVersion,
      }
      if(type==1){  //添加插件
        applyPlugin(data).then((res)=>{
          console.log('res111--------',res)
          if(res.data.code === '0'){
            this.$Message.success('操作成功!')
            this.$store.dispatch('updataPopup',{name:'pluginDialog',res:false})
            this.$emit("refreshPlugList",true)
          }else {
            this.resetLoading()
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          this.$store.dispatch('updataPopup',{name:'pluginDialog',res:false})
          this.$Message.error('操作失败!')
        })
      }else{   //更新插件
        updatePlugin(data).then((res)=>{
          console.log('res222--------',res)
          if(res.data.code === '0'){
            this.$Message.success('操作成功!')
            this.$store.dispatch('updataPopup',{name:'pluginDialog',res:false})
            this.$emit("refreshPlugList",true)
          }else {
            this.resetLoading()
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          this.$store.dispatch('updataPopup',{name:'pluginDialog',res:false})
          this.$Message.error('操作失败!')
        })
      }

    },
    //关闭弹窗
    cancel(){
      this.$store.dispatch('updataPopup',{name:'pluginDialog',res:false})
    },
  },
}
</script>

<style scoped lang="less">
  .modal-content{
    padding-left: 20px;
    h3{font-weight: normal;color: #999;margin-bottom: 20px;padding-right: 20px;}
    span.label{display: inline-block;width: 90px;float: left;}
  }
</style>
