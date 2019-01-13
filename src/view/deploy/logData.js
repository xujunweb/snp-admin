import DateUtil from '@/libs/DateUtil'
export default (that)=>{
  return [
    {title: 'ID', key: 'id'},
    {title: '部署ID', key: 'deployId',width: 200,},
    {title: 'appId', key: 'appId',width: 60,},
    {title: '小程序名字', key: 'appName',},
    {title: '部署时间', key: 'deployTime',width:100,
      render:(h, params)=>{
        return h('div',DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss',new Date(params.row.deployTime)))
      }
    },
    {title: '部署状态', key: 'deployStatus',
      render:(h, params)=>{
        return h('span',that.deployStatusMap[params.row.deployStatus])
    }},
    {title: '部署类型', key: 'deployType',
      render:(h, params)=>{
        return h('span',that.deployTypeMap[params.row.deployType])
    }},
    {title: '信息', key: 'deployInfo'},
  ]
}

