<template>
  <div class="createPost-container">
    <el-row>
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="10">

        <aside>
          菜单是对每个域需要做管理后台而设计的。不是每个域都需要用到菜单。如：有的域是对APP的，根本没有管理界面。<br>
          . 按常理讲涉及到前端的每个路由都应该是一个菜单，只是有些不在左侧菜单中，而是隐藏。<br>
          . 菜单如果有远程请求项，会添加默认的权限资源（即用于后端验证的资源）。<br>
          . 每个菜单只能属于一个域，父级菜单不用添加资源。<br>
          . 用作父级菜单时，将不能为其添加页面控制动作，和后台访问资源。<br>
          <strong>注意：</strong> <br>
          1、此处的层级结构以前端开发为准备，这里和前端开发层级须保持一致，方便权限管理。<br>
          2、动作标识在输出时格式为：“菜单的路由名称-动作标识”，在使用时请注意。
        </aside>
        <div class="createPost-main-container">

          <el-form
            ref="ruleForm"
            v-loading="formLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(250, 250, 250, 0.8)"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="菜单类型">
              <el-radio-group v-model="ruleForm.menu_type" :disabled="isEdit">
                <!--改为提交判断是否用作父级菜单 去掉actions 和 resources 防止误操作删除了数据-->
                <el-radio label="submenu">用作页面</el-radio>
                <el-radio label="parentmenu">用作父级菜单</el-radio>
                <el-radio label="module">用作模块资源</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="所属域" prop="domain_id">
              <el-select v-model="ruleForm.domain_id" placeholder="请选择域" :loading="gLoading" @change="fetchParents">
                <el-option v-for="item in menuDomain" :key="item.id" :label="item.guard_name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="ruleForm.menu_type!='module'" label="父级菜单" prop="parent_id">
              <el-cascader
                v-model="ruleForm.parent_id"
                :options="parentMenu"
                :props="{ checkStrictly: true ,label:'menu_name',value:'id'}"
                clearable
                placeholder="请选择父级菜单,不选择将作为一级菜单"
              />
            </el-form-item>
            <el-form-item v-if="ruleForm.menu_type!='module'" label="菜单名称" prop="menu_name">
              <el-input v-model="ruleForm.menu_name" />
            </el-form-item>
            <el-form-item v-else label="模块名称" prop="menu_name">
              <el-input v-model="ruleForm.menu_name" />
            </el-form-item>
            <el-form-item v-if="ruleForm.menu_type!='module'" label="路由名称" prop="router_name">
              <el-input v-model="ruleForm.router_name" />
            </el-form-item>

            <el-form-item label="描述" prop="description">
              <el-input v-model="ruleForm.description" />
            </el-form-item>

            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="ruleForm.sort" controls-position="right" :min="1" :max="255" width="100%" />
            </el-form-item>
            <el-form-item v-if="ruleForm.menu_type=='submenu'" label="前端操作">
              <el-table :data="ruleForm.actions" style="width: 100%">
                <el-table-column prop="action_name" label="操作名称">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'actions.' + scope.$index + '.action_name'"
                      :rules="[
                        { required: true, message: '请输入操作名称', trigger: 'blur' }
                      ]"
                    >
                      <el-input v-model="scope.row.action_name" size="small" placeholder="操作名称" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="action_key" label="操作标识">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'actions.' + scope.$index + '.action_key'"
                      :rules="[
                        { required: true, message: '请输入操作标识', trigger: 'blur' }
                      ]"
                    >
                      <el-input v-model="scope.row.action_key" size="small" placeholder="操作标识" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="80" height="20">
                  <template slot="header">
                    <el-button type="success" size="mini" @click.native.prevent="addAction()">
                      新增
                    </el-button>
                  </template>
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, ruleForm.actions)">
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item v-if="ruleForm.menu_type=='submenu' || ruleForm.menu_type=='module'" label="后台资源">
              <el-table :data="ruleForm.resources" style="width: 100%">
                <el-table-column prop="resource_name" width="150" label="资源名称">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'resources.' + scope.$index + '.resource_name'"
                      :rules="[
                        { required: true, message: '请输入资源名称', trigger: 'blur' }
                      ]"
                    >
                      <el-input v-model="scope.row.resource_name" size="small" placeholder="请输入名称" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="resource_path" label="访问路径或资源名">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'resources.' + scope.$index + '.resource_path'"
                      :rules="[
                        { required: true, message: '请输入访问路径或资源名', trigger: 'blur' }
                      ]"
                    >
                      <el-input v-model="scope.row.resource_path" size="small" placeholder="访问路径或资源名" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="method" width="130" label="method">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'resources.' + scope.$index + '.method'"
                      :rules="[
                        { required: true, message: '请选择方法', trigger: 'change' }
                      ]"
                    >
                      <el-select v-model="scope.row.method" placeholder="请选择" size="small">
                        <el-option label="GET" value="GET" />
                        <el-option label="POST" value="POST" />
                        <el-option label="PUT" value="PUT" />
                        <el-option label="PATCH" value="PATCH" />
                        <el-option label="DELETE" value="DELETE" />
                        <el-option label="OPTIONS" value="OPTIONS" />
                        <el-option label="HEAD" value="HEAD" />
                        <el-option label="READ" value="READ" />
                        <el-option label="WRITE" value="WRITE" />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80" height="20">
                  <template slot="header">
                    <el-button type="success" size="mini" @click.native.prevent="addresource()">
                      新增
                    </el-button>
                  </template>
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, ruleForm.resources)">
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item>
              <el-button v-if="isEdit" type="primary" @click="submitForm('ruleForm')">提交更新</el-button>
              <el-button v-else type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button v-if="!isEdit" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>

          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  addMenu,
  addModule,
  getParentMenu,
  fetchMenu,
  updateMenu,
  updateModule
} from '@/api/menu'
import {
  fetchList
} from '../../../api/role-domain'
import { transData, getProperty, getAllParentIds } from '@/utils/index'

export default {
  name: 'CreateMenuForm',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      menuDomain: [],
      parentMenu: [],
      parentMenuSource: [], // 主要解决 服务器端parent_id 存的是最后一级  而前端需要一个数组
      parent_id: '', // 主要解决 服务器端parent_id 存的是最后一级  而前端需要一个数组
      gLoading: true,
      ruleForm: {
        domain_id: '',
        parent_id: '',
        menu_type: 'submenu',
        menu_name: '',
        router_name: '',
        description: '',
        sort: 255,
        actions: [],
        resources: []
      },
      loading: false,
      formLoading: false,
      tableData: [],
      rules: {
        domain_id: [{
          required: true,
          message: '请选择用户组',
          trigger: 'change'
        }],
        menu_name: [{
          required: true,
          message: '请输入菜单名称',
          trigger: 'blur'
        },
        {
          min: 4,
          message: '角色名称至少输入4个字符',
          trigger: 'blur'
        }
        ],
        parent_id: [{
          required: true,
          message: '请选择父级菜单',
          trigger: 'change'
        }],
        router_name: [{
          required: true,
          message: '请输入路由名称',
          trigger: 'change'
        }],
        description: [{
          required: true,
          message: '请输入描述',
          trigger: 'change'
        }]
      },
      tempRoute: {}
    }
  },
  created() {
    this.getGroupList()

    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      this.fetchData()
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    clear_actions_parents() {
      this.ruleForm.actions = []
      this.ruleForm.resources = []
    },
    fetchParents(value) {
      console.log(value)
      getParentMenu(this.ruleForm.domain_id).then(response => {
        // 将原始结构保留
        this.parentMenuSource = response.data.menus
        // 将列表数据转换成级联数据
        this.parentMenu = transData(response.data.menus, 'id', 'parent_id', 'children', { menu_name: '一级菜单', id: 1000000 })
        this.formLoading = false
        console.log(this.parentMenu)
        // 主要解决 服务器端parent_id 存的是最后一级  而前端需要一个数组
        this.ruleForm.parent_id = getAllParentIds(this.parent_id, this.parentMenuSource, '')
        console.log(this.ruleForm.parent_id)
      }).catch((err) => {
        console.log(err)
      })
    },
    getParentIds(parent_id) {
      // 查找parent_id的parent_id的parent_id 。。。。。 能找出多少级就多少级 才能进行赋值

    },
    addAction() {
      this.ruleForm.actions.push({
        action_key: '',
        action_name: ''

      })
    },
    addresource() {
      this.ruleForm.resources.push({
        resource_name: '',
        resource_path: '',
        method: ''
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    fetchData() {
      this.formLoading = true
      fetchMenu(this.id).then(response => {
        this.ruleForm.domain_id = response.data.menu.domain_id
        this.ruleForm.menu_name = response.data.menu.menu_name
        this.parent_id = getProperty(response.data.menu, 'parent_id', 1000000)
        // this.ruleForm.parent_id = [parent_id]  在下面fetchParents成功后进行处理赋值
        this.ruleForm.menu_type = response.data.menu.menu_type
        this.ruleForm.router_name = response.data.menu.router_name
        this.ruleForm.sort = getProperty(response.data.menu, 'sort', 255)
        this.ruleForm.description = response.data.menu.description
        this.ruleForm.actions = getProperty(response.data.menu, 'action_arrays', [])
        this.ruleForm.resources = getProperty(response.data.menu, 'resource_arrays', [])
        if (this.ruleForm.domain_id) {
          this.fetchParents(this.ruleForm.domain_id)
        }
        // set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑权限'
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },

    getGroupList() {
      fetchList().then(response => {
        this.menuDomain = response.data.domains
        this.gLoading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            if (this.ruleForm.menu_type === 'module') {
              updateModule(this.ruleForm, this.id).then(response => {
                this.$message({
                  message: '恭喜你，编辑权限成功',
                  type: 'success'
                })
                this.loading = false
              })
            } else {
              updateMenu(this.ruleForm, this.id).then(response => {
                this.$message({
                  message: '恭喜你，编辑权限成功',
                  type: 'success'
                })
                this.loading = false
              })
            }
          } else {
            if (this.ruleForm.menu_type === 'module') {
              addModule(this.ruleForm).then(response => {
                this.$message({
                  message: '恭喜你，添加模块成功',
                  type: 'success'
                })
                this.resetForm('ruleForm')
                this.loading = false
              })
            } else {
              addMenu(this.ruleForm).then(response => {
                this.$message({
                  message: '恭喜你，添加菜单成功',
                  type: 'success'
                })
                this.resetForm('ruleForm')
                this.loading = false
              })
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }

  }
}
</script>
<style lang="css" scoped>
  .el-table >>> th{
  line-height: 35px;
  padding: 0;
  }
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  padding: 20px 20px 20px 20px;
  position: relative;

  .createPost-main-container {
    width: 100%;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.el-cascader{
  width: 100%;
}
</style>
