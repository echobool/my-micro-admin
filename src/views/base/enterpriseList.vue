<template>
  <div class="app-container">
    <template>
      <aside>
        机构属于系统的公共基础模块，只能在后台进行添加管理，后期可做在前端页面进行申请开通功能。<br>

      </aside>
    </template>
    <el-row :gutter="10" type="type">
      <el-col :xs="22" :sm="22" :md="22" :lg="23" :xl="23">

        <el-form ref="searchForm" :inline="true" :model="searchForm" :rules="rules" class="search">
          <el-form-item>
            <el-button type="primary" round :disabled="!checkPermission(['CreateEnterpriseForm'])" icon="el-icon-edit" @click="openForm()">添加机构</el-button>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input v-model="searchForm.keyword" placeholder="请输入机构名称" clearable />
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
      <el-table-column label="机构名称">
        <template slot-scope="scope">
          <span>{{ scope.row.enterprise_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="logo" width="80">
        <template slot-scope="scope">
          <el-image :src="scope.row.avatar_path+'?imageView2/1/w/80/h/80'" class="user-avatar">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="机构类型" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.enterprise_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="域名">
        <template slot-scope="scope">
          <span>{{ scope.row.domain }}</span>
        </template>
      </el-table-column>

      <el-table-column label="代码" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column label="老师数量" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.staff_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程数量" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.courses_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
           <el-button plain type="primary" :disabled="!checkPermission(['EnterpriseReview'])" size="mini" style="margin-left:10px;" @click="openReviewForm(scope.row)">
            审核
          </el-button>
          <el-button plain type="primary" :disabled="!checkPermission(['EnterpriseEdit'])" size="mini" style="margin-left:10px;" @click="openForm(scope.row)">
            编辑
          </el-button>
          <el-button plain type="primary" :disabled="!checkPermission(['EnterpriseDelete'])" size="mini" style="margin-left:10px;" @click="deleteConfirm(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" style="text-align:right" @pagination="getList" />

    <el-dialog top="5vh" :title="isEdit?'编辑机构':'添加机构'" width="1000px" :visible.sync="dialogTableVisible">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="createPost-main-container">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules2" label-width="100px" class="demo-ruleForm">

              <el-form-item label="机构名称" prop="enterprise_name">
                <el-input v-model="ruleForm.enterprise_name" placeholder="机构名称" />
              </el-form-item>

              <el-form-item label="机构类型" prop="enterprise_type">
                <el-select v-model="ruleForm.enterprise_type" placeholder="请选择机构类型">
                  <el-option value="学校" >学校</el-option>
                  <el-option value="企业" >企业</el-option>
                  <el-option value="政府" >政府</el-option>
                  <el-option value="其它" >其它</el-option>
                </el-select>
              </el-form-item>

              <el-form-item  v-show="ruleForm.enterprise_type=='学校'" label="学校类型" prop="school_type">
                <el-select v-model="ruleForm.school_type" placeholder="请选择机构类型">
                  <el-option value="综合类" >综合类</el-option>
                  <el-option value="理工类" >理工类</el-option>
                  <el-option value="师范类" >师范类</el-option>
                  <el-option value="农林类" >农林类</el-option>
                  <el-option value="政法类" >政法类</el-option>
                  <el-option value="医药类" >医药类</el-option>
                  <el-option value="财经类" >财经类</el-option>
                  <el-option value="民族类" >民族类</el-option>
                  <el-option value="语言类" >语言类</el-option>
                  <el-option value="艺术类" >艺术类</el-option>
                  <el-option value="体育类" >体育类</el-option>
                  <el-option value="军事类" >军事类</el-option>
                  <el-option value="旅游类院校" >旅游类院校</el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-show="ruleForm.enterprise_type=='学校'" label="教育性质" prop="school_nature">
                <el-select v-model="ruleForm.school_nature" placeholder="请选择教育性质">
                  <el-option value="普通高等教育" >普通高等教育</el-option>
                  <el-option value="成人高等教育" >成人高等教育</el-option>
                  <el-option value="高教自学考试" >高教自学考试</el-option>
                  <el-option value="电大开放教育" >电大开放教育</el-option>
                  <el-option value="远程网络教育" >远程网络教育</el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-show="ruleForm.enterprise_type=='学校'" label="学校层次" prop="school_grade">
                <el-select v-model="ruleForm.school_grade" placeholder="请选择机构层次">
                  <el-option value="“985工程”高校" >“985工程”高校</el-option>
                  <el-option value="“211工程”高校" >“211工程”高校</el-option>
                  <el-option value="世界一流学科建设高校" >世界一流学科建设高校</el-option>
                  <el-option value="世界一流大学建设高校" >世界一流大学建设高校</el-option>
                  <el-option value="中央部属高校" >中央部属高校</el-option>
                  <el-option value="部省合建高校" >部省合建高校</el-option>
                  <el-option value="省部共建高校" >省部共建高校</el-option>
                  <el-option value="省属本科高校" >省属本科高校</el-option>
                  <el-option value="高职（高专）高校" >高职（高专）高校</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="外文名称" prop="foreign_name">
                <el-input v-model="ruleForm.foreign_name" placeholder="外文名称" />
              </el-form-item>
              <el-form-item label="机构域名" prop="domain" auto>
                <el-input v-model="ruleForm.domain" placeholder="填写机构的根域名，将用于学生登录使用" />
              </el-form-item>
              <el-form-item label="机构代码" prop="code" auto>
                <el-input v-model="ruleForm.code" placeholder="全国标准机构代码" />
              </el-form-item>

              <el-form-item label="机构介绍" prop="desc">
                <el-input v-model="ruleForm.desc" type="textarea" />
              </el-form-item>
              <el-form-item label="地址" prop="address" auto>
                <el-input v-model="ruleForm.address" placeholder="机构所在地址" />
              </el-form-item>
              <el-form-item label="联系电话" prop="phone" auto>
                <el-input v-model="ruleForm.phone" placeholder="机构的联系电话" />
              </el-form-item>
              <el-form-item label="备注" prop="note">
                <el-input v-model="ruleForm.note" type="textarea" />
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


              <el-form-item label="机构名称">
                {{ ruleForm.enterprise_name }}
              </el-form-item>
              <el-form-item label="机构类型">
                {{ ruleForm.enterprise_type }}
              </el-form-item>
              <el-form-item label="申请者职位">
                {{ ruleForm.position }}
              </el-form-item>
              <el-form-item label="申请者姓名">
                {{ ruleForm.real_name }}
              </el-form-item>
              <el-form-item label="联系电话">
                {{ ruleForm.phone }}
              </el-form-item>
              <el-form-item label="试用需求">
                {{ ruleForm.note }}
              </el-form-item>
              <el-form-item label="审核状态" prop="status">
                <el-select v-model="ruleForm.status" placeholder="请选择审核状态">
                  <el-option label="通过审核" value="ok" />
                  <el-option label="审核失败" value="fail" />
                  <el-option label="禁用" value="disabled" />
                  <el-option label="审核中" value="review" />
                  <el-option label="未审核" value="not_review" />
                  <el-option label="到期" value="expire" />
                  <el-option label="通过试用审核" value="on_trial" />
                  <el-option label="试用到期" value="trial_expire" />
                  <el-option label="申请试用" value="apply_trial" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="ruleForm.status=='fail'" label="失败原因" prop="fail_reason">
                <el-input v-model="ruleForm.fail_reason" placeholder="请填写失败原因" type="textarea" />
              </el-form-item>
              <el-form-item v-if="ruleForm.status=='disabled'" label="禁用原因" prop="disabled_reason">
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
import { addEnterprise, updateEnterprise, getInfo, fetchList, deleteEnterprise,reviewEnterprise,disabledEnterprise } from '@/api/enterprise'
import { getProperty, objectMerge } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'EnterpriseList',
  components: { Pagination },
  data() {
    return {
      id: '',
      list: null,
      total: 0,
      listLoading: true,
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
        enterprise_name: [
          {
            required: true,
            message: '请输入机构名称',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '机构名称至少4个字符',
            trigger: 'blur'
          }
        ],
        domain: [
          {
            min: 4,
            message: '域名至少4个字符',
            trigger: 'blur'
          }
        ],
        enterprise_type: [
          {
            required: true,
            message: '请选择机构类型',
            trigger: 'change'
          }
        ]
      },
      dialogTableVisible: false,
      dialogReviewVisible:false,
      ruleForm: {
        enterprise_name: '',
        foreign_name: '',
        domain: '',
        code: '',
        enterprise_type: '',
        school_nature: '',
        school_grade: '',
        school_type: '',
        desc: '',
        address: '',
        phone: '',
        note: '',
        status: '',
        real_name: '',
        position: '',
        email: '',
        fail_reason: '',
        disabled_reason:'',
        has_disabled: false
      },
      loading: false,
      isEdit: false
    }
  },

  created() {
    this.getList()
  },
  methods: {
    has_disabled(row) {
      var text = row.has_disabled ? '禁用' : '正常'
      this.$confirm('确认要将 "' + row.enterprise_name + '" 设置为' + text + '状态吗? ', '是否继续?', {
        confirmButtonText: text,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 进行远程操作
        disabledEnterprise({
          disabled: row.has_disabled
        }, row.id).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }).catch(() => {})
    },
    openForm(row) {
      this.dialogTableVisible = true

      if (row) {
        this.isEdit = true
        getInfo(row.id).then(res => {
          var enterprise = res.data.enterprise
          this.ruleForm.enterprise_name = enterprise.enterprise_name
          this.ruleForm.enterprise_type = enterprise.enterprise_type
          this.ruleForm.foreign_name = enterprise.foreign_name
          this.ruleForm.domain = enterprise.domain
          this.ruleForm.code = enterprise.code
          this.ruleForm.school_type = enterprise.school_type
          this.ruleForm.school_nature = enterprise.school_nature
          this.ruleForm.school_grade = enterprise.school_grade
          this.ruleForm.desc = enterprise.desc
          this.ruleForm.address = enterprise.address
          this.ruleForm.phone = enterprise.phone
          this.ruleForm.note = enterprise.note
          this.ruleForm.status = enterprise.status
          this.ruleForm.courses_number = enterprise.courses_number
          this.ruleForm.staff_number = enterprise.staff_number
          this.ruleForm.has_disabled = enterprise.has_disabled
          this.id = row.id
        })
        console.log(this.ruleForm)
      } else {
        this.isEdit && this.resetForm('ruleForm')
        this.isEdit = false
      }
    },

    openReviewForm(row) {
      this.dialogReviewVisible = true
      getInfo(row.id).then(res => {
        var enterprise = res.data.enterprise
        this.ruleForm.real_name = enterprise.real_name
        this.ruleForm.enterprise_name = enterprise.enterprise_name
        this.ruleForm.enterprise_type = enterprise.enterprise_type
        this.ruleForm.note = enterprise.note
        this.ruleForm.phone = enterprise.phone
        this.ruleForm.status = enterprise.status
        this.ruleForm.position = enterprise.position
        this.ruleForm.fail_reason = enterprise.fail_reason
        this.id = row.id
      })
    },
    submitReview(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true

          reviewEnterprise({
            status: this.ruleForm.status,
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
        this.list = response.data.enterprises
        this.total = getProperty(response.data.paginator, 'total', 0)
        this.listLoading = false
      })
    },
    deleteConfirm(row) {
      this.$confirm('您确认要删除 "' + row.enterprise_name + '" 该机构吗? ', '是否继续?', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 进行远程操作
        deleteEnterprise(row.id).then(response => {
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
      console.log(this.ruleForm)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            console.log(this.isEdit)
            updateEnterprise(this.ruleForm, this.id).then(response => {
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
            addEnterprise(this.ruleForm).then(response => {
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
