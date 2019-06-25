<template>
  <div class="createPost-container">
    <el-row>
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="10">

        <aside>
          角色是对用户域下面对用户的再次划分<br>
          . 角色名称用于系统内部识别。在项目中是唯一的，别名用于后台管理识别<br>
          . 每个用户只能有一个角色，目前不支持一用户多角色。<br>
          . 角色名称一旦添加不可修改，将用于系统权限识别
        </aside>
        <div class="createPost-main-container">

          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="所属域" prop="domain">
              <el-select v-model="ruleForm.domain_id" placeholder="请选择域" :loading="gLoading">
                <el-option
                  v-for="item in roleDomain"
                  :key="item.id"
                  :label="item.guard_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="role_name">
              <el-input v-model="ruleForm.role_name" :disabled="isEdit" />
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

import { addRole, fetchRole, updateRole } from '@/api/role'
import { fetchList } from '../../../api/role-domain'

export default {
  name: 'CreateRoleForm',
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
      roleDomain: [],
      gLoading: true,
      ruleForm: {
        domain_id: [],
        role_name: '',
        guard_name: '',
        description: ''
      },
      loading: false,
      rules: {
        domain_id: [{
          required: true,
          message: '请选择用户组',
          trigger: 'change'
        }],
        role_name: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        },
        {
          min: 4,
          message: '角色名称至少输入4个字符',
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
    this.getGroupList()

    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      this.fetchData()
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {

    fetchData() {
      fetchRole(this.id).then(response => {
        this.ruleForm.domain_id = response.data.role.domain_id
        this.ruleForm.role_name = response.data.role.role_name
        this.ruleForm.guard_name = response.data.role.guard_name
        this.ruleForm.description = response.data.role.description

        // set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑角色'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },

    getGroupList() {
      this.listLoading = true
      fetchList().then(response => {
        this.roleDomain = response.data.domains
        this.gLoading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateRole(this.ruleForm, this.id).then(response => {
              this.$message({
                message: '恭喜你，编辑角色成功',
                type: 'success'
              })
              this.loading = false
            })
          } else {
            addRole(this.ruleForm).then(response => {
              this.$message({
                message: '恭喜你，添加角色成功',
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
