import React, { Component } from 'react';
import { Table, Button } from 'antd';
import * as R from 'ramda';
import { DateTime } from 'luxon';

import styles from './MemberTable.css';

const getGroupName = R.path(['organization', 0, 'department', '0', 'name']);
const getExistGroups = R.map(getGroupName);
const getUniqExistGroups = R.compose(R.uniq, getExistGroups);

const getPosition = R.path(['organization', 0, 'role']);
const getExistPositions = R.map(getPosition);
const getUniqExistPositions = R.compose(R.uniq, getExistPositions);

const generateTableFilter = (data) => ({
  text: data,
  value: data,
});
const generateTableFilters = R.map(generateTableFilter);

export default class MemberTable extends Component {
  renderMilisTime = millis => DateTime.fromMillis(millis).toLocaleString(DateTime.DATE_SHORT)

  renderGender = gender => gender === 'male' ? '男' : '女'

  renderTitle() {
    return (
      <div className={styles.tableTitle}>
        <h2>成员信息</h2>
        <span>
          <Button.Group>
            <Button type="primary">增加成员</Button>
            <Button type="primary">批量上传</Button>
          </Button.Group>
        </span>
      </div>
    )
  }

  render() {
    const columns = [
      {
        dataIndex: 'name',
        title: '姓名',
      },
      {
        dataIndex: 'organization.0.department.0.name',
        title: '组别',
        filters: R.compose(generateTableFilters, getUniqExistGroups)(this.props.data),
        onFilter: (value, record) => getGroupName(record) === value,
      },
      {
        dataIndex: 'organization.0.role',
        title: '职位',
        filters: R.compose(generateTableFilters, getUniqExistPositions)(this.props.data),
      },
      {
        dataIndex: 'sex',
        title: '性别',
        render: this.renderGender,
      },
      {
        dataIndex: 'phoneNumber',
        title: '手机号',
      },
      {
        dataIndex: 'email',
        title: '邮箱',
      },
      {
        dataIndex: 'school.0.class',
        title: '班级',
      },
      {
        dataIndex: 'school.0.IDNumber',
        title: '学号',
      },
      {
        dataIndex: 'organization.0.enrollTime',
        title: '加入冰岩',
        render: this.renderMilisTime,
      },
      {
        dataIndex: 'organization.0.leaveTime',
        title: '毕业时间',
        render: this.renderMilisTime,
      },
    ]

    const tableConfig = {
      columns,
      rowKey: '_id',
      dataSource: this.props.data,
      title: this.renderTitle,
    };

    return (
      <div>
        <Table {...tableConfig} />
      </div>
    );
  }
}
