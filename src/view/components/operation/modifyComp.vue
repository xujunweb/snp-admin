<template>
  <div>
    <Modal
      v-model="showEdit.show"
      title="修改最低兼容版本"
      width="500"
      :loading="loading"
      @on-ok="updateConfig"
      @on-cancel="cancel">
      <div class="modal-content">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <FormItem prop="edition">
            <span class="label">最低兼容版本：</span>
            <Input v-model="formInline.edition" placeholder="请输入最低兼容版本" clearable style="width: 200px" />
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
    name: "modifyComp",
    props:{
      xcxData:{
        type:Object,
        default () {return {}}
      }
    },
    data(){
      return{
        formInline:{
          edition:'',
        },
        loading:true,
        ruleInline: {
          action: [
            // { required: true, message: 'Please fill in the password.', trigger: 'blur' },
          ]
        },
      }
    },
    computed:{
      ...mapGetters({
        'showEdit':'getmodifyComp'
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
        if(!this.formInline.edition){
          this.$Message.error('请输入版本')
          this.resetLoading()
          return
        }
        var data = {
          authorizerAppId:this.xcxData.authorizerAppId,
          edition:this.formInline.edition,
        }
        testerBind(data).then((res)=>{
          console.log('最低兼容版本--------',res)
          if(res.data.code === '0'){
            this.$Message.success('操作成功!')
            this.$store.dispatch('updataPopup',{name:'modifyComp',res:false})
          }else {
            this.resetLoading()
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          this.$store.dispatch('updataPopup',{name:'modifyComp',res:false})
          this.$Message.error('操作失败!')
        })
      },
      //关闭弹窗
      cancel(){
        this.$store.dispatch('updataPopup',{name:'modifyComp',res:false})
      },
    },
  }
</script>

<style scoped lang="less">
  .modal-content{
    padding-left: 20px;
    h3{font-weight: normal;color: #999;margin-bottom: 20px;padding-right: 20px;}
    span.label{display: inline-block;float: left;}
  }
</style>
