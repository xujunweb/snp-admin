/**
 * Created by 132 on 2017/11/9.
 */
import DateUtil from './DateUtil'
// 工单类型
let isDefault = {
  1: '默认',
  2:"",
}
let filters = {
  date (value) {
    let newvalue = DateUtil.dateToStr(false, DateUtil.longToDate(value))
    return newvalue
  },
  isDefault (value) {
    let newvalue = isDefault[+value]
    return newvalue
  },
  formatMoney (money) {
    if (money == 0) return '0'
    money = money/100
    money = (+money)
    //money = money.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,');
    return money.toString()
  },
  formatTwo (money) {
    if (!money) return '0.00'
    money = (+money).toFixed(2)
    return money
  }
}
export default {
  install (Vue) {
    for (let i in filters) {
      Vue.filter(i, filters[i])
    }
  },
  filters:filters
}
