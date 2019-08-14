<template>
  <div class="app-container">
    <el-row :gutter="10" type="type">
      <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="8">
        <div class="add-user">
          <el-button-group>
            <el-button type="success" icon="el-icon-refresh" @click="refresh()">重新加载</el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="14" :xl="16" style="text-align:right">
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
    </el-row>

    <el-table v-loading="listLoading" :highlight-current-row="true" :data="list" stripe fit style="width: 100%">
      <el-table-column align="center" label="#" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作动作">
        <template slot-scope="scope">
          <span>{{ scope.row.action_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="页面地址" width="400">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="请求动作">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="响应状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="登录IP">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="响应时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time_consuming }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">

          <el-button plain type="primary" :disabled="!checkPermission(['behaviorDetails'])" size="mini" style="margin-left:10px;" @click="fetchBehavior(scope.row)">
            查看详情
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getList" />

    <el-dialog :title="'操作详情'" width="800px" :visible.sync="dialogTableVisible">
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">记录ID：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ behavior.id }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">操作名称：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ behavior.action_name }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">请求地址：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ behavior.url }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">请求方法：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ behavior.method }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">提交数据：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ behavior.properties }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">目标服务：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ behavior.subject_type }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">目标主键：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ behavior.subject_id }}_{{ behavior.subject_key_id }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">响应状态：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ behavior.status }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">响应时长：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ behavior.time_consuming }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">IP：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ behavior.ip }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">操作时间：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ behavior.created_at }}</div></el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { behaviorList, fetchBehavior } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getProperty } from '@/utils/index'

export default {
  name: 'BehaviorList',
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
      loading: false,
      dialogTableVisible: false,
      uid: 0,
      listQuery: {
        page: 1,
        page_size: 20
      },
      behavior: {},
      input3: '',
      select: ''
    }
  },
  created() {
    this.uid = this.$route.params && this.$route.params.id
    this.getList()
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    refresh() {
      this.listQuery.page = 1
      this.listQuery.page_size = 20
      this.getList()
    },
    getList() {
      this.listLoading = true
      behaviorList(this.uid, this.listQuery).then(response => {
        this.list = response.data.behaviors
        this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
        this.setTagsViewTitle()
      })
    },
    fetchBehavior(row) {
      this.loading = true
      fetchBehavior(row.id).then(response => {
        this.dialogTableVisible = true
        this.behavior = response.data.behavior
      })
    },
    setTagsViewTitle() {
      const title = '操作日志'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.uid}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    }
  }
}
</script>

<style lang="scss" scoped>
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
    float: left;
    margin-left: 15px;
  }

  .add-user{
    float: left;

  }

  .menu-row {
    margin-bottom: 1px;
    font-size: 12px;
    padding: 14px 0 8px 0;
    margin-left: 0 !important;
    margin-right: 0 !important;
    &:last-child {
      margin-bottom: 0;
    }
    &:nth-child(odd){
      background-color: #f5f5f5;
    }
  }

div.bg-content {
  color: #262626 !important;
}
</style>
