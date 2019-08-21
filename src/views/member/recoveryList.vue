<template>
  <div class="app-container">
    <el-row :gutter="10" type="type">
      <el-col :xs="22" :sm="22" :md="22" :lg="23" :xl="23" style="text-align:right">
        <div class="search" style="">
          <el-input v-model="input3" label="检索用户" placeholder="请输入内容" class="input-with-select">
            <el-select slot="prepend" v-model="select" style="width:120px" placeholder="请选择">
              <el-option label="手机号" value="phone_number" />
              <el-option label="用户名" value="user_name" />
              <el-option label="Email" value="email" />
            </el-select>
            <el-button slot="append" icon="el-icon-search" type="primary">搜索</el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :xs="2" :sm="2" :md="2" :lg="1" :xl="1" style="text-align:right">

        <el-button circle icon="el-icon-refresh" @click="refresh()" />

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

      <el-table-column class-name="status-col" label="地址" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="注册日期">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="删除时间">
        <template slot-scope="scope">
          <span>{{ scope.row.deleted_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="90">
        <template slot-scope="scope">
          <el-button plain type="danger" :disabled="!checkPermission(['userRecovery'])" size="mini" style="margin-left:10px;" @click="recoveryConfirm(scope.row)">
            恢复
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getList" />

  </div>
</template>

<script>
import { recoveryList, recoveryUser } from '@/api/user'
import { getProperty } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'RecoveryList',
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
      input3: '',
      select: ''
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
      recoveryList(this.listQuery).then(response => {
        this.list = response.data.users
        this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
      })
    },
    recoveryConfirm(row) {
      let identification = ''
      if (row.user_name) {
        identification = row.user_name
      } else if (row.phone_number) {
        identification = row.phone_number
      } else if (row.email) {
        identification = row.email
      }
      this.$confirm('您确认要恢复 ' + identification + ' 该用户吗? ', '是否继续?', '恢复警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 进行远程操作
        recoveryUser(row.id).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '恢复成功!'
          })
        })
      }).catch(() => {})
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
    margin-bottom: 25px;width:450px;

  }

</style>
