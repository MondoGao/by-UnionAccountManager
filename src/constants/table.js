export const types = {
  string: 'STRING',
  time: 'TIME',
  password: 'PASSWORD',
  array: 'ARRAY',
  object: 'OBJECT',
};

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
  },
  graduateTime: {
    title: '毕业时间',
    type: types.time,
  },
};

export const organizationColumns = {
  department: {
    type: types.object,
    children: {
      name: {
        title: '组别',
        type: types.string,
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
  },
  leaveTime: {
    title: '离开冰岩',
    type: types.time,
  },
};

export const columns = {
  name: {
    title: '姓名',
    type: types.string,
  },
  accountName: {
    title: '账户名',
    type: types.string,
  },
  pwd: {
    title: '密码',
    type: types.password,
  },
  headImg: {
    title: '头像',
    type: types.string,
  },
  sex: {
    title: '性别',
    type: types.string,
  },
  phoneNumber: {
    title: '手机号',
    type: types.string,
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
  hometown: {
    title: '老家',
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
};
