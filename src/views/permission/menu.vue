<template>
  <div class="app-container">
    <el-row :gutter="10" type="type">
      <aside>
        权限策略基于域，不同域具有不同的权限<br>
        权限用于分配给同域下面的角色。<br>
        权限可以是菜单、restful路由、资源，用于前台展示或系统访问控制。<br>
        在开发过程中需要把新建的权限埋点到需要判断的地方。
      </aside>
      <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="10">
        <div class="add-menu">
          <router-link :to="'/permission/menu/create/'">
            <el-button type="primary" round>新建权限策略</el-button>
          </router-link>
        </div>
      </el-col>

    </el-row>
    <el-table
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

      <el-table-column align="center" label="权限策略名称">
        <template slot-scope="scope">
          {{ scope.row.menu_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属域">
        <template slot-scope="scope">
          {{ scope.row.domain.guard_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类别">
        <template slot-scope="scope">
          {{ scope.row.menu_type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由名称">
        <template slot-scope="scope">
          {{ scope.row.router_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标">
        <template slot-scope="scope">
          {{ scope.row.icon }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
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
          <el-button type="primary" size="mini" plain @click="$router.push({name: 'MenuEditForm',params: {id:scope.row.id}})">编辑</el-button>
          <el-button type="danger" size="mini" plain @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getMenus" />

  </div>
</template>

<script>

import { getMenus } from '@/api/menu'
// import { transData } from '@/utils/index'
import Pagination from '@/components/Pagination'

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
      menusList: []
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
    async getMenus() {
      const res = await getMenus(this.listQuery)
      console.log(res)
      this.menusList = res.data.menus
      this.total = res.data.paginator.total
      console.log(this.menusList)
    },
    load(tree, treeNode, resolve) {
      console.log(tree, treeNode)
      getMenus({ parent_id: tree.id, page_size: 100, domain_id: this.listQuery.domain_id }).then(response => {
        resolve(response.data.menus)
      })
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
</style>
