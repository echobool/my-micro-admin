<template>
  <div class="createPost-container">
    <el-row>
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="10">
        <Warning />
        <div class="createPost-main-container">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="所属角色" prop="group">
              <el-select v-model="ruleForm.role" multiple placeholder="请选择角色" :loading="gLoading">
                <el-option-group
                  v-for="group in roles"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="user_name">
              <el-input v-model="ruleForm.user_name" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone_number" auto>
              <el-input v-model="ruleForm.phone_number" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="ruleForm.email" />
            </el-form-item>
            <el-form-item v-if="isEdit" label="密码" prop="password_edit">
              <el-input v-model="ruleForm.password_edit" type="text" placeholder="不修改密码请不要填写" />
            </el-form-item>
            <el-form-item v-else label="密码" prop="password">
              <el-input v-model="ruleForm.password" type="password" autocomplete="new-password" />
            </el-form-item>
            <el-form-item v-if="!isEdit" label="确认密码" prop="password2">
              <el-input v-model="ruleForm.password2" type="password" autocomplete="new-password" />
            </el-form-item>
            <el-form-item v-if="isEdit" label="性别" prop="gender">
              <el-radio-group v-model="ruleForm.gender">
                <el-radio label="boy">男</el-radio>
                <el-radio label="girl">女</el-radio>
                <el-radio label="secret">保密</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="isEdit" label="生日">
              <el-col :span="11">
                <el-form-item prop="date1">
                  <el-date-picker v-model="ruleForm.birthday" type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item v-if="isEdit" label="地址" prop="address">
              <el-input v-model="ruleForm.address" />
            </el-form-item>
            <el-form-item v-if="isEdit" label="个性签名" prop="introduction">
              <el-input v-model="ruleForm.introduction" type="textarea" />
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
import { addUser, fetchUser, updateUser } from '../../../api/user'
import { fetchList } from '../../../api/role'
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
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePhone = (rule, value, callback) => {
      if (value !== '') {
        this.ruleForm.phone_number = this.ruleForm.phone_number.trim()
      }
      if (value !== '') {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!myreg.test(this.ruleForm.phone_number)) {
          callback(new Error('请输入正确的手机号码!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value !== '') {
        this.ruleForm.email = this.ruleForm.email.trim()
      }
      if (value !== '') {
        var myreg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z]{2,5}$/
        if (!myreg.test(this.ruleForm.email)) {
          callback(new Error('请输入正确的邮箱!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateAccount = (rule, value, callback) => {
      if (this.ruleForm.phone_number === '' && this.ruleForm.user_name === '' && this.ruleForm.email === '') {
        callback(new Error('用户名 手机号 邮箱 必须填写其中一项！'))
      } else {
        if (this.ruleForm.user_name !== '') {
          this.ruleForm.user_name = this.ruleForm.user_name.trim()
        }
        callback()
      }
    }
    return {
      roles: [],
      gLoading: true,
      ruleForm: {
        role: '',
        user_name: '',
        phone_number: '',
        email: '',
        password: '',
        password_edit: '',
        password2: '',
        gender: '',
        address: '',
        birthday: '',
        introduction: ''

      },
      loading: false,
      rules: {
        role: [{
          required: true,
          message: '请选择角色',
          trigger: 'change'
        }],
        phone_number: [
          {
            validator: validateAccount,
            trigger: 'blur'
          },
          {
            validator: validatePhone,
            trigger: 'blur'
          }
        ],
        user_name: [
          {
            min: 4,
            message: '用户名至少4个字符',
            trigger: 'blur'
          },
          {
            validator: validateAccount,
            trigger: 'blur'
          }
        ],
        email: [
          {
            validator: validateAccount,
            trigger: 'blur'
          },
          {
            validator: validateEmail,
            trigger: 'blur'
          }
        ],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'change'
        },
        {
          min: 6,
          max: 32,
          message: '请输入6 ~ 32 位的密码',
          trigger: 'blur'
        }],
        password_edit: [
          {
            min: 6,
            max: 32,
            message: '请输入6 ~ 32 位的密码',
            trigger: 'blur'
          }],
        password2: [{
          required: true,
          message: '请输入确认密码',
          trigger: 'change'
        },
        {
          min: 6,
          max: 32,
          message: '请输入6 ~ 32 位的确认密码',
          trigger: 'blur'
        },
        {
          validator: validatePass2,
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getGroupList()
    // 如果是编辑模式 需要加载初始数据
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      this.fetchData()

      this.tempRoute = Object.assign({}, this.$route)
    }
  },
  methods: {
    fetchData() {
      fetchUser(this.id).then(response => {
        this.ruleForm.role = response.data.user.role
        this.ruleForm.phone_number = getProperty(response.data.user, 'phone_number', '')
        this.ruleForm.user_name = getProperty(response.data.user, 'user_name', '')
        this.ruleForm.email = getProperty(response.data.user, 'email', '')
        this.ruleForm.gender = response.data.user.gender
        this.ruleForm.birthday = response.data.user.birthday
        this.ruleForm.address = response.data.user.address
        this.ruleForm.introduction = response.data.user.introduction
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
    getGroupList() {
      this.listLoading = true
      fetchList().then(response => {
        this.roles = this.groupTostruct(response.data.domains)
        this.gLoading = false
      })
    },

    // 将分组返回的对象数组转换成单数组
    groupObjToGroup(groupObj) {
      const group = []
      if (!Array.isArray(groupObj)) {
        return group
      }
      if (groupObj.length > 0) {
        groupObj.forEach(g => {
          group.push(g.group_name)
        })
      }
      return group
    },

    // 将角色转换成结构化数据
    groupTostruct(group) {
      const struct = []
      if (!Array.isArray(group)) {
        return struct
      }
      if (group.length > 0) {
        group.forEach(g => {
          const options = []
          if (Array.isArray(g.roles)) {
            g.roles.forEach(r => {
              options.push({ label: r.guard_name, value: r.role_name })
            })
          }
          struct.push({ label: g.guard_name, options: options })
        })
      }
      return struct
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateUser(this.ruleForm, this.id).then(response => {
              this.$message({
                message: '恭喜你，编辑用户成功',
                type: 'success'
              })
              this.loading = false
            })
          } else {
            addUser(this.ruleForm).then(response => {
              this.$message({
                message: '恭喜你，添加用户成功',
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
