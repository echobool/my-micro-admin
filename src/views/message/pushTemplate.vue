<template>
  <div class="app-container">
    <el-row :gutter="10" type="type">
      <el-col :xs="22" :sm="22" :md="22" :lg="23" :xl="23">

        <el-form ref="searchForm" :inline="true" :model="searchForm" :rules="rules" class="search">
          <el-form-item>
            <el-button type="primary" round :disabled="!checkPermission(['CreatePushTemplate'])" icon="el-icon-edit" @click="$router.push({name: 'CreatePushTemplate'})">添加模板</el-button>
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

      <el-table-column label="模板名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="模板CODE">
        <template slot-scope="scope">
          <span>{{ scope.row.send_type }}</span>
        </template>
      </el-table-column>

      <el-table-column width="250" class-name="status-col" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column width="500" class-name="status-col" label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.body }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.push_type | pushTypeFilter }}</span>
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

          <el-button plain type="primary" :disabled="!checkPermission(['EditPushTemplate'])" size="mini" style="margin-left:10px;" @click="$router.push({name: 'EditPushTemplate',params: {id:scope.row.id}})">
            编辑
          </el-button>

          <el-button plain type="danger" :disabled="!checkPermission(['DeletePushTemplate'])" size="mini" style="margin-left:10px;" @click="deleteConfirm(scope.row)">
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getList" />

  </div>
</template>

<script>
import { fetchPushTemplateList, deletePushTemplate } from '@/api/message'
import { getProperty } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'PushTemplate',
  components: { Pagination },
  filters: {
    pushTypeFilter(puthType) {
      const puthTypeMap = {
        MESSAGE: '消息',
        NOTICE: '通知'
      }
      return puthTypeMap[puthType]
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

      fetchPushTemplateList(this.listQuery).then(response => {
        this.list = response.data.Templates
        this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
      })
    },
    deleteConfirm(row) {
      this.$confirm('您确认要删除 ' + row.name + ' 该模板吗? 可在数据库中恢复。', '是否继续?', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 进行远程操作
        deletePushTemplate(row.id).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {})
    },

    resetForm(formName) {
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
