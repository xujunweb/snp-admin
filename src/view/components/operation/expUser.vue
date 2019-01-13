<template>
  <div>
    <Modal
      v-model="showEdit.show"
      title="体验用户"
      width="500"
      :loading="loading"
      @on-ok="updateConfig"
      @on-cancel="cancel">
      <div class="modal-content">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <FormItem prop="sysName">
            <span class="label">操作：</span>
            <Select v-model="formInline.action" style="width:200px">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="weix">
            <span class="label">微信ID：</span>
            <Input v-model="formInline.wechatNumber" placeholder="请输入微信昵称" clearable style="width: 200px" />
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {testerBind} from '@/api/home'
export default {
  name: "expUser",
  props:{
    xcxData:{
      type:Object,
      default () {return {}}
    }
  },
  data(){
    return{
      formInline:{
        action:'',
        wechatNumber:'',
      },
      loading:true,
      ruleInline: {
        action: [
          // { required: true, message: 'Please fill in the password.', trigger: 'blur' },
        ]
      },
      typeList:[
        {value:'bind',label:'绑定'},
        {value:'unbind',label:'解除'},
      ],
    }
  },
  computed:{
    ...mapGetters({
      'showEdit':'getexpUser'
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
    updateConfig(){
      if(!this.formInline.action){
        this.$Message.error('请选择操作')
        this.resetLoading()
        return
      }
      var data = {
        action:this.formInline.action,
        authorizerAppId:this.xcxData.authorizerAppId,
        wechatNumber:this.formInline.wechatNumber,
      }
      testerBind(data).then((res)=>{
        console.log('体验用户结果--------',res)
        if(res.data.code === '0'){
          this.$Message.success('操作成功!')
          this.$store.dispatch('updataPopup',{name:'expUser',res:false})
        }else {
          this.resetLoading()
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        this.$store.dispatch('updataPopup',{name:'expUser',res:false})
        this.$Message.error('操作失败!')
      })
    },
    //关闭弹窗
    cancel(){
      this.$store.dispatch('updataPopup',{name:'expUser',res:false})
    },
  },
}
</script>

<style scoped lang="less">
  .modal-content{
    padding-left: 20px;
    h3{font-weight: normal;color: #999;margin-bottom: 20px;padding-right: 20px;}
    span.label{display: inline-block;width: 65px;float: left;}
  }
</style>
