<template>
  <div>
    <el-form class="form" @keyup.enter.native="onSubmit">
      <h3 class="form_label">输入你的GitHub账号并回车</h3>
      <el-row type="flex" justify="center">
        <el-col :span="12" :xs="24">
          <el-form-item
            ><el-input
              placeholder="GitHub Account"
              v-model="form.name"
            ></el-input
          ></el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row type="flex" justify="center">
				<el-col :span="2" :xs="5">
						<el-form-item><el-button type="primary" @click="onSubmit">确认</el-button></el-form-item>
				</el-col>
			</el-row> -->
    </el-form>
    <!-- 
		<el-row class="content" :gutter="20">
			<el-col :span="6" :xs="24">
				<h2>GitHub 是什么？</h2>
				<ul>
					<li>
						开源代码托管<span><i style="color: red;" class="el-icon-close
"></i>No</span>
					</li>
					<li>
						程序员的天堂<span><i style="color: red;" class="el-icon-close
"></i>No</span>
					</li>
					<li>
						免费图床<span><i style="color: green;" class="el-icon-check
"></i>Yes</span>
					</li>
					<li>
						同性交友<span><i style="color: green;" class="el-icon-check
"></i>Yes</span>
					</li>
					<li>
						期末抄作业<span><i style="color: green;" class="el-icon-check
"></i>Yes</span>
					</li>
					<li>
						项目扒代码<span><i style="color: green;" class="el-icon-check
"></i>Yes</span>
					</li>
				</ul>
				<el-divider></el-divider>
				<p class="tips">“买技术是不可能的，这辈子都不会买技术的。自己重新写又不会，只有靠抄才能维持写代码这样子。进Gayhub感觉就像回家一样，里面的程序员个个都是人才，代码写的又好文档也清晰，我超喜欢Gayhub的！”</p>
			</el-col>
			<el-col :span="18" :xs="24">
				<el-card :body-style="{ padding: '0px' }">
					<img class="gayhub" src="../../assets/gayhub.jpg" alt="GitHub 是什么？">
				</el-card>
			</el-col>
		</el-row>
		 -->
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data() {
    return {
      form: {
        name: "",
        remember: true,
      },
    };
  },
  methods: {
    async onSubmit() {
      if (this.form.name == "" || this.form.name == null) {
        this.$message.error("请正确输入用户名！");
      } else {
        // const res =
        await this.$axios
          .get("https://api.github.com/users/" + this.form.name)
          .catch((e) => {
            console.log(e);
          })
          .then((res) => {
            this.$notify({
              title: "成功!",
              type: "success",
              message: "正在拼命跳转...",
              duration: 500,
            });
            localStorage.setItem("account", res.data.name);
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            setTimeout(() => {
              this.$router.push("/user");
            }, 1000);
          });
      }
    },
  },
  created() {
    this.$emit("menuUpdate", "/");
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
ul li {
  margin-bottom: 10px;
  color: #616161;
}
ul li span {
  float: right;
}
.gayhub {
  width: 100%;
}
.tips {
  margin: 0 0 20px;
  font-size: 14px;
  color: #616161;
}
.form {
  margin: 0px 0 10px;
}
.form_label {
  text-align: center;
  font-weight: normal;
}
.content {
  margin-bottom: 50px;
}
</style>
