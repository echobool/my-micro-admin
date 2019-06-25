<template>
  <div class="app-container">
    <el-row :gutter="10" type="type">
      <aside>
        用户角色是域下的再次划分，不同的角色用户在不同域下有不同的访问权限。<br>
        如：后台账务管理员是后台管理域下的角色。<br>
        用户可以拥有不同域下面的多个角色。<br>
        如果角色下存在用户，角色将不能删除，删除前请确保角色下无用户。
      </aside>
      <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="10">
        <div class="add-role">
          <router-link :to="'/permission/role/create/'">
            <el-button type="primary" round>添加角色</el-button>
          </router-link>
        </div>
      </el-col>

    </el-row>
    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" :highlight-current-row="true" stripe fit>

      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.role_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属域">
        <template slot-scope="scope">
          {{ scope.row.domain.guard_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色别名">
        <template slot-scope="scope">
          {{ scope.row.guard_name }}
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
          <el-button type="primary" size="mini" plain @click="$router.push({name: 'RoleEditForm',params: {id:scope.row.id}})">编辑</el-button>
          <el-button type="danger" size="mini" plain @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>

import { getRoles } from '@/api/role'

export default {
  name: 'RolePermission',
  data() {
    return {

      rolesList: []
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      console.log(res)
      this.rolesList = res.data.roles
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
