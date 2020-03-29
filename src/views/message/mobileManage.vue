<template>
  <div class="app-container">
    <el-row :gutter="10" type="type">
      <el-col :xs="22" :sm="22" :md="22" :lg="23" :xl="23">

        <el-form ref="searchForm" :inline="true" :model="searchForm" :rules="rules" class="search">
          <el-form-item>
            <el-button type="primary" round :disabled="!checkPermission(['CreateMobile'])" icon="el-icon-edit" @click="createMobile()">添加移动端</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--刷新-->
      <el-col :xs="2" :sm="2" :md="2" :lg="1" :xl="1" style="text-align:right">
        <el-button circle type="primary" icon="el-icon-refresh" @click="refresh()" />
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :highlight-current-row="true" :data="list" stripe fit style="width: 100%">
      <el-table-column align="center" label="#" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="移动端名称">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="APP_NAME">
        <template slot-scope="scope">
          <span>{{ scope.row.app_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="400" class-name="status-col" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">

          <el-button plain type="primary" :disabled="!checkPermission(['EditMobile'])" size="mini" style="margin-left:10px;" @click="edit(scope.row)">
            编辑
          </el-button>

          <el-button plain type="danger" :disabled="!checkPermission(['DeleteMobile'])" size="mini" style="margin-left:10px;" @click="deleteConfirm(scope.row)">
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getList" />

    <el-dialog v-el-drag-dialog width="650px" top="15vh" :visible.sync="dialogTableVisible" title="添加移动端" @dragDialog="handleDrag">
      <div class="createPost-main-container" style="height:60vh; overflow:scroll;">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rulesForm" label-width="130px" class="demo-ruleForm">

          <el-form-item label="移动端名称" prop="mobile_name">
            <el-input v-model="ruleForm.mobile_name" placeholder="请输入移动端应用名称" />
          </el-form-item>
          <el-form-item label="标识" prop="app_name">
            <el-input v-model="ruleForm.app_name" placeholder="请输入移动端标识" />
          </el-form-item>
          <el-form-item label="描述" prop="describe">
            <el-input
              v-model="ruleForm.describe"
              type="textarea"
              rows="4"
              placeholder="移动端简单描述"
              maxlength="300"
              show-word-limit
            />
          </el-form-item>
          <el-divider content-position="center">推送配置</el-divider>
          <el-form-item label="AccessKeyId" prop="access_key_id">
            <el-input v-model="ruleForm.access_key_id" placeholder="请输入AccessKeyId" />
          </el-form-item>
          <el-form-item label="AccessKeySecret" prop="access_key_secret">
            <el-input v-model="ruleForm.access_key_secret" placeholder="请输入AccessKeySecret" />
          </el-form-item>
          <el-form-item label="Region" prop="region">
            <el-input v-model="ruleForm.region" placeholder="请输入Region" />
          </el-form-item>
          <el-divider content-position="left">IOS 配置</el-divider>
          <el-form-item label="AppKey" prop="ios_app_key">
            <el-input v-model="ruleForm.ios_app_key" placeholder="请输入AppKey" />
          </el-form-item>
          <el-form-item label="AppSecret" prop="ios_app_secret">
            <el-input v-model="ruleForm.ios_app_secret" placeholder="请输入AppSecret" />
          </el-form-item>
          <el-form-item label="BundleId" prop="bundle_id">
            <el-input v-model="ruleForm.bundle_id" placeholder="请输入BundleId" />
          </el-form-item>
          <el-form-item label="ApnsEnv" prop="apns_env">
            <el-input v-model="ruleForm.apns_env" placeholder="请输入ApnsEnv" />
          </el-form-item>
          <el-divider content-position="left">Android 配置</el-divider>
          <el-form-item label="AppKey" prop="android_app_key">
            <el-input v-model="ruleForm.android_app_key" placeholder="请输入AppKey" />
          </el-form-item>
          <el-form-item label="AppSecret" prop="android_app_secret">
            <el-input v-model="ruleForm.android_app_secret" placeholder="请输入AppSecret" />
          </el-form-item>
          <el-form-item label="PackageName" prop="package_name">
            <el-input v-model="ruleForm.package_name" placeholder="请输入PackageName" />
          </el-form-item>
          <el-form-item>
            <el-button v-if="isEdit" :loading="loading" :disabled="form_disabled" type="primary" @click="submitForm('ruleForm')">提交更新</el-button>
            <el-button v-else :loading="loading" :disabled="form_disabled" type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button v-if="!isEdit" @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchMobileList, fetchMobile, updateMobile, addMobile, deleteMobile } from '@/api/message'
import { getProperty } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'Mobile',
  directives: { elDragDialog },
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      searchForm: {
        keyword: '',
        searchType: ''
      },
      showCancelButton: false,
      rules: {
        keyword: [
          { required: true, message: '请输入搜索值', trigger: 'blur' }
        ],
        searchType: [
          { required: true, message: '请选择搜索类型', trigger: 'change' }
        ]
      },
      id: 0,
      ruleForm: {
        mobile_name: '',
        app_name: '',
        describe: '',
        access_key_id: '',
        access_key_secret: '',
        region: '',
        ios_app_key: '',
        ios_app_secret: '',
        bundle_id: '',
        apns_env: '',
        android_app_key: '',
        android_app_secret: '',
        package_name: ''

      },
      rulesForm: {
        mobile_name: [
          {
            required: true,
            message: '请输入移动端名称',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '模板名称至少4个字符',
            trigger: 'blur'
          }
        ],
        app_name: [
          {
            required: true,
            message: '请输入标识',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '标识至少4个字符且在系统中保持唯一',
            trigger: 'blur'
          }
        ],
        access_key_id: [{
          required: true,
          message: '请输入AccessKeyId',
          trigger: 'blur'
        }],
        access_key_secret: [{
          required: true,
          message: '请输入AccessKeySecret',
          trigger: 'blur'
        }],
        region: [{
          required: true,
          message: '请输入Region',
          trigger: 'blur'
        }],
        ios_app_key: [{
          required: true,
          message: '请输入ios配置AppKey',
          trigger: 'blur'
        }],
        ios_app_secret: [{
          required: true,
          message: '请输入ios配置AppSecret',
          trigger: 'blur'
        }],
        bundle_id: [{
          required: true,
          message: '请输入BundleId',
          trigger: 'blur'
        }],
        apns_env: [{
          required: true,
          message: '请输入ApnsEnv',
          trigger: 'blur'
        }],
        android_app_key: [{
          required: true,
          message: '请输入android配置AppKey',
          trigger: 'blur'
        }],
        android_app_secret: [{
          required: true,
          message: '请输入android配置AppSecret',
          trigger: 'blur'
        }],
        package_name: [{
          required: true,
          message: '请输入android配置PackageName',
          trigger: 'blur'
        }]
      },
      form_disabled: false,
      isEdit: false,
      loading: false
    }
  },

  created() {
    this.getList()
  },
  methods: {
    createMobile() {
      this.dialogTableVisible = true
      this.isEdit = false
      this.resetForm('ruleForm')
    },
    edit(row) {
      this.id = row.id
      this.isEdit = true
      this.resetForm('ruleForm')
      this.dialogTableVisible = true
      this.form_disabled = true
      const loading = this.$loading({
        lock: true,
        target: '.el-dialog',
        text: 'Loading',
        // spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      fetchMobile(row.id).then(response => {
        loading.close()
        this.form_disabled = false
        this.ruleForm.mobile_name = response.data.mobile.mobile_name
        this.ruleForm.app_name = response.data.mobile.app_name
        this.ruleForm.describe = response.data.mobile.describe
        this.ruleForm.access_key_id = response.data.mobile.push.access_key_id
        this.ruleForm.access_key_secret = response.data.mobile.push.access_key_secret
        this.ruleForm.region = response.data.mobile.push.region
        this.ruleForm.ios_app_key = response.data.mobile.push.ios.app_key
        this.ruleForm.ios_app_secret = response.data.mobile.push.ios.app_secret
        this.ruleForm.bundle_id = response.data.mobile.push.ios.bundle_id
        this.ruleForm.apns_env = response.data.mobile.push.ios.apns_env
        this.ruleForm.android_app_key = response.data.mobile.push.android.app_key
        this.ruleForm.android_app_secret = response.data.mobile.push.android.app_secret
        this.ruleForm.package_name = response.data.mobile.push.android.package_name
      })
    },
    refresh() {
      this.listQuery.page = 1
      this.listQuery.page_size = 20
      this.getList()
    },
    getList() {
      this.listLoading = true

      fetchMobileList(this.listQuery).then(response => {
        this.list = response.data.mobiles
        this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
      })
    },
    deleteConfirm(row) {
      this.$confirm('您确认要删除 "' + row.mobile_name + '" 该移动端吗? 删除将无法恢复。', '是否继续?', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 进行远程操作
        deleteMobile(row.id).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {})
    },

    resetForm(formName) {
      this.ruleForm.mobile_name = ''
      this.ruleForm.app_name = ''
      this.ruleForm.describe = ''
      this.ruleForm.access_key_id = ''
      this.ruleForm.access_key_secret = ''
      this.ruleForm.region = ''
      this.ruleForm.ios_app_key = ''
      this.ruleForm.ios_app_secret = ''
      this.ruleForm.bundle_id = ''
      this.ruleForm.apns_env = ''
      this.ruleForm.android_app_key = ''
      this.ruleForm.android_app_secret = ''
      this.ruleForm.package_name = ''
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateMobile(this.ruleForm, this.id).then(response => {
              this.$message({
                message: '恭喜你，编辑模板成功',
                type: 'success'
              })
              this.loading = false
              this.dialogTableVisible = false
              this.refresh()
            }).catch(err => {
              this.loading = false
              console.log(err)
            })
          } else {
            addMobile(this.ruleForm).then(response => {
              this.$message({
                message: '恭喜你，添加模板成功',
                type: 'success'
              })
              this.resetForm('ruleForm')
              this.loading = false
              this.dialogTableVisible = false
              this.refresh()
            }).catch(err => {
              this.loading = false
              console.log(err)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.user-avatar {
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 3px;
}

.demo-input-suffix {
    margin-bottom: 15px;
}
.el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
.el-card{
  border-radius: 0;
  margin-bottom: 15px;

}

.el-card__body{
    padding: 2px 5px;
  }

  .search{
    margin-left: 15px;
  }

  .add-user{
    float: left;

  }
</style>
