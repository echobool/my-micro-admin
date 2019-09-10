<template>
  <div class="createPost-container">
    <el-row>
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="10">
        <Warning />
        <div class="createPost-main-container">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">

            <el-form-item label="模板名称" prop="template_name">
              <el-input v-model="ruleForm.template_name" />
            </el-form-item>
            <el-form-item label="模板CODE" prop="send_type">
              <el-input v-model="ruleForm.send_type" />
            </el-form-item>
            <el-form-item label="阿里云模板ID" prop="template_code" auto>
              <el-input v-model="ruleForm.template_code" />
            </el-form-item>
            <el-form-item label="模板内容" prop="content">
              <el-input
                v-model="ruleForm.content"
                type="textarea"
                rows="4"
                placeholder="变量格式 ${code}"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="传参案例" prop="template_param">
              <el-input
                v-model="ruleForm.template_param"
                type="textarea"
                rows="4"
                placeholder="json格式：{&quot;code&quot;:&quot;435433&quot;}"
                maxlength="300"
                show-word-limit
              />
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
import Warning from './Warning'
import { addSmsTemplate, fetchSmsTemplate, updateSmsTemplate } from '@/api/message'
import { getProperty } from '@/utils/index'
// eslint-disable-next-line

export default {
  name: 'CreateUserForm',
  components: {
    Warning
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gLoading: true,
      ruleForm: {
        template_name: '',
        send_type: '',
        template_code: '',
        content: '',
        template_param: ''
      },
      loading: false,
      rules: {

        template_name: [
          {
            required: true,
            message: '请输入模板名称',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '模板名称至少4个字符',
            trigger: 'blur'
          }
        ],
        send_type: [
          {
            required: true,
            message: '请输入模板CODE',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '模板CODE至少4个字符且在系统中保持唯一',
            trigger: 'blur'
          }
        ],
        template_code: [{
          required: true,
          message: '请输入模板ID',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '请输入模板内容',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    // 如果是编辑模式 需要加载初始数据
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      this.fetchData()

      this.tempRoute = Object.assign({}, this.$route)
    }
  },
  methods: {
    fetchData() {
      fetchSmsTemplate(this.id).then(response => {
        this.ruleForm.template_name = getProperty(response.data.smsTemplate, 'name', '')
        this.ruleForm.send_type = getProperty(response.data.smsTemplate, 'send_type', '')
        this.ruleForm.template_code = getProperty(response.data.smsTemplate, 'template_code', '')
        this.ruleForm.content = response.data.smsTemplate.content
        this.ruleForm.template_param = response.data.smsTemplate.template_param
        // set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑用户分组'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateSmsTemplate(this.ruleForm, this.id).then(response => {
              this.$message({
                message: '恭喜你，编辑模板成功',
                type: 'success'
              })
              this.loading = false
            })
          } else {
            addSmsTemplate(this.ruleForm).then(response => {
              this.$message({
                message: '恭喜你，添加模板成功',
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
