import axios from '@/libs/api.request'
import { getToken } from '@/libs/util'
//获取首页数据
export const getXcxList = (data) => {
  return axios.request({
    url: 'article/pageByArticle',
    data: {state:'0',...data,login_user_id:getToken()},
    headers:{},
    method: 'post'
  })
}

//请求文章信息
export const getByArticleId = (data) => {
  return axios.request({
    url: 'article/getByArticleId',
    data: {state:'0',...data,login_user_id:getToken()},
    headers:{},
    method: 'post'
  })
}
//修改文章状态
export const updateArticle = (data) => {
  return axios.request({
    url: 'article/update',
    data: {...data,update_author:getToken()},
    headers:{},
    method: 'post'
  })
}
//查询机构列表
export const pageByInstitute = (data) => {
  return axios.request({
    url: 'institute/pageByInstitute',
    data: {state:'0',...data},
    headers:{},
    method: 'post'
  })
}
//修改机构信息
export const updateInstitute = (data) => {
  return axios.request({
    url: 'institute/update',
    data: {...data,update_author:getToken()},
    headers:{},
    method: 'post'
  })
}
