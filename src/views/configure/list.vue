<template>
  <div class="app-container">
    <template>
      <aside>
        因系统使用etcd作为服务注册发现，所以默认现在使用的是ETCD作为配置中心的储存引擎，以后考虑其它存储引擎。<br>
        同一配置时,版本号不能重复。<br>
        请谨慎使用删除功能，一旦删除，配置将丢失，历史版本将同时删除。<br>
      </aside>
    </template>
    <el-row :gutter="10" type="type">
      <el-col :xs="22" :sm="22" :md="22" :lg="23" :xl="23">

        <el-form ref="searchForm" :inline="true" :model="searchForm" :rules="rules" class="search">
          <el-form-item>
            <el-button type="primary" round :disabled="!checkPermission(['CreateForm'])" icon="el-icon-edit" @click="openForm()">添加配置</el-button>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input v-model="searchForm.keyword" placeholder="请输入键名" clearable />
          </el-form-item>
          <el-form-item>
            <el-button v-if="!showCancelButton" icon="el-icon-search" type="primary" @click="search('searchForm')">搜索</el-button>
            <el-button v-if="showCancelButton" icon="el-icon-close" plain type="warning" @click="resetForm('searchForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--刷新-->
      <el-col :xs="2" :sm="2" :md="2" :lg="1" :xl="1" style="text-align:right">
        <el-button circle type="primary" icon="el-icon-refresh" @click="refresh()" />
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :highlight-current-row="true" :data="list" stripe fit style="width: 100%">

      <el-table-column label="配置名称">
        <template slot-scope="scope">
          <span>{{ scope.row.config_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="config_key">
        <template slot-scope="scope">
          <span>{{ scope.row.config_key }}</span>
        </template>
      </el-table-column>

      <el-table-column label="version">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Beta">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.beta"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button plain type="primary" :disabled="!checkPermission(['ConfigureEdit'])" size="mini" style="margin-left:10px;" @click="openForm(scope.row)">
            编辑
          </el-button>
          <el-button plain type="primary" :disabled="!checkPermission(['ConfigureDelete'])" size="mini" style="margin-left:10px;" @click="deleteConfirm(scope.row)">
            删除
          </el-button>
          <el-button plain type="primary" :disabled="!checkPermission(['ConfigureHistory'])" size="mini" style="margin-left:10px;" @click.native="$router.push({name: 'HistoryList',params: {id:scope.row.id,name:encodeURIComponent(scope.row.config_name)}})">
            历史版本
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getList" />

    <el-dialog :title="'添加配置'" width="1000px" :visible.sync="dialogTableVisible">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="createPost-main-container">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules2" label-width="100px" class="demo-ruleForm">
              <el-form-item label="配置名称" prop="config_name">
                <el-input v-model="ruleForm.config_name" placeholder="配置名称" />
              </el-form-item>
              <el-form-item label="config key" prop="config_key" auto>
                <el-input v-model="ruleForm.config_key" :disabled="isEdit" placeholder="通常填写对应服务的简写或服务名" />
              </el-form-item>
              <el-form-item label="Version" prop="version" auto>
                <el-input v-model="ruleForm.version" placeholder="如：v1.0.0" />
              </el-form-item>
              <el-form-item label="Beta发布" prop="beta">
                <el-switch
                  v-model="ruleForm.beta"
                />
                <span style="padding-left:20px;">说明：选中beta发布模式，会以另一个文件保存,在获取配置时注意。</span>
              </el-form-item>
              <el-form-item label="配置内容" prop="config_value">
                <div class="editor-container">
                  <json-editor ref="jsonEditor" v-model="ruleForm.config_value" />
                </div>
                <span>注：配置内容为 json 代码格式。</span>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')">发布</el-button>
                <el-button :disabled="isEdit" @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>

<script>
import { addConfigure, updateConfigure, getInfo, fetchList, deleteConfigure } from '@/api/configure'
import { getProperty, objectMerge } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import JsonEditor from '@/components/JsonEditor'

export default {
  name: 'MemberList',
  components: { Pagination, JsonEditor },
  data() {
    return {
      id: '',
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
      rules2: {
        config_name: [
          {
            required: true,
            message: '请输入配置名称',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '配置名称至少4个字符',
            trigger: 'blur'
          }
        ],
        config_key: [
          {
            required: true,
            message: '请输入 config key',
            trigger: 'blur'
          },
          {
            min: 4,
            message: 'config key 名至少4个字符',
            trigger: 'blur'
          }
        ],
        version: [{
          required: true,
          message: '请输入版本号',
          trigger: 'blur'
        }]
      },
      dialogTableVisible: false,
      ruleForm: {
        config_name: '',
        config_key: '',
        version: '',
        beta: false,
        config_value: JSON.parse('{}')
      },
      loading: false,
      isEdit: false
    }
  },

  created() {
    this.getList()
  },
  methods: {
    openForm(row) {
      this.dialogTableVisible = true
      if (row) {
        this.isEdit = true
        getInfo(row.id).then(res => {
          var config = res.data.config
          this.ruleForm.config_name = config.config_name
          this.ruleForm.config_key = config.config_key
          this.ruleForm.config_value = JSON.parse(config.config_value)
          this.ruleForm.version = config.version
          this.ruleForm.beta = config.beta
          this.id = row.id
        })
      } else {
        this.isEdit = false
        this.ruleForm.config_name = ''
        this.ruleForm.config_key = ''
        this.ruleForm.config_value = JSON.parse('{}')
        this.ruleForm.version = ''
        this.ruleForm.beta = false
      }
    },
    refresh() {
      this.listQuery.page = 1
      this.listQuery.page_size = 20
      this.getList()
    },
    getList() {
      this.listLoading = true
      if (this.searchForm.keyword && this.searchForm.searchType) {
        // 查询时合并搜索请求
        this.listQuery = objectMerge(this.listQuery, this.searchForm)
        this.showCancelButton = true
      } else {
        // 否则删除合并的搜索项
        delete this.listQuery.keyword
        delete this.listQuery.searchType
      }

      fetchList(this.listQuery).then(response => {
        this.list = response.data.configs
        this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
      })
    },
    deleteConfirm(row) {
      this.$confirm('您确认要删除 ' + row.config_key + ' 该配置吗? ', '是否继续?', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 进行远程操作
        deleteConfigure(row.id).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {})
    },
    search(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getList()
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          try {
            this.ruleForm.config_value = JSON.parse(this.ruleForm.config_value)
          } catch (error) {
            this.$message({
              message: '请输入正确的配置内容 （ json 格式 ）',
              type: 'error'
            })
            return
          }

          this.loading = true
          if (this.isEdit) {
            console.log(this.isEdit)
            updateConfigure(this.ruleForm, this.id).then(response => {
              this.$message({
                message: '恭喜你，发布成功',
                type: 'success'
              })
              this.loading = false
              this.dialogTableVisible = false
              this.getList()
            }).catch(e => {
              this.loading = false
              console.log(e)
            })
          } else {
            addConfigure(this.ruleForm).then(response => {
              this.$message({
                message: '恭喜你，添加配置并发布成功',
                type: 'success'
              })
              this.resetForm('ruleForm')
              this.loading = false
              this.dialogTableVisible = false
              this.getList()
            }).catch(e => {
              this.loading = false
              console.log(e)
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

.editor-container{
  position: relative;
  height: 300px;
  overflow:scroll;
  line-height: 125%;

}
</style>
