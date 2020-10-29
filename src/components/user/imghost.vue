<template>
	<div>
		<div class="steps" v-if="showSteps">
			<el-steps :active="activeStep" finish-status="success" simple="">
				<el-step icon="el-icon-user" title="认证" description="选择你的认证方式"></el-step>
				<el-step icon="el-icon-setting" title="配置" description="选择仓库/上传配置"></el-step>
				<el-step icon="el-icon-circle-check" title="完成" description="开始上传"></el-step>
			</el-steps>
		</div>
		<el-row v-if="showAuth">
			<el-col>
				<div class="step">
					<el-row type="flex" justify="center">
						<el-col :span="10" :xs="24">
							<el-alert type="info">
								<div slot="title">
									认证方式可选
									<strong>token认证</strong>
									/
									<strong>账号密码认证</strong>
									两种方式，推荐使用
									<strong>token认证</strong>
									。
								</div>
							</el-alert>
						</el-col>
					</el-row>
					<el-row type="flex" justify="center">
						<el-col :span="10" :xs="24">
							<el-radio-group v-model="authMode">
								<el-badge value="推荐">
									<el-radio-button label="account">账号密码</el-radio-button>
									<el-radio-button label="token">Token</el-radio-button>
								</el-badge>
							</el-radio-group>
						</el-col>
					</el-row>
					<el-row type="flex" justify="center">
						<el-col :span="10" :xs="24">
							<el-form v-if="authMode == 'token'">
								<el-form-item><el-input v-model="form.account" placeholder="Account"></el-input></el-form-item>
								<el-form-item><el-input v-model="form.token" placeholder="GitHub token"></el-input></el-form-item>
								<el-form-item>
									<el-button type="success" @click="testAuth">下一步</el-button>
									<el-button @click="reset">重置</el-button>
								</el-form-item>
							</el-form>
							<el-form v-if="authMode == 'account'">
								<el-form-item>
									<el-alert type="warning" :closable="false">
										<div slot="title">
											GitHub API将在
											<strong>2020年11月13日</strong>
											正式停止对使用账号密码认证的支持。
											<el-link type="primary" href="https://developer.github.com/changes/2020-02-14-deprecating-password-auth/" target="_blank">
												<!-- <i class="el-icon-link"></i> -->
												官方通知直达
											</el-link>
										</div>
									</el-alert>
								</el-form-item>

								<el-form-item><el-input v-model="form.account" placeholder="Account"></el-input></el-form-item>
								<el-form-item><el-input v-model="form.password" type="password" placeholder="Password"></el-input></el-form-item>
								<el-form-item>
									<el-button type="success" @click="testAuth">下一步</el-button>
									<el-button @click="reset">重置</el-button>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>
		<el-row v-if="showConfig">
			<el-col>
				<div class="step">
					<el-row type="flex" justify="center">
						<el-col :span="10" :xs="24">
							<el-alert type="info">
								<div slot="title">
									选择作为图床的仓库和相关配置，如果你使用
									<strong>token认证</strong>
									请确保输入的
									<strong>token</strong>
									有图床仓库的权限。
								</div>
							</el-alert>
						</el-col>
					</el-row>
					<el-row type="flex" justify="center">
						<el-col :span="10" :xs="24">
							<el-form>
								<el-form-item><el-input v-model="form.account" placeholder="Account" disabled></el-input></el-form-item>
								<el-form-item>
									<el-select v-model="selectedRepo" placeholder="请选择仓库" filterable>
										<el-option v-for="(repo, index) in repoList" :key="index" :label="repo.name" :value="repo.name"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-select v-model="selectedDir" :disabled="!ableToSelectDir" placeholder="请选择目录" filterable>
										<el-option key="0" label="根目录" value=""></el-option>
										<el-option v-for="(dir, index) in repoDirs" :key="index + 1" :label="dir.name" :value="dir.path"></el-option>
									</el-select>
								</el-form-item>
								<el-alert type="info" :closable="false"><div slot="title">目前最高仅支持选择二级目录。</div></el-alert>
								<el-form-item>
									<el-checkbox v-model="hashRename">随机哈希重命名图片</el-checkbox>
									<el-checkbox v-model="compressSize">压缩图片来减小大小</el-checkbox>
								</el-form-item>
								<el-form-item>
									<el-button @click="prev">上一步</el-button>
									<el-button type="success" @click="finishConfig">下一步</el-button>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>
		<el-row v-if="showFinish">
			<el-col>
				<div class="step">
					<el-row type="flex" justify="center">
						<el-col :span="10" :xs="24">
							<el-alert type="info"><div slot="title">本项目纯前端开发、没有后台且开源，请放心使用。</div></el-alert>
						</el-col>
					</el-row>
					<el-row type="flex" justify="center">
						<el-col :span="10" :xs="24">
							<el-alert type="success" :closable="false" show-icon><div slot="title">恭喜你，已经完成配置。点击完成即可开始上传图片。</div></el-alert>
						</el-col>
					</el-row>
					<el-row type="flex" justify="center">
						<el-col :span="10" :xs="24">
							<el-button @click="prev">上一步</el-button>
							<el-button type="success" @click="next">完成</el-button>
						</el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>
		<div v-show="!showSteps">
			<el-row>
				<el-col>
					<el-divider content-position="left">
						基本配置
						<i class="el-icon-caret-bottom"></i>
						<el-button type="text" @click="logOut">注销</el-button>
					</el-divider>
				</el-col>
			</el-row>
					<el-form>
						<el-row :gutter="20">
						<el-col :span="6" :xs="12">
							  <el-input v-model="form.account" placeholder="GitHub账号" disabled></el-input>
						</el-col>
						<el-col :span="6" :xs="12">
							  <el-input v-model="token" placeholder="GitHub token" disabled></el-input>
						</el-col>
						</el-row>
						<el-row :gutter="20">
						<el-col :span="6" :xs="12">
							<el-select v-model="selectedRepo" placeholder="请选择仓库" filterable>
								<el-option v-for="(repo, index) in repoList" :key="index" :label="repo.name" :value="repo.name"></el-option>
							</el-select>
						</el-col>
						<el-col :span="6" :xs="12">
							<el-select v-model="selectedDir" :disabled="!ableToSelectDir" placeholder="请选择目录" filterable>
								<el-option key="0" label="根目录" value=""></el-option>
								<el-option v-for="(dir, index) in repoDirs" :key="index + 1" :label="dir.name" :value="dir.path"></el-option>
							</el-select>
						</el-col>
						</el-row>
						<el-row :gutter="20">
						<el-col :span="6" :xs="12">
							<el-checkbox v-model="hashRename">随机哈希重命名图片</el-checkbox>
						</el-col>
						<el-col :span="6" :xs="12">
							<el-checkbox v-model="compressSize">压缩图片来减小大小</el-checkbox>
						</el-col>
						</el-row>
					</el-form>
			
			<el-row>
				<el-col>
					<el-row>
						<el-col>
							<el-divider content-position="left">
								上传图片
								<i class="el-icon-caret-bottom"></i>
							</el-divider>
						</el-col>
					</el-row>
					<div class="upload_field">
						<el-dialog :visible.sync="uploadDialogVisible" title="上传" width="90%">
							<div>
								<el-upload
									ref="upload"
									action="#"
									multiple
									accept=".jpg,.jpeg,.gif,.png"
									list-type="picture-card"
									:on-remove="handleRemove"
									:on-change="onChange"
									:auto-upload="false"
								>
									<div slot="tip" class="el-upload__tip">
										只能上传
										<el-tag size="mini">jp[e]g</el-tag>
										/
										<el-tag size="mini">png</el-tag>
										/
										<el-tag size="mini">gif</el-tag>
										文件。
									</div>
									<i slot="default" class="el-icon-plus"></i>
								</el-upload>
							</div>
							<div slot="footer">
								<el-button @click="closeUploadDialog">关闭</el-button>
								<el-button @click="clearUploadList">重置</el-button>
								<el-button type="primary" @click="submitUpload">开始上传</el-button>
							</div>
						</el-dialog>
						<el-row>
							<el-col :span="6" :xs="24" :sm="12" :md="6">
								<div class="upload_trigger"  @click="openUploadDialog">
									<i class="el-icon-upload"></i>
									<span>点击上传</span>
								</div>
							</el-col>
						</el-row>
						
					</div>
				</el-col>
			</el-row>

			<el-row>
				<el-col>
					<el-row>
						<el-col>
							<el-divider content-position="left">
								图片列表
								<i class="el-icon-caret-bottom"></i>
								<el-button icon="el-icon-refresh" @click="initImgList" type="text"></el-button>
							</el-divider>
						</el-col>
					</el-row>
					<div class="imglist_field">
						<el-dialog :visible.sync="onViewVisible" top="5vh">
							<div slot="title">
								<el-tabs v-model="onViewActive">
								    <el-tab-pane label="直链" name="raw">
										<el-input @focus="copyAsRaw" prefix-icon="el-icon-document-copy" type="text" v-model="onViewRaw" readonly></el-input>
									</el-tab-pane>
								    <el-tab-pane label="MarkDown" name="md">
										<el-input @focus="copyAsMd" prefix-icon="el-icon-document-copy" type="text" v-model="onViewMd" readonly></el-input>
									</el-tab-pane>
								    <el-tab-pane label="HTML" name="html">
										<el-input @focus="copyAsHtml" prefix-icon="el-icon-document-copy" type="text" v-model="onViewHtml" readonly></el-input>
									</el-tab-pane>
								  </el-tabs>
							</div>
							<img width="100%" :src="onViewImgUrl" alt="" />
						</el-dialog>
						<el-dialog :visible.sync="confirmDialogVisible" title="提示" width="30%">
							<span>
								确定要删除
								<strong>{{ confirmDialogMsg.name }}</strong>
								吗？
							</span>
							<span slot="footer" class="dialog-footer">
								<el-button @click="confirmDialogVisible = false">取 消</el-button>
								<el-button type="primary" @click="onDelete(confirmDialogMsg)">确 定</el-button>
							</span>
						</el-dialog>
						<div class="imglist">
							<li v-for="(item, index) in currentList" :key="index" class="item">
								<div class="img">
									<img :src="item.url" />
									<div class="shade">
										<div class="action">
											<span><i @click="onView(item)" class="el-icon-zoom-in"></i></span>
											<span><i @click="onConfirm(item)" class="el-icon-delete"></i></span>
										</div>
									</div>
								</div>
							</li>
						</div>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col>
					<el-pagination
						background=""
						@current-change="handleCurrentChange"
						layout="total, prev, pager, next"
						:total="imgList.length"
						:page-size="pageSize"
						:hide-on-single-page="hideOnSinglePage"
					></el-pagination>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import { Base64 } from '../../assets/js/Base64.js';
let Base = new Base64();
export default {
	data() {
		return {
			// base
			activeStep: 0,
			showSteps: true,
			showAuth: true,
			showConfig: false,
			showFinish: false,
			// upload
			uploadDialogVisible: false,
			// list show
			hideOnSinglePage: true,
			currentPage: 1,
			pageSize: 20,
			loading: true,
			imgList: [],
			onViewVisible: false,
			onViewImgUrl: '',
			onViewRaw: '',
			onViewHtml: '',
			onViewMd: '',
			onViewActive: 'raw',
			confirmDialogVisible: false,
			confirmDialogMsg: '',
			// auth
			authMode: 'token',
			form: {
				token: '',
				account: '',
				password: ''
			},
			token: '',
			// config
			selectedRepo: '',
			repoList: [],
			ableToSelectDir: false,
			selectedDir: '',
			repoDirs: [],
			hashRename: false,
			compressSize: true
		};
	},
	watch: {
		compressSize(newVal, oldVal){
			localStorage.setItem('compressSize',newVal)
		},
		hashRename(newVal, oldVal){
			localStorage.setItem('hashRename',newVal)
		},
		repoDirs(newVal, oldVal){
			localStorage.setItem('repoDirs',JSON.stringify(newVal))
		},
		ableToSelectDir(newVal, oldVal){
			localStorage.setItem('ableToSelectDir',newVal)
		},
		repoList(newVal, oldVal){
			localStorage.setItem('repoList',JSON.stringify(newVal))
		},
		token(newVal, oldVal){
			localStorage.setItem('token',newVal)
		},
		form(newVal, oldVal){
			localStorage.setItem('account',newVal.account)
		},
		authMode(newVal, oldVal){
			localStorage.setItem('authMode',newVal)
		},
		imgList(newVal, oldVal){
			localStorage.setItem('imgList',JSON.stringify(newVal))
		},
		activeStep(newVal, oldVal) {
			if (newVal == 0) {
				this.showAuth = true;
			} else if (newVal == 1) {
				this.showConfig = true;
			} else if (newVal == 2) {
				this.showFinish = true;
			} else if (newVal > 2) {
				this.showSteps = false;
			}
			localStorage.setItem('activeStep',newVal)
		},
		showSteps(newVal, oldVal) {
			if (!newVal) {
				this.showAuth = false;
				this.showConfig = false;
				this.showFinish = false;
			}
			localStorage.setItem('showSteps',newVal)
		},
		showAuth(newVal, oldVal) {
			if (newVal) {
				this.showConfig = false;
				this.showFinish = false;
			}
			localStorage.setItem('showAuth',newVal)
		},
		showConfig(newVal, oldVal) {
			if (newVal) {
				this.showAuth = false;
				this.showFinish = false;
			}
			localStorage.setItem('showConfig',newVal)
		},
		showFinish(newVal, oldVal) {
			if (newVal) {
				this.showConfig = false;
				this.showAuth = false;
			}
			localStorage.setItem('showFinish',newVal)
		},
		selectedRepo(newVal, oldVal) {
			this.initDirs(newVal);
			this.initImgList()
			localStorage.setItem('selectedRepo',newVal)
		},
		selectedDir(newVal, oldVal) {
			this.initImgList();
			localStorage.setItem('selectedDir',newVal)
		},
	},
	methods: {
		// base
		next() {
			if (this.activeStep < 3) this.activeStep++;
		},
		prev() {
			if (this.activeStep > 0) this.activeStep--;
		},
		// list show
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
		},
		getImgLink(filename) {
			return `https://cdn.jsdelivr.net/gh/${this.form.account}/${this.selectedRepo}${this.getSelectedDir}${filename}`;
		},
		copyAsRaw(){
			const textarea = document.createElement('textarea');
			textarea.value = this.onViewRaw;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			this.$message.success("复制成功")
		},
		copyAsMd(){
			const textarea = document.createElement('textarea');
			textarea.value = this.onViewMd;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			this.$message.success("复制成功")
		},
		copyAsHtml(){
			const textarea = document.createElement('textarea');
			textarea.value = this.onViewHtml;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			this.$message.success("复制成功")
		},
		getMarkdownLink(filename) {
			return `![](${this.getImgLink(filename)})`
		},
		getHtml(filename) {
			return `<img src="${this.getImgLink(filename)}" />`
		},
		getImgName(imgname){
			return this.hashRename ? imgname.replace('.', `.${Math.random().toString(36).substr(2)}.`) : imgname
		},
		async compressImg(img){
			let maxWidth = img.width // 限制最大宽度，当前为原宽度
			let quality = 0.8 // 压缩比例
			let canvas = document.createElement('canvas')
			let ctx = canvas.getContext('2d')
			const proportion = img.width / img.height
			const width = maxWidth
			const height = maxWidth / proportion
			canvas.width = width
			canvas.height = height
			ctx.clearRect(0, 0, width, height)
			ctx.drawImage(img, 0, 0, width, height)
			// compress
			const base64data = canvas.toDataURL(img.type, quality)
			canvas = ctx = null
			return base64data
		},
		getRawUrl(img){
			return `https://api.github.com/repos/${this.form.account}/${this.selectedRepo}/contents${this.getSelectedDir}${this.getImgName(img.name)}`
		},
		async upload(img){
			let url = this.getRawUrl(img)
			let token = this.getToken()
			let message = `upload ${img.name} from MixBox`
			let data = {
				message: message
			}
			
			let reader=new FileReader();
			reader.readAsDataURL(img.raw);
			return new Promise(resolve=>{
				reader.onload= async () => {
					var result = reader.result // get base64
					let img = new Image()
					img.src = result
					img.onload = async () => {
						if(this.compressSize){ // whether compress image
							result = await this.compressImg(img) // compress image
						}
						data.content = result.split(',')[1]
						await this.$axios({
							method:'PUT',
							url:url,
							headers: {
								"authorization": token,
								"content-type": "application/json"
							},
							timeout: 0,
							data: data
						}).then(res=>{
							resolve(res.status)
						}).catch(error=>{
							console.log(error)
							resolve(error.response.status)
						})
						
					}
				}
			})
		},
		onView(img) {
			this.onViewImgUrl = img.url;
			this.onViewRaw = this.getImgLink(img.name)
			this.onViewMd = this.getMarkdownLink(img.name)
			this.onViewHtml = this.getHtml(img.name)
			this.onViewVisible = true;
		},
		onConfirm(msg) {
			this.confirmDialogMsg = msg;
			this.confirmDialogVisible = true;
		},
		onDelete(img) {
			// delete
			let url = this.getRawUrl(img)
			let token = this.getToken()
			let data = {
				message: `delete ${img.name} from Mixbox`,
				sha: img.sha
			}
			this.$axios({
				method:'DELETE',
				url:url,
				headers: {
					"authorization": token,
					"content-type": "application/json"
				},
				timeout: 0,
				data: data
			}).then(res => {
				this.$message.success("删除成功，请稍后刷新列表。")
			}).catch(res => {
				this.$message.error("删除失败，也许是网络不通也许是文件已经被删除。")
			})
			this.confirmDialogVisible = false;
			
		},
		// auth
		reset() {
			this.form.account = '';
			this.form.password = '';
			this.form.token = '';
		},
		async testAuth() {
			this.initRepos();
			// test auth by access https://api.github.com/notifications
			// console.log(this.getToken())
			await this.$axios({
				method:"GET",
				url:"https://api.github.com/notifications",
				headers:{
					authorization:this.getToken()
				}
			}).then(res => {
				this.token = this.getToken()
				this.next();
				localStorage.setItem('account',this.form.account)
			}).catch(res => {
				this.$message.error(`验证不通过，请检查你的账号密码或token。`);
			})
		},
		// upload
		openUploadDialog() {
			this.uploadDialogVisible = true;
		},
		closeUploadDialog() {
			this.uploadDialogVisible = false;
		},
		clearUploadList() {
			this.$refs.upload.uploadFiles = [];
		},
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		onChange(file, fileList) {
			var nameList = [];
			fileList.forEach(img => {
				nameList.push(img.name);
			});
			var index = nameList.indexOf(file.name);
			var repeatIndex = nameList.slice(index + 1).indexOf(file.name);
			if (file.raw.type.split(`/`)[0] != 'image') {
				this.$message.warning(`${file.name} is not a image file`);
				fileList.splice(fileList.indexOf(file), 1);
			}
			if (repeatIndex != -1) {
				this.$message.warning(`${file.name} is already exist`);
				fileList.splice(fileList.indexOf(file), 1);
			}
		},
		async submitUpload() {
			const fileList = this.$refs.upload.uploadFiles;
			for (let img of fileList) {
				console.log('begin');
				let status = await (() => {
					return new Promise(async resolve => {
						img.status = 'uploading';
						for (var i = 0; i < 100; i++) {
							setTimeout(() => {
								img.percentage = i;
							}, 50);
						}
						this.upload(img).then(status=>{
							resolve(status)
						})
					});
				})();
				if(status == 201){
					img.status = 'success';
					console.log(`上传 ${img.name} 成功。`)
				}else if(status == 422){
					this.$message.error(`${img.name} 已经存在了，建议切换目录上传或者勾选哈希重命名。`);
					console.log(`${img.name} 已经存在了，建议切换目录上传或者勾选哈希重命名。`)
					img.status = 'fail'
				}else{
					this.$message.error(`上传 ${img.name} 失败，请检查网络状态或者稍后再试。`);
					console.log(`上传 ${img.name} 失败，请检查网络状态或者稍后再试。`)
					img.status = 'fail'
				}
				console.log('end');
			}
			setTimeout(() => {
				this.$refs.upload.uploadFiles = [];
				// this.$message.success(`上传结束，请稍后手动刷新列表。`);
			}, 1000);
			
		},
		// config
		async initRepos() {
			// 获取仓库
			const res = await this.$axios.get(`https://api.github.com/users/${this.form.account}/repos?per_page=`).catch(e => {
				// 请求失败处理
				console.log('抓取仓库列表失败');
			});
			if (res.status == 200) {
				this.repoList = res.data;
			} else {
				this.$message.error('抓取仓库列表失败，请检查网络状态或者稍后再试。');
			}
		},
		async initDirs(repo) {
			// 当selectedRepo改变就会调用重新加载目录
			this.repoDirs = [];
			this.selectedDir = ''
			// get repo's dirs
			await this.$axios.get(`https://api.github.com/repos/${this.form.account}/${repo}/contents`).then(res => {
				if (res.status == 200) {
					res.data.forEach(item => {
						if (item.type == 'dir') {
							this.repoDirs.push(item);
						}
					});
					this.ableToSelectDir = true;
				} else {
					this.$message.error('抓取目录列表失败，请检查网络状态或者稍后再试。');
				}
			})
			.catch(e => {
				// 请求失败处理
				console.log('抓取仓库目录失败');
			});
		},
		async initImgList() {
			this.imgList = [];
			await this.$axios.get(`https://api.github.com/repos/${this.form.account}/${this.selectedRepo}/contents/${this.selectedDir}`).then(res => {
				if (res.status == 200) {
					res.data.forEach(item => {
						var type = item.type;
						var tail = item.name.split('.');
						tail = tail[tail.length - 1];
						var flag = false;
						try {
							['jpg', 'jpeg', 'png', 'gif'].forEach(t => {
								if (tail == t) {
									flag = true;
									throw new Error('break from forEach');
								}
							});
						} catch (e) {}
						if (type == 'file' && flag) {
							let img = { name: '', url: '', sha: '' };
							img.name = item.name;
							img.url = this.getImgLink(item.name);
							img.sha = item.sha;
							this.imgList.push(img);
						}
					});
					console.log(this.imgList);
				} else {
					this.$message.error('抓取列表失败，请检查网络状态或者稍后再试。');
				}
			}).catch(e => {
				// 请求失败处理
				console.log('抓取图片列表失败');
				if(e.response.status == 403){
					this.$message.error("操作频繁，GitHub限制了你的ip地址，请稍后再试。")
				}
			});
			
		},
		finishConfig() {
			// save config
			this.next();
			this.initImgList();
		},
		logOut(){
			localStorage.clear()
			location.reload();
		}
	},
	computed: {
		currentList() {
			return this.imgList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
		},
		getSelectedDir(){
			return (this.selectedDir=='') ? `/` : `/${this.selectedDir}/`
		},
		getToken(){
			return (this.authMode == 'token') ? (()=>{
				return `token ${this.form.token}`
			}) : (()=>{
				return `Basic ${Base.encode(`${this.form.account}:${this.form.password}`)}`
			})
		}
	},
	created() {
		this.$emit('menuUpdate', 'imghost');
	},
	mounted(){
		if(localStorage.activeStep){
			this.activeStep = parseInt(localStorage.activeStep)
		}
		if(localStorage.token){
			this.token = localStorage.token
		}
		if(localStorage.authMode){
			this.authMode = localStorage.authMode
		}
		if(localStorage.compressSize){
			this.compressSize = (localStorage.compressSize == "true")?true:false
		}
		if(localStorage.hashRename){
			this.hashRename = (localStorage.hashRename == "true")?true:false
		}
		if(localStorage.account){
			this.form.account = localStorage.account
		}
		if(localStorage.repoList){
			this.repoList = JSON.parse(localStorage.repoList)
		}
		if(localStorage.selectedRepo){
			this.selectedRepo = localStorage.selectedRepo
		}
		if(localStorage.repoDirs){
			this.repoDirs = JSON.parse(localStorage.repoDirs)
		}
		if(localStorage.selectedDir){
			this.selectedDir = localStorage.selectedDir
		}
		if(localStorage.imgList){
			this.imgList = JSON.parse(localStorage.imgList)
		}
		// this.ableToSelectDir = (localStorage.ableToSelectDir == "true")?true:false
		// this.initRepos()
		// this.initDirs()
		// this.initImgList()
	}
};
</script>

<style scoped>
.steps {
}
.step {
	margin: 10px 0px;
}
.el-row + .el-row {
	margin-top: 20px;
}
.upload_trigger{
	position: relative;
	width: 100%;
	height: 100px;
	border: 1px dashed rgba(64,160,255,0.5);
	border-radius: 4px;
	cursor: pointer;
}
.upload_trigger:hover,
.upload_trigger:active{
	border-color: #409EFF;
}
.upload_trigger:hover i,
.upload_trigger:active i{
	color: #409EFF;
}
.upload_trigger i {
	position: absolute;
	font-size: 70px;
	line-height: 50px;
	color: rgba(64,160,255,0.5);
	top: 15%;
	left: 50%;
	transform: translateX(-50%);
}
.upload_trigger span{
	position: absolute;
	color: #606266;
	font-size: 14px;
	top: 70%;
	left: 50%;
	transform: translateX(-50%);
}
.imglist {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.imglist .item {
	list-style: none;
	width: calc(20% - 0.65rem);
	margin: 0.25rem 0.25rem;
	border: 1px solid #eee;
	text-decoration: none;
	border-radius: 4px;
	overflow: hidden;
	-webkit-transition: 0.3s;
	-moz-transition: 0.3s;
	-ms-transition: 0.3s;
	-o-transition: 0.3s;
	transition: 0.3s;
}
.imglist .img:hover .shade,
.imglist .img:hover .action,
.imglist .img:active .shade,
.imglist .img:active .action {
	opacity: 1;
	display: block;
}
.imglist .img {
	width: 100%;
	height: 120px;
	overflow: hidden;
	position: relative;
}
.imglist .img .action {
	color: #fff;
	font-size: 20px;
	top: 50%;
	left: 50%;
	display: none;
	z-index: 10;
	position: absolute;
	transform: translate3d(-50%, -50%, 0);
}
.imglist .img .action span {
	opacity: 1;
	cursor: pointer;
}
.imglist .img span + span {
	margin-left: 10px;
}
.imglist .img .shade {
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	z-index: 2;
	position: absolute;
	background-color: rgba(0, 0, 0, 0.6);
	-webkit-transition: 0.3s;
	-moz-transition: 0.3s;
	-ms-transition: 0.3s;
	-o-transition: 0.3s;
	transition: 0.3s;
}
.imglist .img img {
	display: inline-block;
	width: 150%;
	height: auto;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate3d(-50%, -50%, 0);
}
.imglist .info p {
	text-align: center;
	font-size: 14px;
	line-height: 0px;
}
@media screen and (max-width: 800px) and (min-width: 600px) {
	.imglist .item {
		width: calc(100% / 4 - 0.65rem);
	}
}
@media screen and (max-width: 600px) and (min-width: 480px) {
	.imglist .item {
		width: calc(100% / 3 - 0.65rem);
	}
}
@media screen and (max-width: 480px) {
	.imglist .item {
		width: calc(100% / 2 - 0.65rem);
	}
}
@media screen and (max-width: 333px) {
	.imglist .item {
		width: calc(100% - 0.65rem);
	}
}
</style>
