import Cumdpdnmu from '../components/Cumdpdnmu.vue'
let itemList = [
  {type:1,value:'reviseConfig',label:'修改域名配置'},
  {type:1,value:'submitCode',label:'提交代码'},
  {type:1,value:'submitAudit',label:'提交审核'},
  {type:2,value:'findiAudit',label:'审核结果'},
  {type:2,value:'formalRelease',label:'正式发布'},
  {type:2,value:'formalRelease',label:'获取最新配置'},
  {type:1,value:'modifyComp',label:'修改最低兼容版本'},
  {type:2,value:'openXcx',label:'开启小程序'},
  {type:2,value:'closeXcx',label:'关闭小程序'},

]
export default (that)=>{
  return [
    {type: 'selection', width: 60, align: 'center'},
    {title: 'AppId', width:160, key: 'authorizerAppId'},
    {title: '授权方昵称', key: 'nickName'},
    {title: '小程序的主体名称', key: 'principalName',},
    {title: '所属', key: 'sysName'},
    {title: '审核状态', key: 'auditStatus',
      render:(h, params)=>{
        return h('span',that.auditStatusMap[params.row.auditStatus])
      }
    },
    {title: '体验模板ID', key: 'commitTemplateId'},
    {title: '审核模板ID', key: 'auditTemplateId'},
    {title: '正式模板ID', key: 'releaseTemplateId'},
    {title: '自动提审', key: 'enableAutoAudit',
      render:(h, params)=>{
        return h('span',that.statusMap[params.row.enableAutoAudit])
      }
    },
    {title: '操作', key: 'action',
      width: 150,
      align: 'center',
      render: (h, params) => {
        return h(Cumdpdnmu, {
          props: {item:params.row,itemList:itemList}
        })
      }
    }
  ]
}

