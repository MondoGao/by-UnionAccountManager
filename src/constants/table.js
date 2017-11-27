export const types = {
  string: 'STRING',
  time: 'TIME',
  password: 'PASSWORD',
};

export const columns = [
  {
    title: '姓名',
  },
  {
    title: '账户名',
  },
  {
    title: '密码',
  },
  {
    title: '头像',
  },
  {
    title: '性别',
  },
  {
    title: '手机号',
  },
  {
    title: '邮箱',
  },
  {
    title: '微博',
  },
  {
    title: '微信',
  },
  {
    title: 'QQ',
  },
  {
    title: '学校',
    children: [
      {
        title: '班级',
      },
      {
        title: '专业',
      },
      {
        title: '学院',
      },
      {
        title: '学号',
      },
      {
        title: '宿舍',
      },
      {
        title: '入学时间',
      },
      {
        title: '毕业时间',
      },
    ],
  },
  // organization
  {
    title: '组织',
    children: [
      {
        title: '组别',
      },
      {
        title: '组别职位',
      },
      {
        title: '团队职位',
      },
      {
        title: '昵称',
      },
      {
        title: '邮箱名',
      },
      {
        title: '邮箱域名',
      },
      {
        title: '论坛名',
      },
      {
        title: '加入冰岩',
      },
      {
        title: '离开冰岩',
      },
    ],
  },
];
