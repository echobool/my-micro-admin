<template>
  <div class="app-container">
    <el-row :gutter="10" type="type">
      <el-col :xs="22" :sm="22" :md="22" :lg="23" :xl="23">

        <el-form ref="searchForm" :inline="true" :model="searchForm" :rules="rules" class="search">
          <el-form-item>
            <el-button type="primary" round :disabled="!checkPermission(['CreateForm'])" icon="el-icon-edit" @click="$router.push({name: 'CreateForm'})">添加用户</el-button>
          </el-form-item>
          <el-form-item label="查找用户" prop="searchType">
            <el-select v-model="searchForm.searchType" style="width:120px" placeholder="请选择">
              <el-option label="手机号" value="phone_number" />
              <el-option label="用户名" value="user_name" />
              <el-option label="Email" value="email" />
            </el-select>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input v-model="searchForm.keyword" placeholder="请输入内容" clearable />
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
      <el-table-column align="center" label="#" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="80">
        <template slot-scope="scope">
          <el-image :src="scope.row.avatar_path+'?imageView2/1/w/80/h/80'" class="user-avatar">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.phone_number }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Email">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" class-name="status-col" label="最近登录">
        <template slot-scope="scope">
          <span>{{ scope.row.login_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="登录IP">
        <template slot-scope="scope">
          <span>{{ scope.row.login_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="地址" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="角色">
        <template slot-scope="scope">
          <el-tag v-for="(role,i) in scope.row.role" :key="i" size="mini" type="success">
            {{ role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="注册日期">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">

          <el-dropdown size="mini">
            <el-button size="mini" plain type="primary">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="!checkPermission(['EditUserForm'])" @click.native="$router.push({name: 'EditUserForm',params: {id:scope.row.id}})">编辑</el-dropdown-item>
              <el-dropdown-item :disabled="!checkPermission(['BehaviorList'])" @click.native="$router.push({name: 'BehaviorList',params: {id:scope.row.id}})">操作日志</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>

          <el-button plain type="danger" :disabled="!checkPermission(['UserDelete'])" size="mini" style="margin-left:10px;" @click="deleteConfirm(scope.row)">
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList, deleteUser } from '@/api/user'
import { getProperty, objectMerge } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'MemberList',
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
        this.list = response.data.users
        this.total = getProperty(response.data.paginator, 'total', 0)
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
