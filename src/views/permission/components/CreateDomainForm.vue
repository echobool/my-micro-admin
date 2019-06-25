<template>
  <div class="createPost-container">
    <el-row>
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="10">
        <aside>
          域是对整个项目模块划分，不同域具有不同模块的访问权限。<br>
          . 域名用于系统内部识别。在项目中是唯一的。<br>
          . 别名用于后台管理识别。<br>
          . 并不是传统域名的绑定。
        </aside>
        <div class="createPost-main-container">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="域名" prop="domain_name" auto>
              <el-input v-model="ruleForm.domain_name" />
            </el-form-item>
            <el-form-item label="别名" prop="guard_name">
              <el-input v-model="ruleForm.guard_name" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="ruleForm.description" />
            </el-form-item>
            <el-form-item>
              <el-button v-if="isEdit" type="primary" @click="submitForm('ruleForm')">提交更新</el-button>
              <el-button v-else type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button v-if="!isEdit" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { addDomain, fetchDomain, updateDomain } from '@/api/role-domain'
// eslint-disable-next-line
const DefaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}
export default {
  name: 'CreateDomainForm',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      ruleForm: {
        domain_name: '',
        guard_name: '',
        description: ''
      },
      loading: false,
      rules: {
        domain_name: [{
          required: true,
          message: '请输入域名称',
          trigger: 'blur'
        },
        {
          min: 4,
          message: '分组名称至少输入4个字符',
          trigger: 'blur'
        }],
        guard_name: [{
          required: true,
          message: '请输入别名',
          trigger: 'change'
        }],
        description: [{
          required: true,
          message: '请输入描述',
          trigger: 'change'
        }]
      },
      tempRoute: {}
    }
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      this.fetchData()
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData() {
      fetchDomain(this.id).then(response => {
        this.ruleForm.domain_name = response.data.domain.name
        this.ruleForm.guard_name = response.data.domain.guard_name
        this.ruleForm.description = response.data.domain.description

        // set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑域'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateDomain(this.ruleForm, this.id).then(response => {
              console.log(response)
              this.$message({
                message: '恭喜你，编辑域成功',
                type: 'success'
              })
              this.loading = false
            })
          } else {
            addDomain(this.ruleForm).then(response => {
              console.log(response)
              this.$message({
                message: '恭喜你，添加域成功',
                type: 'success'
              })
              this.resetForm('ruleForm')
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}

</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  padding: 20px 20px 20px 20px;
  position: relative;
  .createPost-main-container {
    width: 100%;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
