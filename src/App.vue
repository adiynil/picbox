<template>
	<div id="app">
		<el-row>
			<el-col :span="24">
				<el-row type="flex" justify="center">
					<el-col :span="18" :xs="24">
						<el-menu
							:default-active="activeIndex"
							mode="horizontal"
							@select="handleSelect"
							background-color=""
							text-color=""
							active-text-color=""
							:router="menuRouter"
						>
							<el-menu-item index="/">
								<template slot="title">
									<i class="el-icon-s-home"></i>
									<span slot="title">起始页</span>
								</template>
							</el-menu-item>
							<el-submenu index="">
								<template slot="title">
									<i class="el-icon-user-solid"></i>
									<span slot="title">我的</span>
								</template>
								<el-menu-item index="user">基本信息</el-menu-item>
								<el-menu-item index="imghost">我的图床</el-menu-item>
							</el-submenu>
							<el-menu-item index="3" disabled>coming...</el-menu-item>
						</el-menu>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<el-row class="main" type="flex" justify="center">
			<el-col :span="18" :xs="22">
				<router-view @menuUpdate="updateMenu"></router-view>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
	name: 'App',
	data() {
		return {
			activeIndex: '/',
			menuRouter: true
		};
	},
	methods: {
		handleSelect(key, keyPath) {
			console.log('导航', key, keyPath);
		},
		updateMenu(e) {
			this.activeIndex = e;
		}
	},
	created: function() {}
};
</script>

<style>
@import 'assets/css/style.css';
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/* color: #2c3e50; */
}
.main {
	margin: 10px 0px;
}
</style>
