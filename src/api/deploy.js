import axios from '@/libs/api.request'
//查询需要部署的小程序列表
export const selectBatDeployData = (data) => {
  return axios.request({
    url: 'getDeployList',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//批量部署小程序
export const deploy = (data) => {
  return axios.request({
    url: 'deploy',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
//部署日志
export const getDeployLog = (data) => {
  return axios.request({
    url: 'getDeployLog',
    data: {...data},
    headers:{},
    method: 'post'
  })
}
