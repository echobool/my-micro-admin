<template>
  <div class="app-container">
    <el-row :gutter="10" type="type">
      <aside>
        用户组（域）是对项目场景用户的划分，不同用户组用户可以访问不同的资源。<br>
        如：学生用户组，老师用户组，学校用户组，后台用户组。<br>
        用户可以同时加入多个用户组（域），可以设置系统用户注册时的默认分组。<br>
        每个组（域）下面可以拥有不同的角色。如果分组下存在用户或角色将不能删除，删除前请确保分组下无用户和无角色。
      </aside>
      <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="10">
        <div class="add-user">
          <el-button type="primary" :disabled="!checkPermission(['DomainForm'])" round @click="$router.push({name: 'DomainForm'})">添加域</el-button>
        </div>
      </el-col>

    </el-row>

    <el-table v-loading="listLoading" :data="list" stripe fit style="width: 100%">
      <el-table-column align="center" label="#" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="域名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="别名">
        <template slot-scope="scope">
          <span>{{ scope.row.guard_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="创建日期">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <router-link :to="'/permission/domain/edit/'+scope.row.id">
            <el-button type="primary" :disabled="!checkPermission(['DomainEditForm'])" size="mini" plain>
              编辑
            </el-button>
          </router-link>
          <el-button plain type="danger" :disabled="!checkPermission(['domainDelete'])" size="mini" style="margin-left:10px;" @click="deleteConfirm(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.page_size" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList, deleteDomain } from '@/api/role-domain'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getProperty } from '@/utils/index'
export default {
  name: 'Domain',
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
      input3: '',
      select: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.domains
        this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
      })
    },
    deleteConfirm(row) {
      this.$confirm('您确认要删除 ' + row.name + ' 该域吗? 删除后将不能恢复。', '是否继续?', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      // 进行远程操作
        deleteDomain(row.id).then(response => {
          this.getList()
          this.$message({
            message: '恭喜你，删除域成功',
            type: 'success'
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

  .add-user{
    float: left;
    margin-bottom: 25px;

  }
</style>
