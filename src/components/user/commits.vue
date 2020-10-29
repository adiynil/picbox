<template>
	<div>
		<el-row class="main middle">
			<el-col>
				<!-- <p>你的账号：{{ name }}</p>
				<p>创建时间：{{ c_time }}</p> -->
				<el-page-header @back="goBack" content="提交记录">
					<div slot="content">
						<el-tag size="medium" effect="dark">{{ repo }}</el-tag> 的提交记录
					</div>
				</el-page-header>
			</el-col>
		</el-row>
		<el-row v-if="show_commits" v-loading="loading">
			<el-col>
				<div>
					<el-timeline>
						<el-timeline-item
							type="primary"
							placement="top"
							v-for="(commit, index) in currentList"
							:key="index"
							:timestamp="commit.commit.committer.date.replace(/T|Z/g, ' ').slice(0, 16)"
						>
							<el-card shadow="hover">{{ commit.commit.message }}</el-card>
						</el-timeline-item>
					</el-timeline>
				</div>
				<div>
					<el-pagination
						background=""
						@current-change="handleCurrentChange"
						layout="total, prev, pager, next"
						:total="commitsList.length"
						:page-size="pageSize"
						:hide-on-single-page="hideOnSinglePage"
					></el-pagination>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
	data() {
		return {
			name: localStorage.account,
			c_time: localStorage.c_time,
			repo: '',
			show_commits: false,
			hideOnSinglePage: true,
			commitsList: [],
			currentPage: 1,
			pageSize: 10,
			loading: true
		};
	},
	methods: {
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
		},
		goBack() {
			window.history.back();
		},
		 async init(){
			if (this.$route.query.repo != null && this.$route.query.repo != '') {
				this.repo = this.$route.query.repo;
				const res = await this.$axios.get(this.getUrl).catch(e => {
					console.log(e);
				});
				this.show_commits = true;
				setTimeout(() => {
					this.loading = false;
				}, 1500);
				this.commitsList = res.data;
			} else {
				this.goBack()
			}
		}
	},
	computed: {
		currentList() {
			return this.commitsList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
		},
		getUrl() {
			return 'https://api.github.com/repos/' + this.name + '/' + this.repo + '/commits?per_page=';
		}
	},
	created() {
		this.init();
		this.$emit('menuUpdate', 'commits');
	}
};
</script>

<style></style>
