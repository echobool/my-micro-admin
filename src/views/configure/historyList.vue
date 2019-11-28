<template>
  <div class="app-container">
    <template>
      <aside>
        注意：系统默认保留最近20条版本记录，当然也可以通过设置更改此值，系统会自动删除过期记录。<br>
      </aside>
    </template>
    <el-row :gutter="10" type="type">
      <el-row :gutter="10" type="type">
        <el-col :xs="22" :sm="22" :md="22" :lg="23" :xl="23">

          <div style="font-size: 14px;color:#606266;margin-left:20px;line-height:3.7">配置名称：<span style="font-size: 16px;color:#333;">{{ decodeURIComponent(conf_name) }}</span></div>
        </el-col>
        <!--刷新-->
        <el-col :xs="2" :sm="2" :md="2" :lg="1" :xl="1" style="text-align:right;">
          <el-button circle type="primary" icon="el-icon-refresh" @click="refresh()" />
        </el-col>
      </el-row>
    </el-row>

    <el-table v-loading="listLoading" :highlight-current-row="true" :data="list" stripe fit style="width: 100%">
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
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button plain type="primary" :disabled="!checkPermission(['HistoryRollback'])" size="mini" style="margin-left:10px;" @click="showDetail(scope.row)">
            详情
          </el-button>
          <el-button plain type="primary" :disabled="!checkPermission(['HistoryRollback'])" size="mini" style="margin-left:10px;" @click="rollBackConfirm(scope.row)">
            回滚
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getList" />
    <el-dialog :title="'配置详情'" width="1000px" :visible.sync="dialogTableVisible">
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">配置键名：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ conf_data.config_key }}</div></el-col>
      </el-row>

      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">Version：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ conf_data.version }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">Beta：</div></el-col>
        <el-col :span="20"><div class="bg-content">
          <el-switch
            v-model="conf_data.beta"
            disabled
          /></div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="2"><div class="bg-title">配置内容：</div></el-col>
        <el-col :span="24">
          <pre>{{ conf_data.config_value }}</pre>

        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>

<script>
import { fetchHistoryList, getHistoryInfo, rollBack } from '@/api/configure'
import { getProperty } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'MemberList',
  components: { Pagination },
  data() {
    return {
      conf_id: '',
      conf_name: '',
      list: null,
      total: 0,
      listLoading: true,
      dialogTableVisible: false,
      listQuery: {
        page: 1,
        page_size: 20
      },
      conf_data: {}
    }
  },

  created() {
    this.conf_id = this.$route.params && this.$route.params.id
    this.conf_name = this.$route.params && this.$route.params.name
    this.getList()
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    showDetail(row) {
      this.dialogTableVisible = true
      getHistoryInfo(row.id).then((resconse) => {
        this.conf_data = resconse.data.history
        this.conf_data.config_value = JSON.stringify(JSON.parse(this.conf_data.config_value), null, 2)
      }).catch((err) => {
        console.log(err)
      })
    },
    refresh() {
      this.listQuery.page = 1
      this.listQuery.page_size = 20
      this.getList()
    },
    getList() {
      this.listLoading = true

      fetchHistoryList(this.listQuery, this.conf_id).then(response => {
        this.list = response.data.histories
        this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '应用配置-版本历史'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.conf_id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    rollBackConfirm(row) {
      this.$confirm('您确认要回滚 ' + row.version + ' 该配置吗? ', '是否继续?', {
        confirmButtonText: '回滚',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 进行远程操作
        rollBack(row.id).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '回滚成功!'
          })
        })
      }).catch(() => {})
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

pre {
  padding:15px;
  background:#333333;
  color:#fff;
  margin-top:15px 0;
  line-height:150%;
  max-height: 300px;
  overflow:scroll;
}
</style>
