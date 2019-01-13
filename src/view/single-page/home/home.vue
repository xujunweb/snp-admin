<template>
  <div class="userlist">
    <div class="search-div">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="nickName">
          <span class="title">昵称：</span>
          <Input v-model="formInline.nickName" placeholder="请输入昵称" clearable style="width: 200px" />
        </FormItem>
        <FormItem prop="status">
          <span class="title">审核状态：</span>
          <Select v-model="formInline.status" style="width:200px">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="type">
          <span class="title">文章类型：</span>
          <Select v-model="formInline.article_type" style="width:200px">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">搜索</Button>
          <Button @click="handleReset('formInline')" style="margin-left: 8px">清除条件</Button>
        </FormItem>
      </Form>
    </div>
    <Table border :columns="columns" :data="tableData" stripe ref="userTable" @on-selection-change="seletcOpiton"></Table>
    <div class="page">
      <Page :total="total" show-total show-elevator :page-size="pageSize" :current="thisPage" @on-change="pageSwitch" />
    </div>
    <Modal v-model="showEdit"
           title="编辑审核结果"
           width="300"
           :loading="loading"
           @on-ok="syncToLocalTemplate">
      <div class="modal-content">
        <Form ref="statusLine" :model="statusLine" :rules="ruleInline">
          <FormItem prop="sysName">
            <span class="label">编辑状态：</span>
            <Select v-model="statusLine.status" style="width:200px">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getXcxList,updateArticle } from '@/api/home'
  import {mapGetters} from 'vuex'
  //表单选项
  import tableData from './tableData'
  export default {
    name: 'home',
    components: {
    },
    data () {
      return {
        total:0,
        formInline: {
          status:'0',  //审核状态
          article_type:'',     //文章类型
          title:'',   //文章标题
          category:'',       //文章分类
        },
        statusLine:{
          status:'',  //审核状态
        },
        pageSize: 10,
        thisPage:1,   //当前页
        ruleInline: {
          title: [
          ]
        },
        statusList:[
          {value:'0',label:'待审核'},
          {value:'1',label:'审核通过'},
          {value:'2',label:'审核不通过'},
        ],
        statusMap:{
          '0':'待审核',
          '1':'审核通过',
          '2':'审核不通过',
        },
        typeList:[
          {value:'',label:'全部'},
          {value:'0',label:'资讯'},
          {value:'1',label:'视频'},
          {value:'2',label:'朋友圈'},
          {value:'3',label:'解答'},
        ],
        columns: tableData(this),
        tableData: [],
        access:app.$store.state.user.access,
        loading:false,
        showEdit:false,
      }
    },
    computed: {

    },
    created () {
      // if(this.access[0]===0){
      //   console.log("this.access",this.access);
      //   this.$router.push({
      //     name: 'login'
      //   })
      //   return;
      // }
      // 组件实例化生命周期
      this.getXcxList(1).catch((data)=>{
        this.$Message.error(data.msg)
      })
    },
    methods: {
      //选择选项
      seletcOpiton(e){
        this.appIds = e.map((item)=>{
          return item.authorizerAppId
        })
      },
      /**
       * 请求文章列表
       * @param {type} p 查询的页码(不传的时候搜索当前分页)
       * */
      getXcxList (p) {
        return new Promise((resolve, reject)=>{
          getXcxList({pageNum: p||this.thisPage, pageSize: this.pageSize, ...this.formInline}).then(res => {
            console.log('文章列表----',res)
            if(res.data.code === 100){
              this.tableData = res.data.data.list
              this.total = res.data.data.total
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
      /**
       * 修改审核状态
       * @itemData {obj}  一键时需要的模板信息
       * @type  {num} 一键时需要的同步类型
       */
      syncToLocalTemplate(itemData,type){
        var postData = null
        if(itemData){
          postData = {...itemData}
        }else {
          postData = {...this.itemData}
        }
        if(!this.formInline.type){
          this.$Message.error('请选择类型')
          setTimeout(() => {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }, 1000)
          return
        }
        var data = {
          "id": postData.id,
          "status": this.statusLine.status,
        }
        return updateArticle(data).then((res)=>{
          if(res.data.code === 100){
            this.showEdit = false
            this.getXcxList().then((res)=>{
              this.$Message.success('操作成功!')
            }).catch(err => {
              this.$Message.error('操作失败!')
            })
          }else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      //查看详情
      goDetial(id){
        app.$router.push({
          name: 'plugManage_page',
          params: { id:id}})
      },
      //重置搜索
      handleReset (name) {
        this.$refs[name].resetFields()
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
