<template>
  <div class="app-container">
    <el-row :gutter="10" type="type">
      <el-col :xs="22" :sm="22" :md="22" :lg="23" :xl="23">
        <el-form
          ref="searchForm"
          :inline="true"
          :model="searchForm"
          :rules="rules"
          class="search"
        >
          <el-form-item>
            <el-button
              type="primary"
              round
              :disabled="!checkPermission(['CreateCategory'])"
              icon="el-icon-edit"
              @click="openForm()"
              >添加分类</el-button
            >
          </el-form-item>
          <el-form-item label="查找分类" prop="cate_type">
            <el-select
              v-model="searchForm.cate_type"
              @change ="search('searchForm')"
              style="width: 150px"
              placeholder="类别"
            >
              <el-option label="慕课" value="mooc" />
              <el-option label="国家精品" value="quality" />
              <el-option label="职业培训" value="train" />
              <el-option label="测试平台分类" value="test" />
            </el-select>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入内容"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="!showCancelButton"
              icon="el-icon-search"
              type="primary"
              @click="search('searchForm')"
              >搜索</el-button
            >
            <el-button
              v-if="showCancelButton"
              icon="el-icon-close"
              plain
              type="warning"
              @click="resetForm('searchForm')"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <!--刷新-->
      <el-col :xs="2" :sm="2" :md="2" :lg="1" :xl="1" style="text-align: right">
        <el-button
          circle
          type="primary"
          icon="el-icon-refresh"
          @click="refresh()"
        />
      </el-col>
    </el-row>

    <el-table
      :data="list"
      v-loading="listLoading"
      row-key="id"
      :highlight-current-row="true"
      stripe
      fit
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'has_children'}"
      style="width: 100%"
    >
      <el-table-column label="分类名称">
        <template slot-scope="scope">
          <span>{{ scope.row.cate_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别">
        <template slot-scope="scope">
          <span>{{ scope.row.cate_type }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建日期">
        <template slot-scope="scope">
          <span>{{
            scope.row.created_at | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新日期">
        <template slot-scope="scope">
          <span>{{
            scope.row.updated_at | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">

            <el-button
                :disabled="!checkPermission(['EditUserForm'])"
                @click="openForm(scope.row)"
                size="mini" plain type="primary">
              编辑
            </el-button>

          <el-button
            plain
            type="danger"
            :disabled="!checkPermission(['UserDelete'])"
            size="mini"
            style="margin-left: 10px"
            @click="deleteConfirm(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      style="text-align: right"
      @pagination="getList"
    />
    <el-dialog
      :title="'添加分类'"
      width="600px"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal=false
    >
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="createPost-main-container">
            <el-form
              ref="cateForm"
              :model="cateForm"
              :rules="rules2"
              label-width="100px"
              class="demo-cateForm"
            >
              <el-form-item label="类别" prop="cate_type" auto>
                <el-radio-group v-model="cateForm.cate_type" @change="fetchParents">
                <el-radio label="mooc">慕课</el-radio>
                <el-radio label="quality">国家精品</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="分类名称" prop="cate_name">
                <el-input
                  v-model="cateForm.cate_name"
                  placeholder="分类名称"
                />
              </el-form-item>
              <el-form-item label="上级分类" prop="parent_id" auto>
                <el-cascader style="width:100%"
                v-model="cateForm.parent_id"
                :key = "isResouceShow"
                :options="formList"
                :props="{checkStrictly:true, emitPath:false, label:'cate_name',value:'id'}"
                clearable
                placeholder="请选择父级菜单"
                />
              </el-form-item>
              <el-form-item label="排序" prop="sort" auto>
                <el-input-number v-model="cateForm.sort" controls-position="right" :min="1" :max="255"></el-input-number>
              </el-form-item>
              <el-form-item label="是否显示" prop="enabled">
                <el-switch v-model="cateForm.enabled" />
                <span style="padding-left: 20px">关闭分类将不会在前台显示。</span>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  :loading="loading"
                  @click="submitForm('cateForm')"
                  >保存</el-button
                >
                <el-button :disabled="isEdit" @click="resetForm('cateForm')"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  addCategory,
  fetchList,
  fetchCategory,
  updateCategory,
  deleteCategory,
  getParentCategory,
} from "@/api/course-category";
import { getProperty, objectMerge,transData, getAllParentIds } from "@/utils/index";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "CateList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      id:0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20,
      },
      searchForm: {
        keyword: "",
        cate_type: "",
      },
      showCancelButton: false,
      rules: {
       // keyword: [{ required: true, message: "请输入搜索值", trigger: "blur" }],
        cate_type: [
          { required: true, message: "请选择搜索类型", trigger: "change" },
        ],
      },
      formList:[],
      rules2: {
        cate_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            min: 2,
            message: '分类名称至少4个字符',
            trigger: 'blur'
          }
        ],
        cate_type: [
          {
            required: true,
            message: '请输入分类类型',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '分类类型至少4个字符',
            trigger: 'blur'
          }
        ],
        parent_id: [{
          required: true,
          message: '请选择父级分类',
          trigger: 'blur'
        }]
      },
      dialogTableVisible: false,
      cateForm: {
        cate_name: "",
        cate_type: "",
        parent_id: 0,
        enabled: true,
        sort: 255,
      },
      loading: false,
      formLoading: false,
      isEdit: false,
      isResouceShow:0,
    };
  },

  created() {
    this.getList();
  },
  methods: {
    openForm(row) {
      this.dialogTableVisible = true;
      if (row) {
        this.isEdit = true;
        fetchCategory(row.id).then((res) => {
          var category = res.data.category;
          this.cateForm.cate_type = category.cate_type;
          this.cateForm.cate_name = category.cate_name;
          this.cateForm.parent_id = getProperty(category, 'parent_id', 1000000);
          this.cateForm.enabled = category.enabled;
          this.cateForm.sort = category.sort;
          this.id = row.id;
          console.log(category.enabled)
          this.fetchParents(category.cate_type)
        });
      } else {
        this.isEdit = false;
        this.cateForm.cate_type = "";
        this.cateForm.cate_name = "";
        this.cateForm.parent_id = "";
      }
    },
    refresh() {
      this.listQuery.page = 1;
      this.listQuery.page_size = 20;
      this.getList();
    },
    load(tree, treeNode, resolve) {
      fetchList({ parent_id: tree.id, page_size: 100 }).then(response => {
        const categories = getProperty(response.data, 'categories', [])

        resolve(categories)
      })
    },
    fetchParents(value) {
      // 这两句是处理 上级分类在切换数据时控制台会报错，因为this.cateForm.parent_id 和数据里面的不匹配导致 this.isResouceShow是为了让级联重新渲染
      this.isResouceShow++

      getParentCategory(value).then(response => {
        // 将原始结构保留
        this.parentCategorySource = getProperty(response.data, 'categories', [])
        // 分类中删除自己 因为自己的父类不能是自己
        if (Array.isArray(this.parentCategorySource)) {
          this.parentCategorySource.forEach((item,index)=> {
          if (item.id !==1000000 && item.id == this.id) {
             this.parentCategorySource.splice(index, 1)
          }
        });
        }

        // 将列表数据转换成级联数据
        this.formList = transData(this.parentCategorySource, 'id', 'parent_id', 'children', { cate_name: '一级分类', id: 1000000 })
        console.log(this.formList)
        this.formLoading = false
        this.dialogTableVisible = true;
      }).catch((err) => {
        console.log(err)
      })
    },
    getList() {
      this.listLoading = true;
      if (this.searchForm.keyword || this.searchForm.cate_type) {
        // 查询时合并搜索请求
        this.listQuery = objectMerge(this.listQuery, this.searchForm);
        this.showCancelButton = true;
      } else {
        // 否则删除合并的搜索项
        delete this.listQuery.keyword;
        delete this.listQuery.cate_type;
      }

      fetchList(this.listQuery).then((response) => {
        this.list = response.data.categories;
        this.total = getProperty(response.data.paginator, "total", 0);
        this.listLoading = false;
      });
    },
    deleteConfirm(row) {

      this.$confirm(
        "您确认要删除 \"" + row.cate_name + "\" 该分类吗? ",
        "是否继续?",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          // 进行远程操作
          deleteCategory(row.id).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {});
    },
    search(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getList();
        } else {
          // console.log('error submit!!')
          return false;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
              updateCategory(this.cateForm, this.id).then(response => {
                this.$message({
                  message: '编辑分类成功',
                  type: 'success'
                })
                this.loading = false
                this.dialogTableVisible = false
              })
          } else {
              addCategory(this.cateForm).then(response => {
                this.$message({
                  message: '添加分类成功',
                  type: 'success'
                })
                this.resetForm('cateForm')
                this.loading = false
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetsubmitForm(formName) {
      this.$refs[formName].resetFields()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.searchForm.keyword = "";
      this.searchForm.cate_type = "";
      this.showCancelButton = false;
      this.listQuery.page = 1;
      this.getList();
    },
  },
};
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
.el-card {
  border-radius: 0;
  margin-bottom: 15px;
}

.el-card__body {
  padding: 2px 5px;
}

.search {
  margin-left: 15px;
}

.add-user {
  float: left;
}
</style>
