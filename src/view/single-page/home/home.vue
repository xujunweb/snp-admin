<template>
  <div class="userlist">
    <div class="search-div">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="nickName">
          <span class="title">昵称：</span>
          <Input v-model="formInline.nickName" placeholder="请输入昵称" clearable style="width: 200px" />
        </FormItem>
        <FormItem prop="signature">
          <span class="title">介绍：</span>
          <Input v-model="formInline.signature" placeholder="请输入介绍" clearable style="width: 200px" />
        </FormItem>
        <FormItem prop="principalName">
          <span class="title">主体名称：</span>
          <Input v-model="formInline.principalName" placeholder="请输入主体名称" clearable style="width: 200px" />
        </FormItem>
        <FormItem prop="sysName">
          <span class="title">所属：</span>
          <Select v-model="formInline.sysName" style="width:200px">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="auditStatus">
          <span class="title">审核状态：</span>
          <Select v-model="formInline.auditStatus" style="width:200px">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="clientName">
          <span class="title">姓名：</span>
          <Input v-model="formInline.clientName" placeholder="请输入姓名" clearable style="width: 200px" />
        </FormItem>
        <FormItem prop="clientPhone">
          <span class="title">电话：</span>
          <Input v-model="formInline.clientPhone" placeholder="请输入电话" number clearable style="width: 200px" />
        </FormItem>
        <FormItem prop="clientUserId">
          <span class="title">会员ID：</span>
          <Input v-model="formInline.clientUserId" placeholder="请输入会员ID" number clearable style="width: 200px" />
        </FormItem>
        <FormItem prop="clientUserId">
          <span class="title">订单号：</span>
          <Input v-model="formInline.orderNo" placeholder="请输入订单号" number clearable style="width: 200px" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">搜索</Button>
          <Button @click="handleReset('formInline')" style="margin-left: 8px">清除条件</Button>
        </FormItem>
      </Form>
    </div>
    <Table border :columns="columns" :data="tableData" stripe ref="userTable"></Table>
    <div class="page">
      <Page :total="total" show-total show-elevator :page-size="pageSize" :current="thisPage" @on-change="pageSwitch" />
    </div>
    <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
    <reviseConfig :xcxData="xcxInfo" v-if="reviseConfig.show" />
    <submitCode :xcxData="xcxInfo" v-if="submitCode.show" />
    <submitAudit :xcxData="xcxInfo" v-if="submitAudit.show" />
    <expUser :xcxData="xcxInfo" v-if="expUser.show" />
    <modifyComp :xcxData="xcxInfo" v-if="modifyComp.show" />
  </div>
</template>

<script>
  import { getXcxList,getTestQrcode } from '@/api/home'
  import reviseConfig from '../../components/operation/reviseConfig.vue'
  import submitCode from '../../components/operation/submitCode.vue'
  import submitAudit from '../../components/operation/submitAudit.vue'
  import expUser from '../../components/operation/expUser'
  import modifyComp from '../../components/operation/modifyComp.vue'
  import {mapGetters} from 'vuex'
  //表单选项
  import tableData from './tableData'
  export default {
    name: 'home',
    components: {
      reviseConfig,submitCode,submitAudit,expUser,modifyComp
    },
    data () {
      return {
        total:0,
        formInline: {
          nickName:'',
          signature:'',     //账号介绍
          principalName:'',   //主体名称
          sysName:'',       //所属
          auditStatus:'',   //审核状态
          clientName:'',      //用户姓名
          clientPhone:'',         //用户电话
          clientUserId:'',        //用户ID
          orderNo:'',             //订单号
        },
        pageSize: 10,
        thisPage:1,   //当前页
        ruleInline: {
          phone: [
            // { required: true, message: 'Please fill in the password.', trigger: 'blur' },
            // { len: 11, message: '请输入正确的手机号', trigger: 'blur' }
            // { type: 'string', min:11, message: '请输入数字', trigger: 'blur' },
          ]
        },
        statusList:[
          {value:'',label:'全部'},
          {value:'-1',label:'未提审'},
          {value:'0',label:'审核成功'},
          {value:'1',label:'审核失败'},
          {value:'2',label:'审核中'},
        ],
        statusMap:{
          '-1':'未提审',
          '0':'审核成功',
          '1':'审核失败',
          '2':'审核中',
        },
        typeList:[
          {value:'',label:'全部'},
          {value:'md',label:'门店小程序'},
          {value:'wds',label:'专业小程序'},
          {value:'pt',label:'平台小程序'},
          {value:'qy',label:'区域小程序'},
        ],
        columns: tableData(this),
        tableData: [],
        testQrcodeUrl:"",
        access:app.$store.state.user.access
      }
    },
    computed: {
      ...mapGetters({
        'xcxInfo':'getxcxInfo',
        'reviseConfig':'getreviseConfig',
        'submitCode':'getsubmitCode',
        'submitAudit':'getsubmitAudit',
        'expUser':'getexpUser',
        'modifyComp':'getmodifyComp',
      })
    },
    created () {
      if(this.access[0]===0){
        console.log("this.access",this.access);
        this.$router.push({
          name: 'login'
        })
        return;
      }
      // 组件实例化生命周期
      this.getXcxList(1).catch((data)=>{
        this.$Message.error(data.msg)
      })
    },
    methods: {
      /**
       * 请求小程序列表
       * @param {type} p 查询的页码(不传的时候搜索当前分页)
       * */
      getXcxList (p) {
        return new Promise((resolve, reject)=>{
          getXcxList({pageIndex: p||this.thisPage, pageSize: this.pageSize, ...this.formInline}).then(res => {
            console.log('小程序列表----',res)
            if(res.data.code === '0'){
              this.tableData = res.data.data.data
              this.total = res.data.data.allRecord
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
      // 发起搜索
      handleSubmit (name) {
        //表单校验
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.thisPage=1;
            this.getXcxList(this.thisPage).then((res)=>{
              this.$Message.success('操作成功!')
            }).catch(err => {
              this.$Message.error('操作失败!')
            })
          } else {
            this.$Message.error('Fail!')
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      },
      //显示文案
      showText (title,content) {
        this.$Modal.info({
          title: title,
          content: content
        })
      },
      //查看大图
      showImg(title,img,type){
        if(type){
          getTestQrcode(img.authorizerAppId).then(res => {
            console.log('体验版----',res)
            if(res.data.code === '0'){
              this.lookBigimg(title,res.data.data)
            }
          }).catch(err => {
            console.log(err)
          })
        }else {
          this.lookBigimg(title,img)
        }

      },
      //执行查看大图
      lookBigimg(title,img){
        this.$Modal.info({title: title, width:'250', closable:true,
          render:(h,params)=>{
            console.log(params)
            return h('img',{
              attrs:{src:img},
              style:{maxWidth:'200px'}
            })
          }
        })
      },
      // 分页切换
      pageSwitch (page) {
        console.log(page)
        this.thisPage = page
        this.getXcxList(page)
      },
    },
    watch: {
    }
  }
</script>

<style scoped lang="less">
  .userlist{
    padding: 15px;
  }
  .page{
    text-align: right;
    margin-top: 40px;
  }
  .search-div{
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    .ivu-form-item{
      margin-bottom: 10px;margin-right: 10px;
      span.title{
        display: inline-block;width: 65px;text-align: right;
      }
      .ivu-btn-primary{
        margin-left: 65px;
      }
    }
  }
</style>
