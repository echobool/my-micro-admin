<template>
  <div class="app-container">
    <el-row :gutter="10" type="type">
      <aside>
        权限基于域，不同域具有不同的权限<br>
        权限用于分配给同域下面的角色。<br>
        权限可以是菜单、restful路由、资源，用于前台展示或系统访问控制。<br>
        在开发过程中需要把新建的权限埋点到需要判断的地方。
      </aside>
      <el-col :xs="24" :sm="24" :md="6" :lg="4" :xl="3">
        <div class="add-menu">

          <el-button type="primary" :disabled="!checkPermission(['MenuForm'])" round @click="$router.push({name: 'MenuForm'})">新建权限</el-button>

        </div>

      </el-col>

    </el-row>
    <el-table
      v-loading="listLoading"
      row-key="id"
      :data="menusList"
      style="width: 100%;margin-top:30px;"
      :highlight-current-row="true"
      stripe
      fit
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'has_children'}"
    >

      <el-table-column align="center" label="权限名称">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetail(scope)">{{ scope.row.menu_name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属域">
        <template slot-scope="scope">
          {{ scope.row.domain.guard_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类别">
        <template slot-scope="scope">
          {{ scope.row.menu_type_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="150px" label="路由名称">
        <template slot-scope="scope">
          {{ scope.row.router_name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" width="400px" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="创建日期">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" :disabled="!checkPermission(['MenuEditForm'])" plain @click="$router.push({name: 'MenuEditForm',params: {id:scope.row.id}})">编辑</el-button>
          <el-button type="danger" size="mini" :disabled="!checkPermission(['policyDelete'])" plain @click="deleteConfirm(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" width="800" :total="total" :fullscreen="true" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getMenus" />
    <el-dialog :title="'基本信息'" width="800px" :close-on-click-modal="false" :visible.sync="dialogTableVisible">
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">权限名称：</div></el-col>
        <el-col :span="8"><div class="bg-content">{{ menu.menu_name }}</div></el-col>
        <el-col :span="4"><div class="bg-title">类别：</div></el-col>
        <el-col :span="8"><div class="bg-content">{{ menu.menu_type }}</div></el-col>
      </el-row>

      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">所属域：</div></el-col>
        <el-col :span="8"><div class="bg-content">{{ menu.domain.guard_name }}</div></el-col>
        <el-col :span="4"><div class="bg-title">路由名称：</div></el-col>
        <el-col :span="8"><div class="bg-content">{{ menu.router_name }}</div></el-col>
      </el-row>
      <el-row :gutter="20" class="menu-row">
        <el-col :span="4"><div class="bg-title">备注：</div></el-col>
        <el-col :span="20"><div class="bg-content">{{ menu.description }}</div></el-col>
      </el-row>
      <el-divider v-if="menu.actions.length" content-position="left">前端操作</el-divider>
      <el-table v-if="menu.actions.length" :data="menu.actions" stripe>
        <el-table-column align="center" label="操作名称">
          <template slot-scope="scope">
            {{ scope.row.action_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作标识">
          <template slot-scope="scope">
            {{ scope.row.action_key }}
          </template>
        </el-table-column>

      </el-table>
      <el-divider v-if="menu.resources.length" content-position="left">后台资源</el-divider>
      <el-table v-if="menu.resources.length" :data="menu.resources" stripe>
        <el-table-column align="center" label="操作名称">
          <template slot-scope="scope">
            {{ scope.row.resource_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作标识">
          <template slot-scope="scope">
            {{ scope.row.resource_path }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="请求方法">
          <template slot-scope="scope">
            {{ scope.row.method }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>

import { getMenus, fetchMenu, deleteMenu } from '@/api/menu'
import { getProperty, menuType } from '@/utils/index'
import Pagination from '@/components/Pagination'
// import { Loading } from 'element-ui'

export default {
  name: 'MenuList',
  components: { Pagination },
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        page_size: 20,
        domain_id: 0
      },
      listLoading: false,
      menuLoading: false,
      menusList: [],
      dialogTableVisible: false,
      dialogTitle: '',
      menu: {
        domain: {},
        actions: [],
        resources: []
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    getMenus() {
      this.listLoading = true
      getMenus(this.listQuery).then(response => {
        this.menusList = response.data.menus
        this.menusList.forEach(item => {
          item.menu_type_name = menuType(item.menu_type)
        })
        this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
      })
    },
    load(tree, treeNode, resolve) {
      getMenus({ parent_id: tree.id, page_size: 100, domain_id: this.listQuery.domain_id }).then(response => {
        const tempMenus = response.data.menus
        tempMenus.forEach(item => {
          item.menu_type_name = menuType(item.menu_type)
        })
        resolve(tempMenus)
      })
    },
    showDetail(scope) {
      this.dialogTableVisible = true
      this.dialogTitle = scope.row.menu_name
      this.unsetMenu()

      fetchMenu(scope.row.id).then(response => {
        this.menu.menu_name = response.data.menu.menu_name
        this.menu.router_name = response.data.menu.router_name
        this.menu.menu_type = menuType(response.data.menu.menu_type)
        this.menu.domain = response.data.menu.domain
        this.menu.description = response.data.menu.description
        this.menu.actions = getProperty(response.data.menu, 'action_arrays', [])
        this.menu.resources = getProperty(response.data.menu, 'resource_arrays', [])
      })
    },
    deleteConfirm(row) {
      this.$confirm('您确认要删除 ' + row.menu_name + ' 该权限吗? 删除后将移除角色上所有此权限。', '是否继续?', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      // 进行远程操作
        deleteMenu(row.id).then(response => {
          // 更新列表
          this.getMenus()
          this.$message({
            message: '恭喜你，删除权限成功',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    unsetMenu() {
      this.menu.menu_name = ''
      this.menu.router_name = ''
      this.menu.menu_type = ''
      this.menu.domain = []
      this.menu.description = ''
      this.menu.actions = []
      this.menu.resources = []
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .menus-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
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

.el-divider{
  margin-top: 50px;
}

</style>
