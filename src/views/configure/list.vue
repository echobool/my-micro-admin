<template>
  <div class="app-container">
    <template>
      <aside>
        因系统使用etcd作为服务注册发现，所以默认现在使用的是ETCD作为配置中心的储存引擎，以后考虑其它存储引擎。<br>
        此管理默认没有开发删除配置功能，因为安全原因，请在etcd服务的控制台中删除相关key。<br>
      </aside>
    </template>
    <el-row :gutter="10" type="type">
      <el-col :xs="22" :sm="22" :md="22" :lg="23" :xl="23">

        <el-form ref="searchForm" :inline="true" :model="searchForm" :rules="rules" class="search">
          <el-form-item>
            <el-button type="primary" round :disabled="!checkPermission(['CreateForm'])" icon="el-icon-edit" @click="$router.push({name: 'CreateForm'})">添加配置</el-button>
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

      <el-table-column label="key">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="create_revision">
        <template slot-scope="scope">
          <span>{{ scope.row.create_revision }}</span>
        </template>
      </el-table-column>
      <el-table-column label="mod_revision">
        <template slot-scope="scope">
          <span>{{ scope.row.mod_revision }}</span>
        </template>
      </el-table-column>
      <el-table-column label="version">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="lease">
        <template slot-scope="scope">
          <span>{{ scope.row.lease }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button plain type="primary" :disabled="!checkPermission(['ConfigureEdit'])" size="mini" style="margin-left:10px;" @click="deleteConfirm(scope.row)">
            编辑
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList, deleteUser } from '@/api/configure'
import { objectMerge } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'MemberList',
  components: { Pagination },
  data() {
    return {
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
      }
    }
  },

  created() {
    this.getList()
  },
  methods: {
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
        // this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
      })
    },
    deleteConfirm(row) {
      let identification = ''
      if (row.user_name) {
        identification = row.user_name
      } else if (row.phone_number) {
        identification = row.phone_number
      } else if (row.email) {
        identification = row.email
      }
      this.$confirm('您确认要删除 ' + identification + ' 该用户吗? 可在回收站恢复。', '是否继续?', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 进行远程操作
        deleteUser(row.id).then(response => {
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.searchForm.keyword = ''
      this.searchForm.searchType = ''
      this.showCancelButton = false
      this.listQuery.page = 1
      this.getList()
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
