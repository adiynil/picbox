import Vue from 'vue'
import VueRouter from 'vue-router'

import home from '../components/index/home.vue'
import user from '../components/user/index.vue'
import commits from '../components/user/commits.vue'
import imghost from '../components/user/imghost.vue'
Vue.use(VueRouter)

// 捕获重复路由的报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
    {
		path: '/',
		name: 'home',
		component: home,
		meta:{
			title: '首页 - PicBox'
		}
	},
	{
		path: '/user',
		name: 'user',
		component: user,
		meta:{
			title: '基本信息 - PicBox'
		}
	},
	{
		path: '/commits',
		name: 'commits',
		component: commits,
		meta:{
			title: '提交记录 - PicBox'
		}
	},
	{
		path: '/imghost',
		name: 'imghost',
		component: imghost,
		meta:{
			title: '图床 - PicBox'
		}
	}
  ]

var router = new VueRouter({
	routes
})

// 每次路由的时候把页面的标题也一起修改
router.beforeEach((to, from, next) => {
	if(to.meta.title) {
		document.title = to.meta.title
	}
	next()
})

export default router;

