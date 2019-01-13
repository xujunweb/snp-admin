<template>
  <Dropdown @on-click="triggerOp" trigger="click">
    <Button type="primary">
      编辑
      <Icon type="ios-arrow-down"></Icon>
    </Button>
    <DropdownMenu slot="list">
      <DropdownItem :name="JSON.stringify(list)" v-for="list in itemList">{{list.label}}</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
export default {
  name: "Cumdpdnmu",
  props:{
    //选中的项
    item:{
      type:Object,
      default () {
        return {}
      }
    },
    itemList:{
      type:Array,
      default(){
        /**
         * type {number} 在store中执行的事件类型，1为编辑类，2为询问执行类，3为展示类
         * value  {string}  事件名称
         * label  {string}  按钮名称
         * */
        return [{type:1,value:'reviseConfig',label:'修改域名配置'}]
      }
    }
  },
  data(){
    return{}
  },
  methods:{
    //触发操作事件
    triggerOp(eventName){
      var list = JSON.parse(eventName)
      this.$store.dispatch('executeEvent',{item:this.item,list:list})
    }
  }
}
</script>

<style scoped>

</style>
