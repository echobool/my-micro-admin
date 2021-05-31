<template>
  <div class="app-container">
    <template>
      <aside>
        老师 属于系统的公共基础模块，只能在后台进行添加管理，后期可做在前端页面进行申请开通功能。<br>

      </aside>
    </template>
    <el-row :gutter="10" type="type">
      <el-col :xs="22" :sm="22" :md="22" :lg="23" :xl="23">

        <el-form ref="searchForm" :inline="true" :model="searchForm" :rules="rules" class="search">
          <el-form-item>
            <el-button type="primary" round :disabled="!checkPermission(['CreateTeacherForm'])" icon="el-icon-edit" @click="openForm()">添加老师 </el-button>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input v-model="searchForm.keyword" placeholder="请输入老师名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-button v-if="!showCancelButton" icon="el-icon-search" type="primary" @click="search('searchForm')">搜索</el-button>
            <el-button v-if="showCancelButton" icon="el-icon-close" plain type="warning" @click="resetForm('searchForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--刷新-->
      <el-col :xs="2" :sm="2" :md="2" :lg="1" :xl="1" style="text-align:right">
        <el-button circle type="primary" icon="el-icon-refresh" @click="refresh()" />
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :highlight-current-row="true" :data="list" stripe fit style="width: 100%">
      <el-table-column label="老师姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.real_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所在机构" width="400">
        <template slot-scope="scope">
          <span>{{ scope.row.enterprise_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID">
        <template slot-scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="教师级别">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核状态">
        <template slot-scope="scope">
          <span>{{ scope.row.review|reviewStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button plain type="primary" :disabled="!checkPermission(['TeacherReview'])" size="mini" style="margin-left:10px;" @click="openReviewForm(scope.row)">
            审核
          </el-button>
          <el-button plain type="primary" :disabled="!checkPermission(['TeacherEdit'])" size="mini" style="margin-left:10px;" @click="openForm(scope.row)">
            编辑
          </el-button>
          <el-button plain type="primary" :disabled="!checkPermission(['TeacherDelete'])" size="mini" style="margin-left:10px;" @click="deleteConfirm(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getList" />

    <el-dialog :title="isEdit?'编辑老师 ':'添加老师 '" width="600px" :visible.sync="dialogTableVisible">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="createPost-main-container">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules2" label-width="100px" class="demo-ruleForm">

              <el-form-item label="老师姓名" prop="real_name">
                <el-input v-model="ruleForm.real_name" placeholder="老师姓名" />
              </el-form-item>
              <el-form-item label="所在机构" prop="enterprise_id">
                <el-select clearable
                  v-model="ruleForm.enterprise_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入机构名称关键字搜索"
                  :remote-method="remoteMethod"
                  :loading="selectloading"
                >
                  <el-option
                    v-for="item in select_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="老师级别" prop="level">
                <el-select v-model="ruleForm.level" placeholder="请选择老师级别">
                  <el-option value="">请选择级别</el-option>
                  <el-option value="二级教师">二级教师</el-option>
                  <el-option value="一级教师">一级教师</el-option>
                  <el-option value="高级教师">高级教师</el-option>
                  <el-option value="正高级教师">正高级教师</el-option>
                  <el-option value="助教">助教</el-option>
                  <el-option value="讲师">讲师</el-option>
                  <el-option value="副教授">副教授</el-option>
                  <el-option value="教授">教授</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="老师简介" prop="introduction">
                <el-input v-model="ruleForm.introduction" type="textarea" />
              </el-form-item>

              <el-form-item label="联系电话" prop="phone" auto>
                <el-input v-model="ruleForm.phone" placeholder="老师的联系电话" />
              </el-form-item>
              <el-form-item label="试讲视频地址" prop="video_url" auto>
                <el-input v-model="ruleForm.video_url" placeholder="试讲视频地址" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')">提交</el-button>
                <el-button :disabled="isEdit" @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>

    </el-dialog>

    <el-dialog title="审核" width="600px" :visible.sync="dialogReviewVisible">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="createPost-main-container">
            <el-form ref="ruleForm2" :model="ruleForm" :rules="rules2" label-width="100px" class="demo-ruleForm">

              <el-form-item label="老师姓名">
                {{ ruleForm.real_name }}
              </el-form-item>
              <el-form-item label="所在机构">
                {{ ruleForm.enterprise_name }}
              </el-form-item>
              <el-form-item label="老师级别">
                {{ ruleForm.level }}
              </el-form-item>
              <el-form-item label="老师简介">
                {{ ruleForm.introduction }}
              </el-form-item>
              <el-form-item label="联系电话">
                {{ ruleForm.phone }}
              </el-form-item>
              <el-form-item label="试讲视频地址">
                {{ ruleForm.video_url }}
              </el-form-item>
              <el-form-item label="审核状态" prop="review">
                <el-select v-model="ruleForm.review" placeholder="请选择审核状态">
                  <el-option label="通过审核" value="ok" />
                  <el-option label="审核失败" value="fail" />
                  <el-option label="禁用" value="disabled" />
                  <el-option label="审核中" value="review" />
                  <el-option label="未审核" value="not_review" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="ruleForm.review=='fail'" label="失败原因" prop="fail_reason">
                <el-input v-model="ruleForm.fail_reason" placeholder="请填写失败原因" type="textarea" />
              </el-form-item>
              <el-form-item v-if="ruleForm.review=='disabled'" label="禁用原因" prop="disabled_reason">
                <el-input v-model="ruleForm.disabled_reason" placeholder="请填写禁用原因" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="loading" @click="submitReview('ruleForm2')">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  .banner-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .banner-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .banner-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 600px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .banner {
    width: 600px;
    height: 100px;
    display: block;
  }
</style>
<script>
import { addTeacher, updateTeacher, getInfo, fetchList, deleteTeacher, reviewTeacher } from '@/api/teacher'
import { fetchList as fetchEnterpriseList } from '@/api/enterprise'
import { getProperty, objectMerge } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'TeacherList',
  components: { Pagination },
  filters: {
    reviewStatus: (val) => {
      var text
      switch (val) {
        case 'ok':
          text = '审核通过'
          break
        case 'fail':
          text = '审核失败'
          break
        case 'disabled':
          text = '禁用'
          break
        case 'review':
          text = '审核中'
          break
        case 'not_review':
          text = '未审核'
          break
      }
      return text
    }
  },

  data() {
    return {
      id: '',
      list: null,
      total: 0,
      listLoading: true,
      select_options: [],
      listQuery: {
        page: 1,
        page_size: 20
      },
      searchForm: {
        keyword: ''
      },
      showCancelButton: false,

      rules: {
        keyword: [
          { required: true, message: '请输入搜索值', trigger: 'blur' }
        ],
        searchType: [
          { required: true, message: '请选择搜索类型', trigger: 'change' }
        ]
      },
      rules2: {
        real_name: [
          {
            required: true,
            message: '请输入老师姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            message: '老师姓名至少4个字符',
            trigger: 'blur'
          }
        ],
        level: [
          {
            required: true,
            message: '请选择老师级别',
            trigger: 'change'
          }
        ],
        introduction: [
          {
            required: true,
            message: '请填写老师简介',
            trigger: 'blur'
          }
        ],
        phone: [{
          required: true,
          message: '请输入老师 联系电话',
          trigger: 'blur'
        }]
      },
      dialogTableVisible: false,
      dialogReviewVisible: false,
      ruleForm: {
        real_name: '',
        enterprise_id: '',
        introduction: '',
        review: '',
        level: '',
        phone: '',
        video_url: ''
      },
      loading: false,
      isEdit: false,
      selectloading: false
    }
  },

  created() {
    this.getList()
  },
  methods: {

    remoteMethod(query) {
      if (query !== '') {
        this.selectloading = true

        this.select_options = []
        fetchEnterpriseList({
          page: 1,
          page_size: 20,
          keyword: query
        }).then((response) => {
          this.selectloading = false
          const enterprises = response.data.enterprises
          enterprises && enterprises.forEach(item => {
            this.select_options.push({
              value: item.id,
              label: item.enterprise_name
            })
          })

          console.log(response)
        })
      } else {
        this.select_options = []
      }
    },

    openForm(row) {
      this.dialogTableVisible = true
      this.select_options = []
      if (row) {
        this.isEdit = true
        getInfo(row.id).then(res => {
          var teacher = res.data.teacher
          this.ruleForm.real_name = teacher.real_name
          this.ruleForm.enterprise_id = teacher.enterprise_id
          this.ruleForm.introduction = teacher.introduction
          this.ruleForm.level = teacher.level
          this.ruleForm.phone = teacher.phone
          this.ruleForm.video_url = teacher.video_url
          this.id = row.id
          this.select_options.push({
            value: teacher.enterprise_id,
            label: teacher.enterprise_name
          })
        })
      } else {
        this.isEdit && this.resetForm('ruleForm')
        this.isEdit = false
      }
    },

    openReviewForm(row) {
      this.dialogReviewVisible = true
      getInfo(row.id).then(res => {
        var teacher = res.data.teacher
        this.ruleForm.real_name = teacher.real_name
        this.ruleForm.enterprise_name = teacher.enterprise_name
        this.ruleForm.introduction = teacher.introduction
        this.ruleForm.level = teacher.level
        this.ruleForm.phone = teacher.phone
        this.ruleForm.review = teacher.review
        this.ruleForm.video_url = teacher.video_url
        this.ruleForm.fail_reason = teacher.fail_reason
        this.ruleForm.disabled_reason = teacher.disabled_reason
        this.id = row.id
      })
    },
    refresh() {
      this.listQuery.page = 1
      this.listQuery.page_size = 20
      this.getList()
    },
    getList() {
      this.listLoading = true
      if (this.searchForm.keyword) {
        // 查询时合并搜索请求
        this.listQuery = objectMerge(this.listQuery, this.searchForm)
        this.showCancelButton = true
      } else {
        // 否则删除合并的搜索项
        delete this.listQuery.keyword
        delete this.listQuery.searchType
      }

      fetchList(this.listQuery).then(response => {
        this.list = response.data.teachers
        this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
      })
    },
    deleteConfirm(row) {
      this.$confirm('您确认要删除 "' + row.real_name + '" 该老师 吗? ', '是否继续?', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 进行远程操作
        deleteTeacher(row.id).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {})
    },
    search(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getList()
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            console.log(this.isEdit)
            updateTeacher(this.ruleForm, this.id).then(response => {
              this.$message({
                message: '恭喜你，更新成功',
                type: 'success'
              })
              this.loading = false
              this.dialogTableVisible = false
              this.getList()
            }).catch(e => {
              this.loading = false
              console.log(e)
            })
          } else {
            addTeacher(this.ruleForm).then(response => {
              this.$message({
                message: '恭喜你，添加配置并发布成功',
                type: 'success'
              })
              this.resetForm('ruleForm')
              this.loading = false
              this.dialogTableVisible = false
              this.getList()
            }).catch(e => {
              this.loading = false
              console.log(e)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitReview(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true

          reviewTeacher({
            review: this.ruleForm.review,
            fail_reason: this.ruleForm.fail_reason,
            disabled_reason: this.ruleForm.disabled_reason
          }, this.id).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.loading = false
            this.dialogReviewVisible = false
            this.getList()
          }).catch(e => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()

      if (formName === 'searchForm') {
        this.showCancelButton = false
        this.getList()
      }
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

.editor-container{
  position: relative;
  height: 300px;
  overflow:scroll;
  line-height: 125%;

}
</style>
