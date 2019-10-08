<template>
  <div class="createPost-container">
    <el-row>
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="12">
        <Warning />
        <div class="createPost-main-container">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="180px" class="demo-ruleForm">

            <el-form-item label="模板名称" prop="template_name">
              <el-input v-model="ruleForm.template_name" />
            </el-form-item>
            <el-form-item label="模板CODE" prop="send_type">
              <el-input v-model="ruleForm.send_type" />
            </el-form-item>
            <el-form-item label="推送类型" prop="push_type">
              <el-radio v-model="ruleForm.push_type" label="MESSAGE">消息</el-radio>
              <el-radio v-model="ruleForm.push_type" label="NOTICE">通知</el-radio>
            </el-form-item>
            <el-form-item label="标题" prop="title" auto>
              <el-input v-model="ruleForm.title" />
            </el-form-item>
            <el-form-item label="内容" prop="body">
              <el-input
                v-model="ruleForm.body"
                type="textarea"
                rows="4"
                placeholder="变量格式 ${code}"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
            <el-divider content-position="left">IOS 选配参数</el-divider>
            <el-form-item label="iOS通知声音" prop="iOSMusic">
              <el-input v-model="ruleForm.config.iOSMusic" placeholder="指定存放在app bundle或沙盒Library/Sounds目录下的音频文件名" />
            </el-form-item>
            <el-form-item label="角标自增" prop="iOSBadgeAutoIncrement">
              <el-radio v-model="ruleForm.config.iOSBadgeAutoIncrement" :label="true">是</el-radio>
              <el-radio v-model="ruleForm.config.iOSBadgeAutoIncrement" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="静默通知" prop="iOSSilentNotification">
              <el-radio v-model="ruleForm.config.iOSSilentNotification" :label="true">是</el-radio>
              <el-radio v-model="ruleForm.config.iOSSilentNotification" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="通知副标题" prop="iOSSubtitle">
              <el-input v-model="ruleForm.config.iOSSubtitle" placeholder="iOS通知副标题内容（iOS 10+）" />
            </el-form-item>
            <el-form-item label="指定iOS通知Category" prop="iOSNotificationCategory">
              <el-input v-model="ruleForm.config.iOSNotificationCategory" placeholder="指定iOS通知Category（iOS 10+）" />
            </el-form-item>
            <el-form-item label="通知扩展处理" prop="iOSMutableContent">
              <el-radio v-model="ruleForm.config.iOSMutableContent" :label="true">是</el-radio>
              <el-radio v-model="ruleForm.config.iOSMutableContent" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="通知的扩展属性" prop="iOSExtParameters">
              <el-input v-model="ruleForm.config.iOSExtParameters" placeholder="iOS 10+ 可以在此指定富媒体推送通知的资源Url: {“attachment”: “https://xxxx.xxx/notification_pic.png“} (注意 : 该参数要以json map的格式传入,否则会解析出错)" />
            </el-form-item>
            <el-form-item label="消息转通知" prop="iOSRemind">
              <el-radio v-model="ruleForm.config.iOSRemind" :label="true">是</el-radio>
              <el-radio v-model="ruleForm.config.iOSRemind" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="消息转通知内容" prop="template_param">
              <el-input
                v-model="ruleForm.config.iOSRemindBody"
                type="textarea"
                rows="4"
                placeholder="iOS消息转通知时使用的iOS通知内容，仅当iOSApnsEnv=PRODUCT && iOSRemind为true时有效"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
            <el-divider content-position="left">Android 选配参数 仅作用于Android通知任务</el-divider>
            <el-form-item label="点击通知后动作" prop="AndroidOpenType">
              <el-radio v-model="ruleForm.config.AndroidOpenType" label="APPLICATION">打开应用</el-radio>
              <el-radio v-model="ruleForm.config.AndroidOpenType" label="ACTIVITY">打开应用AndroidActivity</el-radio>
              <el-radio v-model="ruleForm.config.AndroidOpenType" label="URL">打开URL</el-radio>
              <el-radio v-model="ruleForm.config.AndroidOpenType" label="NONE">无跳转</el-radio>
            </el-form-item>
            <el-form-item label="通知的提醒方式" prop="AndroidNotifyType">
              <el-radio v-model="ruleForm.config.AndroidNotifyType" label="VIBRATE">振动</el-radio>
              <el-radio v-model="ruleForm.config.AndroidNotifyType" label="SOUND">声音</el-radio>
              <el-radio v-model="ruleForm.config.AndroidNotifyType" label="BOTH">声音和振动</el-radio>
              <el-radio v-model="ruleForm.config.AndroidNotifyType" label="NONE">静音</el-radio>
            </el-form-item>
            <el-form-item label="设定通知打开的activity" prop="AndroidActivity">
              <el-input v-model="ruleForm.config.AndroidActivity" placeholder="当AndroidOpenType=“Activity“ 有效，如：com.alibaba.cloudpushdemo.bizactivity" />
            </el-form-item>
            <el-form-item label="收到推送后打开对应的url" prop="AndroidOpenUrl">
              <el-input v-model="ruleForm.config.AndroidOpenUrl" placeholder="仅当AndroidOpenType=“URL“有效" />
            </el-form-item>
            <el-form-item label="自定义通知栏样式" prop="AndroidNotificationBarType">
              <el-input-number v-model="ruleForm.config.AndroidNotificationBarType" controls-position="right" :precision="0" :min="1" :max="100" />
            </el-form-item>
            <el-form-item label="通知排列位置的优先级" prop="AndroidNotificationBarPriority">
              <el-select v-model="ruleForm.config.AndroidNotificationBarPriority" placeholder="请选择">
                <el-option :value="-2">-2</el-option>
                <el-option :value="-1">-1</el-option>
                <el-option :value="0">0</el-option>
                <el-option :value="1">1</el-option>
                <el-option :value="2">2</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="NotificationChannel参数" prop="AndroidNotificationChannel">
              <el-input v-model="ruleForm.config.AndroidNotificationChannel" placeholder="具体用途请参考常见问题：Android 8.0以上设备通知接收不到" />
            </el-form-item>
            <el-form-item label="设定通知的扩展属性" prop="AndroidExtParameters">
              <el-input
                v-model="ruleForm.config.AndroidExtParameters"
                type="textarea"
                rows="4"
                placeholder="该参数要以 json map 的格式传入,否则会解析出错"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
            <el-divider content-position="left">短信融合  (在推送失败或用户未打开时触发)</el-divider>
            <el-form-item label="模板ID" prop="SmsTemplateName">
              <el-input v-model="ruleForm.config.SmsTemplateName" />
            </el-form-item>
            <el-form-item label="短信签名" prop="SmsSignName">
              <el-input v-model="ruleForm.config.SmsSignName" />
            </el-form-item>
            <el-form-item label="短信模板的变量名值对" prop="SmsParams">
              <el-input
                v-model="ruleForm.config.SmsParams"
                type="textarea"
                rows="4"
                placeholder="短信模板的变量名值对，格式： key1=value1&key2=value2"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="触发短信的延迟时间" prop="SmsDelaySecs">
              <el-input-number v-model="ruleForm.config.SmsDelaySecs" controls-position="right" :precision="0" :min="1" :max="100" />
            </el-form-item>
            <el-form-item label="触发短信的条件" prop="SmsSendPolicy">
              <el-radio v-model="ruleForm.config.SmsSendPolicy" :label="0">推送未收到时触发</el-radio>
              <el-radio v-model="ruleForm.config.SmsSendPolicy" :label="1">用户未打开时触发</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button v-if="isEdit" :loading="loading" :disabled="form_disabled" type="primary" @click="submitForm('ruleForm')">提交更新</el-button>
              <el-button v-else :loading="loading" :disabled="form_disabled" type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button v-if="!isEdit" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Warning from './WarningPush'
import { addPushTemplate, fetchPushTemplate, updatePushTemplate } from '@/api/message'
import { getProperty } from '@/utils/index'
// eslint-disable-next-line

export default {
  name: 'CreatePushTemplateForm',
  components: {
    Warning
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gLoading: true,
      ruleForm: {
        template_name: '',
        send_type: '',
        push_type: 'MESSAGE',
        title: '',
        body: '',
        config: {
          iOSMusic: '',
          iOSBadgeAutoIncrement: false,
          iOSSilentNotification: false,
          iOSSubtitle: '',
          iOSNotificationCategory: '',
          iOSMutableContent: false,
          iOSExtParameters: '',
          iOSRemind: false,
          iOSRemindBody: '',
          AndroidOpenType: 'APPLICATION',
          AndroidNotifyType: 'VIBRATE',
          AndroidActivity: '',
          AndroidOpenUrl: '',
          AndroidNotificationBarType: 1,
          AndroidNotificationBarPriority: 0,
          AndroidNotificationChannel: '',
          AndroidExtParameters: '',
          SmsTemplateName: '',
          SmsSignName: '',
          SmsParams: '',
          SmsDelaySecs: 15,
          SmsSendPolicy: 0
        },
        template_param: ''
      },
      loading: false,
      form_disabled: false,
      rules: {

        template_name: [
          {
            required: true,
            message: '请输入模板名称',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '模板名称至少4个字符',
            trigger: 'blur'
          }
        ],
        send_type: [
          {
            required: true,
            message: '请输入模板CODE',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '模板CODE至少4个字符且在系统中保持唯一',
            trigger: 'blur'
          }
        ],
        title: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        }],
        body: [{
          required: true,
          message: '请输入内容',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    // 如果是编辑模式 需要加载初始数据
    if (this.isEdit) {
      this.form_disabled = true
      this.id = this.$route.params && this.$route.params.id
      this.fetchData()

      this.tempRoute = Object.assign({}, this.$route)
    }
  },
  methods: {
    fetchData() {
      fetchPushTemplate(this.id).then(response => {
        this.ruleForm.template_name = getProperty(response.data.Template, 'name', '')
        this.ruleForm.send_type = getProperty(response.data.Template, 'send_type', '')
        this.ruleForm.push_type = getProperty(response.data.Template, 'push_type', '')
        this.ruleForm.title = getProperty(response.data.Template, 'title', '')
        this.ruleForm.config = getProperty(response.data.Template, 'configs', this.ruleForm.config)
        this.ruleForm.config.AndroidNotificationBarType = this.ruleForm.config.AndroidNotificationBarType ? this.ruleForm.config.AndroidNotificationBarType : 0
        this.ruleForm.config.AndroidNotificationBarPriority = this.ruleForm.config.AndroidNotificationBarPriority ? this.ruleForm.config.AndroidNotificationBarPriority : 0
        this.ruleForm.config.SmsSendPolicy = this.ruleForm.config.SmsSendPolicy ? 1 : 0
        this.ruleForm.body = response.data.Template.body
        this.ruleForm.template_param = response.data.Template.template_param
        // set tagsview title
        this.setTagsViewTitle()
        this.form_disabled = false
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑推送模板'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updatePushTemplate(this.ruleForm, this.id).then(response => {
              this.$message({
                message: '恭喜你，编辑模板成功',
                type: 'success'
              })
              this.loading = false
            })
          } else {
            addPushTemplate(this.ruleForm).then(response => {
              this.$message({
                message: '恭喜你，添加模板成功',
                type: 'success'
              })
              this.resetForm('ruleForm')
              this.loading = false
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
    }
  }
}

</script>

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
</style>
