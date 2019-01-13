import axios from '@/libs/api.request'
//获取首页数据
export const getXcxList = (data) => {
  return axios.request({
    url: 'authList',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//请求体验版二维码
export const getTestQrcode = (data)=>{
  return axios.request({
    url: 'getTestQrcode',
    data: {authorizerAppId:data},
    headers:{},
    method: 'post'
  })
}
//请求域名配置
export const getDNameConfig = (data) => {
  return axios.request({
    url: 'getDomain',
    data: {authorizerAppId:data},
    headers:{},
    method: 'post'
  })
}
//修改域名配置
export const updateConfig = (data) => {
  return axios.request({
    url: 'setDomain',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//请求appjson配置
export const getAppJson = (data) => {
  return axios.request({
    url: 'config/getAppJson',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//保存appjson配置
export const saveAppJson = (data) => {
  return axios.request({
    url: 'config/saveAppJson',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//请求extjson配置
export const getExtJson = (data) => {
  return axios.request({
    url: 'config/getExtJson',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//按类型查询小程序模板
export const getTemplateListByType = (data) => {
  return axios.request({
    url: 'template/getTemplateListByType',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//提交代码
export const commitCode = (data) => {
  return axios.request({
    url: 'codeManager/commit',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//请求小程序页面列表
export const getXcxPages = (data) => {
  return axios.request({
    url: 'codeManager/getXcxPages',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//查询小程序类目
export const getCategory = (data) => {
  return axios.request({
    url: 'getCategory',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//提交审核
export const submitAudit = (data) => {
  return axios.request({
    url: 'codeManager/submitAudit',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//体验用户
export const testerBind = (data) => {
  return axios.request({
    url: 'tester/bind',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//获取最新的审核结果
export const getResult = (data) => {
  return axios.request({
    url: '/codeManager/getAuditStatus',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
export const confirmHttp = {
  //正式发布
  formalRelease (data) {
    return axios.request({
      url: '/codeManager/release',
      data: {...data},
      headers:{},
      method: 'post'
    })
  },
  //开启小程序
  openXcx (data) {
    data.action="open";
    return axios.request({
      url: 'close',
      data: {...data},
      headers: {},
      method: 'post'
    })
  },
  //关闭小程序
  closeXcx (data) {
    data.action = "close";
    return axios.request({
      url: 'close',
      data: {...data},
      headers: {},
      method: 'post'
    })
  },
  //刷新小程序
  refreshInfo (data) {
    return axios.request({
      url: 'refreshAuthorizerInfo',
      data: {...data},
      headers: {},
      method: 'post'
    })
  },
}
