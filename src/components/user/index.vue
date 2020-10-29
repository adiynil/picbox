<template>
	<div>
		<el-dialog :visible.sync="submitDialog">
			<el-form class="form" @keyup.enter.native="onSubmit">
				<el-form-item><el-input placeholder="GitHub Account" v-model="account"></el-input></el-form-item>
			</el-form>
			<span slot="title">请先输入GitHub账号</span>
			<div slot="footer">
				<el-button type="primary" @click="onSubmit">确认</el-button>
			</div>
		</el-dialog>
		<div v-if="cache">
		<el-row>
			<el-col :span="24">
				<el-card shadow="never" :body-style="{ 'font-size':'14px' }">
					<div class="header" slot="header">
						<el-avatar class="avatar" :src="this.userInfo.avatar_url">
							<img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
						</el-avatar>
						<span class="bold">{{this.userInfo.login}}</span>
					</div>
					<span>加入时间：{{this.userInfo.created_at.slice(0,10)}}</span><br />
					<span>主页：<el-link type="primary" :href="this.userInfo.html_url" target="_blank"><i class="el-icon-link"></i>{{this.userInfo.html_url}}</el-link></span>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="10">
			<el-col :span="6" :xs="12">
				<el-card shadow="never">
					<span>仓库</span>
					<span class="span"><el-tag size="mini">{{ this.userInfo.public_repos }}</el-tag></span>
				</el-card>
			</el-col>
			<el-col :span="6" :xs="12">
				<el-card shadow="never">
					<span>星标</span>
					<span class="span"><el-tag size="mini">{{ (this.myStarred.length==30)?"30+":this.myStarred.length }}</el-tag></span>
				</el-card>
			</el-col>
			<el-col :span="6" :xs="12">
				<el-card shadow="never">
					<span>关注</span>
					<span class="span"><el-tag size="mini">{{ this.userInfo.following }}</el-tag></span>
				</el-card>
			</el-col>
			<el-col :span="6" :xs="12">
				<el-card shadow="never">
					<span>粉丝</span>
					<span class="span">
						<el-tag size="mini">{{ this.userInfo.followers }}</el-tag>
					</span>
				</el-card>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-tabs v-model="activeTab" type="card">
				    <el-tab-pane name="repos">
						<span slot="label"><i class="el-icon-folder-opened"></i> 我的仓库</span>
						
						<div>
							<el-row :gutter="10" v-loading="loading">
								<el-col v-for="(repo, index) in currentList" :key="index" :span="6" :xs="12" :sm="8" :md="6">
									<el-card shadow="never">
										<span><el-link type="primary" @click="goRouter(repo.name)"><i class="el-icon-folder"></i> {{repo.name}}</el-link></span>
									</el-card>
								</el-col>
							</el-row>
						</div>
						<div>
							<el-pagination
								background=""
								@current-change="handleCurrentChange"
								layout="total, prev, pager, next"
								:total="myRepos.length"
								:page-size="pageSize"
								:hide-on-single-page="hideOnSinglePage"
							></el-pagination>
						</div>
					</el-tab-pane>
					<el-tab-pane label="我的星标" name="starred" disabled></el-tab-pane>
				    <el-tab-pane label="我的关注" name="following" disabled></el-tab-pane>
				    <el-tab-pane label="我的粉丝" name="followers" disabled></el-tab-pane>
				</el-tabs>
			</el-col>
		</el-row>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			cache: false,
			submitDialog: false,
			account: '',
			userInfo: '',
			activeTab: 'repos',
			myRepos: [],
			myStarred: [],
			hideOnSinglePage: true,
			currentPage: 1,
			pageSize: 20,
			loading: true
		};
	},
	methods: {
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
		},
		goRouter(e){
			this.$router.push("/commits?repo="+e)
		},
		async onSubmit() {
			if (this.account == '' || this.account == null) {
				this.$message.error('请正确输入用户名');
			} else {
				const res = await this.$axios
					.get('https://api.github.com/users/' + this.account)
					.catch(e => {console.log(e)});
				localStorage.setItem('account', res.data.name);
				localStorage.setItem('userInfo', JSON.stringify(res.data));
				this.init()
				this.submitDialog = false
				this.cache = true
			}
		},
		async init(){
				const res = await this.$axios
					.get('https://api.github.com/users/' + localStorage.account)
					.catch(e => {console.log(e)});
				localStorage.setItem('userInfo', JSON.stringify(res.data));
				this.userInfo = JSON.parse(localStorage.userInfo);
				// 获取starred仓库
				const res1 = await this.$axios
				  .get(`https://api.github.com/users/${this.userInfo.name}/starred`)
				  .catch(e => { // 请求失败处理
						console.log(e);
				  });
				// 获取仓库
				const res2 = await this.$axios
				  .get(`https://api.github.com/users/${this.userInfo.name}/repos?per_page=${this.userInfo.public_repos}`)
				  .catch(e => { // 请求失败处理
						console.log(e);
				  });
				this.myStarred = res1.data
				setTimeout(() => {
					this.loading = false;
				}, 800);
				this.myRepos = res2.data
		}
	},
	computed: {
		currentList() {
			return this.myRepos.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
		}
	},
	created() {
		this.$emit('menuUpdate', 'user');
		if(localStorage.account){
			this.cache = true
			this.init();
		} else {
			this.submitDialog = true
		}
	}
};
</script>

<style scoped>
	.avatar{
		width: 40px;
		margin-right: 10px;
		border-radius: 50%;
		vertical-align: middle;
	}
	.bold{
		font-weight: bold;
	}
	.el-row+.el-row{
		margin-top: 10px;
	}
	.el-col{
		margin-bottom: 10px;
	}
	.span{
		float: right;
	}
</style>
