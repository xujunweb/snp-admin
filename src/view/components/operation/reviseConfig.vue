<template>
  <div>
  <Modal
    v-model="showEdit.show"
    title="修改域名配置"
    width="806"
    :loading="loading"
    @on-ok="updateConfig"
    @on-cancel="cancel">
    <div class="modal-content">
      <h3>服务器域名需经过ICP备案，新备案域名需24小时后才可配置。域名格式只支持英文大小写字母、数字及“- ”，不支持IP地址</h3>
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="sysName">
          <span>操作：</span>
          <Select v-model="formInline.action" style="width:100px">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="inputMole">
        <div class="left">request合法域名</div>
        <div class="right">
          <div class="input-item" v-for="(item,index) in requestDomainList">
            <Input placeholder="请以https://开头" v-model="requestDomainList[index]" />
            <Icon type="ios-add-circle-outline" size="24" v-if="index===0" color="#333" @click="addDomain('requestDomainList')" />
            <Icon type="ios-close-circle-outline" size="24" v-else color="#333" @click="removeDomain('requestDomainList',index)" />
          </div>
        </div>
      </div>
      <div class="inputMole">
        <div class="left">socket合法域名</div>
        <div class="right">
          <div class="input-item" v-for="(item,index) in wsRequestDomainList">
            <Input placeholder="请以wss://开头" v-model="wsRequestDomainList[index]" />
            <Icon type="ios-add-circle-outline" size="24" v-if="index===0" color="#333" @click="addDomain('wsRequestDomainList')" />
            <Icon type="ios-close-circle-outline" size="24" v-else color="#333" @click="removeDomain('wsRequestDomainList',index)" />
          </div>
        </div>
      </div>
      <div class="inputMole">
        <div class="left">uploadFile合法域名</div>
        <div class="right">
          <div class="input-item" v-for="(item,index) in uploadDomainList">
            <Input placeholder="请以https://开头" v-model="uploadDomainList[index]" />
            <Icon type="ios-add-circle-outline" size="24" v-if="index===0" color="#333" @click="addDomain('uploadDomainList')" />
            <Icon type="ios-close-circle-outline" size="24" v-else color="#333" @click="removeDomain('uploadDomainList',index)" />
          </div>
        </div>
      </div>
      <div class="inputMole">
        <div class="left">downloadFile合法域名</div>
        <div class="right">
          <div class="input-item" v-for="(item,index) in downloadDomainList">
            <Input placeholder="请以https://开头" v-model="downloadDomainList[index]" />
            <Icon type="ios-add-circle-outline" size="24" v-if="index===0" color="#333" @click="addDomain('downloadDomainList')" />
            <Icon type="ios-close-circle-outline" size="24" v-else color="#333" @click="removeDomain('downloadDomainList',index)" />
          </div>
        </div>
      </div>
    </div>
  </Modal>
  </div>
</template>

<script>
import {updateConfig,getDNameConfig} from '@/api/home'
import {mapGetters} from 'vuex'
import Icons from "../../../components/icons/icons";
export default {
  name: "reviseConfig",
  components: {Icons},
  props:{
    xcxData:{
      type:Object,
      default () {return {}}
    }
  },
  data(){
    return{
      // showModal:this.showEdit,
      requestDomainList:[],
      wsRequestDomainList:[],
      uploadDomainList:[],
      downloadDomainList:[],
      formInline:{
        action:''
      },
      ruleInline: {
        action: [
          // { required: true, message: 'Please fill in the password.', trigger: 'blur' },
        ]
      },
      typeList:[
        {value:'set',label:'覆盖'},
        {value:'add',label:'添加'},
        {value:'delete',label:'删除'},
      ],
      loading:true,
    }
  },
  computed:{
    ...mapGetters({
      'showEdit':'getreviseConfig'
    })
  },
  created(){
    this.xcxData.authorizerAppId&&this.getDNameConfig(this.xcxData.authorizerAppId)
    this.$Message.config({
      top: 300,
      duration: 2
    })
  },
  methods:{
    //请求域名配置
    getDNameConfig(data){
      getDNameConfig(data).then((res)=>{
        console.log('域名信息--------',res)
        if(res.data.code === '0'){
          this.requestDomainList = res.data.data.requestDomainList
          this.wsRequestDomainList = res.data.data.wsRequestDomainList
          this.uploadDomainList = res.data.data.uploadDomainList
          this.downloadDomainList = res.data.data.downloadDomainList
        }
      }).catch(err => {
        this.$Message.error('失败!')
      })
    },
    //修改域名配置
    updateConfig(){
      if(!this.formInline.action){
        this.$Message.error('请选择操作')
        setTimeout(() => {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }, 1000)
        return
      }
      var data = {
        action:this.formInline.action,
        authorizerAppId:this.xcxData.authorizerAppId,
        downloadFile:this.downloadDomainList,
        request:this.requestDomainList,
        upload:this.uploadDomainList,
        wsrequest:this.wsRequestDomainList
      }
      updateConfig(data).then((res)=>{
        console.log('编辑域名信息--------',res)
        if(res.data.code === '0'){
          this.$Message.success('操作成功!')
          this.$store.dispatch('updataPopup',{name:'reviseConfig',res:false})
        }
      }).catch(err => {
        this.$store.dispatch('updataPopup',{name:'reviseConfig',res:false})
        this.$Message.error('操作失败!')
      })
    },
    //添加域名配置
    addDomain(name){
      this[name].push('')
    },
    //删除一项域名配置
    removeDomain(name,index){
      this[name].splice(index,1)
    },
    //关闭弹窗
    cancel(){
      console.log('关闭了')
      this.$store.dispatch('updataPopup',{name:'reviseConfig',res:false})
    },
  }
}
</script>

<style scoped lang="less">
  .modal-content{
    height: 400px;overflow-y: auto;padding-left: 20px;
    h3{font-weight: normal;color: #999;margin-bottom: 20px;padding-right: 20px;}
    .inputMole{width: 750px;display: flex;margin-bottom: 10px;
      .left{width: 165px;color: #999;font-size: 14px;line-height: 32px;}
      .right{
        .input-item{margin-bottom: 15px;
          .ivu-input-wrapper{width: 515px}
          .ivu-icon{cursor: pointer;margin-left: 10px;}
        }
      }
    }
  }
  /*滚动条样式*/
  .modal-content::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .modal-content::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .modal-content::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
</style>
