import axios from '@/libs/api.request'
//获取草搞箱模板
export const getDraftTemplateList = (data) => {
  return axios.request({
    url: 'template/getDraftTemplateList',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//获取腾讯正式模板
export const getWeixinTemplateList = (data) => {
  return axios.request({
    url: 'template/getWeixinTemplateList',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//获取本地模板
export const getLocalTemplateList = (data) => {
  return axios.request({
    url: 'template/getLocalTemplateList',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//草搞箱模板添加到正式模板
export const addToTemplate = (data) => {
  return axios.request({
    url: 'template/addToTemplate',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//远程模板同步到本地模板
export const syncToLocalTemplate = (data) => {
  return axios.request({
    url: 'template/syncToLocalTemplate',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//删除正式模板
export const deleteTemplate = (data) => {
  return axios.request({
    url: 'template/deleteTemplate',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//删除本地模板
export const deleteLocalTemplate = (data) => {
  return axios.request({
    url: 'template/deleteLocalTemplate',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//设置默认模板
export const setDefault = (data) => {
  return axios.request({
    url: 'template/setDefault',
    data: {...data},
    headers:{},
    method: 'post'
  })
}

