import axios from '@/libs/api.request'
//查询插件列表
export const selectPluginList = (data) => {
  return axios.request({
    url: 'plugin/pluginList',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//应用插件
export const applyPlugin = (data) => {
  return axios.request({
    url: 'plugin/applyPlugin',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//更新插件
export const updatePlugin = (data) => {
  return axios.request({
    url: 'plugin/updatePlugin',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//删除插件
export const deletePlugin = (data) => {
  return axios.request({
    url: 'plugin/deletePlugin',
    data: { ...data },
    headers: {},
    method: 'post'
  })
}
