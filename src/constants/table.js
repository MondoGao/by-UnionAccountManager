import * as R from 'ramda';
import { DateTime } from 'luxon';
import moment from 'moment';
import sysRoleData from './sysRole';

export const types = {
  string: {
    formOptions: {
      getDefaultFormValue(columnDef) {
        return '';
      },
    },
  },
  time: {
    formOptions: {
      getDefaultFormValue(columnDef) {
        return Date.now();
      },
      formValueToFieldValue(formValue) {
        return moment(formValue);
      },
      fieldValueToFormValue(fieldValue) {
        return fieldValue.valueOf();
      },
    },
    toString() {
      return 'TIME';
    },
  },
  password: {
    formOptions: {
      getDefaultFormValue(columnDef) {
        return '87542701';
      },
    },
    toString() {
      return 'PASSWORD';
    },
  },
  array: {
    formOptions: {
      getDefaultFormValue(columnDef) {
        return [];
      },
    },
  },
  object: {
    formOptions: {
      getDefaultFormValue(columnDef) {
        return {};
      },
    },
  },
  enum: {
    formOptions: {
      getDefaultFormValue(columnDef) {
        return R.keys(columnDef.values)[0];
      },
    },
    toString() {
      return 'ENUM';
    },
  },
};

const renderMilisTime = millis => DateTime.fromMillis(millis).toLocaleString(DateTime.DATE_SHORT);
const renderGender = gender => (gender === 'male' ? '男' : '女');

export const schoolColumns = {
  name: {
    title: '学校名',
    type: types.string,
  },
  class: {
    title: '班级',
    type: types.string,
  },
  major: {
    title: '专业',
    type: types.string,
  },
  college: {
    title: '学院',
    type: types.string,
  },
  IDNumber: {
    title: '学号',
    type: types.string,
  },
  dormitory: {
    title: '宿舍',
    type: types.string,
  },
  enrollTime: {
    title: '入学时间',
    type: types.time,
    tableOptions: {
      render: renderMilisTime,
    },
  },
  graduateTime: {
    title: '毕业时间',
    type: types.time,
    tableOptions: {
      render: renderMilisTime,
    },
  },
};

export const organizationColumns = {
  department: {
    type: types.array,
    children: {
      name: {
        title: '组别',
        type: types.string,
        tableOptions: {
          hasFilters: true,
        },
      },
      role: {
        title: '组别职位',
        type: types.string,
      },
    },
  },
  role: {
    title: '团队职位',
    type: types.string,
    tableOptions: {
      hasFilters: true,
    },
  },
  name: {
    title: '团队名称',
    type: types.string,
  },
  nickname: {
    title: '昵称',
    type: types.string,
  },
  mailName: {
    title: '邮箱名',
    type: types.string,
  },
  mailDomain: {
    title: '邮箱域名',
    type: types.string,
  },
  bbsName: {
    title: '论坛名',
    type: types.string,
  },
  enrollTime: {
    title: '加入冰岩',
    type: types.time,
    tableOptions: {
      render: renderMilisTime,
    },
  },
  leaveTime: {
    title: '离开冰岩',
    type: types.time,
    tableOptions: {
      render: renderMilisTime,
    },
  },
};

export const columns = {
  name: {
    title: '姓名',
    type: types.string,
    formOptions: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  accountName: {
    title: '账户名',
    type: types.string,
    formOptions: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  pwd: {
    title: '密码',
    type: types.password,
    formOptions: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  nickname: {
    title: '昵称',
    type: types.string,
  },
  hometown: {
    title: '老家',
    type: types.string,
  },
  birthday: {
    title: '生日',
    type: types.time,
  },
  homeAddress: {
    title: '家庭地址',
    type: types.string,
  },
  headImg: {
    title: '头像',
    type: types.string,
  },
  sex: {
    title: '性别',
    type: types.enum,
    tableOptions: {
      render: renderGender,
    },
    values: {
      male: '男',
      female: '女',
    },
  },
  phoneNumber: {
    title: '手机号',
    type: types.string,
    formOptions: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  email: {
    title: '邮箱',
    type: types.string,
  },
  weiboName: {
    title: '微博',
    type: types.string,
  },
  weixinName: {
    title: '微信',
    type: types.string,
  },
  QQNumber: {
    title: 'QQ',
    type: types.string,
  },
  IDCardNumber: {
    title: '身份证号',
    type: types.string,
  },
  school: {
    title: '学校',
    type: types.array,
    children: schoolColumns,
  },
  organization: {
    title: '组织',
    type: types.array,
    children: organizationColumns,
  },
  sysRole: {
    title: '系统权限',
    type: types.enum,
    formOptions: {
      initialValue: '0',
      formOptions: {
        rules: [
          {
            required: true,
          },
        ],
      },
      formValueToFieldValue(formValue) {
        return String(formValue);
      },
      fieldValueToFormValue(fieldValue) {
        return Number(fieldValue);
      },
      getDefaultFormValue(columnDef) {
        return 0;
      },
    },
    values: {
      0: sysRoleData[0].name,
      1: sysRoleData[1].name,
      2: sysRoleData[2].name,
    },
  }
};
