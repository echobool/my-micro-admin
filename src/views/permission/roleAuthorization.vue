<template>
  <div class="app-container">
    <el-row :gutter="10" type="type">
      <el-col :span="24">
        <aside>
          授权
        </aside>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="search" style="">
          <span class="sx">筛选角色：</span>
          <el-select v-model="listQuery.role_id" placeholder="请选择角色" :loading="gLoading" style="width:80%;" @change="getRolePolicies">
            <el-option-group
              v-for="group in roles"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>

        </div>
        <div class="add-role">
          <el-button :disabled="!checkPermission(['policyAdd'])" type="primary" plain @click="addAuth">新增授权</el-button>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form ref="searchForm" :inline="true" :model="searchForm" :rules="rules" class="search-form">
          <el-form-item prop="keyword">
            <el-input v-model="searchForm.keyword" class="keyword" placeholder="请输入权限名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-button v-if="!showCancelButton" icon="el-icon-search" type="primary" @click="search('searchForm')">搜索</el-button>
            <el-button v-if="showCancelButton" icon="el-icon-close" plain type="warning" @click="resetForm('searchForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" :data="rolePolicyList" :empty-text="tableEmptyText" style="width: 100%;" :highlight-current-row="true" stripe fit>

      <el-table-column align="center" label="权限">
        <template slot-scope="scope">
          {{ scope.row.policy_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限类型">
        <template slot-scope="scope">
          {{ scope.row.policy_type_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色key">
        <template slot-scope="scope">
          {{ scope.row.role_id }}
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="授权日期">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="!checkPermission(['policyEdit'])" size="mini" plain @click="authEdit(scope.row)">编辑</el-button>
          <el-button type="danger" :disabled="!checkPermission(['policyDelete'])" size="mini" plain @click="deleteConfirm(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" width="800" :total="total" :fullscreen="true" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getRolePolicies(listQuery.role_id)" />
    <el-dialog :title="'授权'" width="800px" :close-on-click-modal="false" :visible.sync="dialogTableVisible">
      <el-row :gutter="20" class="menu-row">
        <el-col :span="24">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="top" label-width="100px" class="demo-ruleForm">
            <el-form-item label="被授权角色">
              {{ roleName }}（{{ listQuery.role_id }}）
            </el-form-item>
            <el-form-item v-if="!isEdit" label="选择权限" prop="region">
              <el-input v-model="ruleForm.name" placeholder="请输入权限名称" type="primary" plain>
                <el-button slot="append" icon="el-icon-search">搜索</el-button>
              </el-input>
              <el-table
                v-loading="menuLoading"
                row-key="id"
                :data="menusList"
                style="width: 100%;margin-top:10px;"
                :highlight-current-row="true"
                border
                stripe
                fit
                lazy
                :load="load"
                :tree-props="{children: 'children', hasChildren: 'has_children'}"
                @current-change="handleCurrentChange"
              >

                <el-table-column align="center" width="150px" label="权限名称">
                  <template slot-scope="scope">
                    {{ scope.row.menu_name }}
                  </template>
                </el-table-column>
                <el-table-column align="center" width="150px" label="类别">
                  <template slot-scope="scope">
                    {{ scope.row.menu_type_name }}
                  </template>
                </el-table-column>
                <el-table-column align="header-center" label="描述">
                  <template slot-scope="scope">
                    {{ scope.row.description }}
                  </template>
                </el-table-column>

              </el-table>
              <pagination v-show="total>0" layout="prev, pager, next" width="800" :total="total" :background="false" :page.sync="menuListQuery.page" :limit.sync="menuListQuery.page_size" style="text-align:right" @pagination="getMenus" />

            </el-form-item>
            <el-form-item label="当前选中权限" prop="policy_name">
              <el-input
                v-model="ruleForm.policy_name"
                placeholder="请选择列表中的权限"
              />
            </el-form-item>
            <el-form-item v-if="menu.actions.length" label="前端操作" prop="action_keys">
              <el-checkbox-group v-model="ruleForm.action_keys" size="mini">
                <el-checkbox v-for="(action, index) in menu.actions" :key="index" border :label="action.action_name">{{ action.action_name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item v-if="menu.resources.length" label="后台资源" prop="resource_keys">
              <el-checkbox-group v-model="ruleForm.resource_keys" size="mini">
                <el-checkbox v-for="(resource, index) in menu.resources" :key="index" border :label="resource.resource_name">{{ resource.resource_name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-divider />
        <el-button :loading="submitLoading" type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="cancelForm('ruleForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList } from '@/api/role'
import { getMenus, fetchMenu } from '@/api/menu'
import { getRolePolicies, addPolicy, editPolicy, deletePolicy } from '@/api/role-policy'
import { getProperty, menuType } from '@/utils/index'
import Pagination from '@/components/Pagination'

export default {
  name: 'RolePermission',
  components: { Pagination },
  data() {
    return {
      isEdit: false,
      listLoading: false,
      gLoading: true,
      menuLoading: false,
      submitLoading: false,
      menusList: [],
      dialogTableVisible: false,
      tableEmptyText: '请选择角色',
      rolePolicyList: [],
      roles: [],
      roleIds: [],
      roleName: '',
      total: 0,
      listQuery: {
        page: 1,
        page_size: 20,
        role_id: ''
      },
      menuListQuery: {
        page: 1,
        page_size: 20,
        domain_id: ''
      },
      ruleForm: {
        role_id: '',
        policy_id: '',
        policy_name: '',
        policy_type: '',
        router_name: '',
        actions: [],
        resources: [],
        action_keys: [],
        resource_keys: []

      },
      menu: {
        domain: {},
        actions: [],
        resources: []
      },
      rules: {
        policy_name: [{
          required: true,
          message: '请选择列表中的权限',
          trigger: 'change'
        }],
        action_keys: [{
          required: true,
          message: '请选择操作',
          trigger: 'change'
        }],
        resource_keys: [{
          required: true,
          message: '请选择后台资源',
          trigger: 'change'
        }]
      },
      showCancelButton: false,
      searchForm: {
        keyword: ''
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getGroupList()
    this.listQuery.role_id = this.$route.params && this.$route.params.id
  },
  methods: {
    // 选择角色后 获取当前选中角色的所有授权的权限
    getRolePolicies(role_id) {
      this.listQuery.role_id = role_id
      this.ruleForm.role_id = role_id
      this.roleName = this.getRoleGuardName(role_id)
      this.listLoading = true
      getRolePolicies(this.listQuery).then(response => {
        this.rolePolicyList = response.data.rolePolicies

        this.rolePolicyList && this.rolePolicyList.forEach(item => {
          item.policy_type_name = menuType(item.policy_type)
        })
        this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
        this.tableEmptyText = '暂无授权，请授权'
      })
    },
    addAuth() {
      if (!this.listQuery.role_id) {
        this.$message({
          message: '请选择角色！',
          type: 'warning'
        })
        return
      }
      this.isEdit = false
      this.dialogTableVisible = true
      this.getMenus()
    },
    // 获取角色列表分组
    getGroupList() {
      this.gLoading = true
      fetchList().then(response => {
        this.roles = this.groupTostruct(response.data.domains)
        this.gLoading = false
      })
    },
    // 将角色转换成结构化数据
    groupTostruct(group) {
      const struct = []
      if (!Array.isArray(group)) {
        return struct
      }
      if (group.length > 0) {
        group.forEach(g => {
          const options = []
          if (Array.isArray(g.roles)) {
            g.roles.forEach(r => {
              options.push({ label: r.guard_name, value: r.role_name, domain_id: g.id })
            })
          }
          struct.push({ label: g.guard_name, options: options })
        })
      }
      return struct
    },
    getRoleGuardName(role_id) {
      let name = ''
      const that = this
      this.roles.forEach(item => {
        if (typeof item === 'object') {
          item.options.forEach(cItem => {
            if (role_id === cItem.value) {
              that.menuListQuery.domain_id = cItem.domain_id
              name = cItem.label
            }
          })
        }
      })
      return name
    },
    // 获取授权时权限列表
    getMenus() {
      this.menuLoading = true

      // 获取时清空上次选择的结果，不然会把不同域权限进行授权 这是不允许的
      this.menusList = []
      this.unsetMenu()
      this.unsetRuleForm()
      getMenus(this.menuListQuery).then(response => {
        if (getProperty(response.data, 'menus', '')) {
          this.menusList = response.data.menus
          this.menusList.forEach(item => {
            item.menu_type_name = menuType(item.menu_type)
          })
          this.total = getProperty(response.data.paginator, 'total', 0)
        }
        this.menuLoading = false
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
    showDetail(id) {
      return new Promise((resolve, reject) => {
        this.unsetMenu()
        fetchMenu(id).then(response => {
          this.menu.menu_name = response.data.menu.menu_name
          this.menu.router_name = response.data.menu.router_name
          this.menu.menu_type = menuType(response.data.menu.menu_type)
          this.menu.domain = response.data.menu.domain
          this.menu.description = response.data.menu.description
          this.menu.actions = getProperty(response.data.menu, 'action_arrays', [])
          this.menu.resources = getProperty(response.data.menu, 'resource_arrays', [])

          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleCurrentChange(row) {
      this.currentRow = row
      if (row) {
        this.ruleForm.policy_id = row.id
        this.ruleForm.policy_name = row.menu_name
        this.ruleForm.policy_type = row.menu_type
        this.ruleForm.router_name = row.router_name
        // 清空是为了 如果编辑时的赋值 会影响
        this.ruleForm.action_keys = []
        this.ruleForm.resource_keys = []
        this.showDetail(row.id)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 还原提交数据
          this.recoverySubmitData()
          if (!this.isEdit) {
            addPolicy(this.ruleForm).then(response => {
            // 提交成功后加载第一页数据
              this.listQuery.page = 1
              this.getRolePolicies(this.ruleForm.role_id)
              this.$message({
                message: '授权成功！',
                type: 'success'
              })
              // 初始化表单，让下次提交时为新表单 没有上次的数据
              this.submitLoading = false
              this.cancelForm('ruleForm')
            }).catch(error => {
              console.log(error)
              this.submitLoading = false
              this.cancelForm('ruleForm')
            })
          } else {
            editPolicy(this.ruleForm).then(response => {
            // 提交成功后刷新当前页数据
              this.getRolePolicies(this.ruleForm.role_id)
              this.$message({
                message: '编辑授权成功！',
                type: 'success'
              })
              // 初始化表单，让下次提交时为新表单 没有上次的数据
              this.submitLoading = false
              this.cancelForm('ruleForm')
            }).catch(error => {
              console.log(error)
              this.submitLoading = false
              this.cancelForm('ruleForm')
            })
          }
        } else {
          console.log('error submit!!')
          this.submitLoading = false
          return false
        }
      })
    },
    unsetMenu() {
      this.menu.menu_name = ''
      this.menu.router_name = ''
      this.menu.menu_type = ''
      this.menu.domain = []
      this.menu.description = ''
      this.menu.actions = []
      this.menu.resources = []
    },
    cancelForm(formName) {
      this.dialogTableVisible = false
      this.submitLoading = false
      this.$refs[formName].resetFields()
      this.unsetMenu()
      this.unsetRuleForm()
    },
    unsetRuleForm() {
      this.ruleForm.policy_id = ''
      this.ruleForm.policy_name = ''
      this.ruleForm.policy_type = ''
      this.ruleForm.actions = []
      this.ruleForm.resources = []
      this.menusList = []
    },
    deleteConfirm(row) {
      this.$confirm('您确认要移除 ' + row.policy_name + ' 该授权吗? 移除后该角色将无法操作该授权中包含的所有权限。', '是否继续?', {
        confirmButtonText: '移除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      // 进行远程操作
        deletePolicy(row.role_id, row.policy_id).then(response => {
          // 更新列表
          this.getRolePolicies(this.ruleForm.role_id)
          this.$message({
            message: '删除授限成功！',
            type: 'success'
          })
        })
      }).catch(() => {})
    },
    // 编辑授权
    authEdit(row) {
      this.isEdit = true
      this.dialogTableVisible = true
      this.ruleForm.policy_id = row.policy_id
      this.ruleForm.policy_name = row.policy_name
      this.ruleForm.policy_type = row.policy_type
      this.ruleForm.router_name = row.router_name
      const actions = getProperty(row, 'action_arrays', [])
      const resources = getProperty(row, 'resource_arrays', [])
      // 因为Checkbox 不支持绑定数组 在option 上 所以通过下面方式进行转换 在提交时转换回来
      this.ruleForm.action_keys = []
      this.ruleForm.resource_keys = []
      actions.forEach(item => {
        this.ruleForm.action_keys.push(item.action_name)
      })
      resources.forEach(item => {
        this.ruleForm.resource_keys.push(item.resource_name)
      })

      this.showDetail(row.policy_id).then(r => {

      })
    },
    recoverySubmitData() {
      console.log(this.menu.actions, this.ruleForm.action_keys)
      if (this.menu.actions && this.ruleForm.action_keys) {
        for (const action_name of this.ruleForm.action_keys) {
          console.log(action_name)
          this.menu.actions.forEach(action => {
            if (action_name === action.action_name) {
              this.ruleForm.actions.push(action)
              console.log(action)
            }
          })
        }
      }
      if (this.menu.resources && this.ruleForm.resource_keys) {
        for (const resource_name of this.ruleForm.resource_keys) {
          this.menu.resources.forEach(resource => {
            if (resource_name === resource.resource_name) {
              this.ruleForm.resources.push(resource)
            }
          })
        }
      }
    }
  }
}
</script>
<style lang="css" scoped>
  .el-dialog__wrapper >>> .el-dialog {
  margin-top: 0 !important;
  right: 0 ;
  width: 800px !important;
  position: absolute ;
  border-radius: 0 ;
  height: 100% ;
  left: auto;
  overflow-y: scroll;
}

.el-dialog__wrapper >>> .el-dialog__footer{
  text-align: left !important;
  position: relative !important;
  bottom: 0 !important;
  width:100% !important;
}

.el-dialog__wrapper >>> .el-dialog__body{
  padding-bottom: 0;
}

.el-dialog__wrapper  >>> th{
  line-height: 35px;
  padding: 0;
  }
</style>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}

.search {
  position: relative;
    width: 385px;
    display: inline-block;
}
.search .sx{
  width: 85px;
  font-size: 13px;
  font-weight: bold;
  color: #606266;
}
.add-role{
  position: relative;
    display: inline-block;
}
.dialog-bottom{
  position: absolute;
  bottom: 0;
}

.pagination-container {
    background: #fff;
    padding: 0;
    margin-top: 10px;
}
.search-form {
  text-align: right;
  .keyword {
    width: 300px;
  }
}
</style>
