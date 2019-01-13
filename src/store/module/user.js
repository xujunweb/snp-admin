import { login, logout, getUserInfo } from '@/api/user'
import { setToken, getToken,setCookies,getCookies } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: JSON.parse(getCookies('access3rd'))||[]
  },
  getters: {
    getUserLoginInfo (state) {
      return state.userId
    }
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access[0] = access
      setCookies('access3rd',state.access)
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {username, password}) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          const data = res.data
          setCookies('userInfo',data.data)
          commit('setToken', data.data.id)
          commit('setAccess', +data.data.type)
          commit('setUserName', data.data.username)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', null)
        setCookies('userInfo',null)
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          const data = res.data
          commit('setAvator', data.data.avator)
          commit('setUserName', data.data.username)
          commit('setUserId', data.data.id)
          // commit('setAccess', data.type)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
