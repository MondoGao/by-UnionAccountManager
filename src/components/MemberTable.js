import React, { Component } from 'react';
import { Table, Button } from 'antd';
import * as R from 'ramda';
import { DateTime } from 'luxon';

import styles from './MemberTable.css';
import EditForm from './EditForm';

const getGroupName = R.path(['organization', 'department', 'name']);
const getExistGroups = R.map(getGroupName);
const getUniqExistGroups = R.compose(R.uniq, getExistGroups);

const getPosition = R.path(['organization', 'role']);
const getExistPositions = R.map(getPosition);
const getUniqExistPositions = R.compose(R.uniq, getExistPositions);

const generateTableFilter = data => ({
  text: data,
  value: data,
});
const generateTableFilters = R.map(generateTableFilter);

export default class MemberTable extends Component {
  state = {
    isFormVisible: false,
  }

  toggleForm = () => {
    this.setState(state => ({
      isFormVisible: !state.isFormVisible,
    }));
  }

  handleAddMemberClick = () => {
    this.toggleForm();
  }

  renderMilisTime = millis => DateTime.fromMillis(millis).toLocaleString(DateTime.DATE_SHORT)

  renderGender = gender => (gender === 'male' ? '男' : '女')

  renderTitle = () => (
    <div className={styles.tableTitle}>
      <h2>成员信息</h2>
      <span>
        <Button.Group>
          <Button type="primary" onClick={this.handleAddMemberClick}>增加成员</Button>
          <Button type="primary">批量上传</Button>
        </Button.Group>
      </span>
    </div>
  )

  render() {
    const columns = [
      {
        dataIndex: 'name',
        title: '姓名',
      },
      {
        dataIndex: 'organization.department.name',
        title: '组别',
        filters: R.compose(generateTableFilters, getUniqExistGroups)(this.props.data),
        onFilter: (value, record) => getGroupName(record) === value,
      },
      {
        dataIndex: 'organization.role',
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
        dataIndex: 'school.class',
        title: '班级',
      },
      {
        dataIndex: 'school.IDNumber',
        title: '学号',
      },
      {
        dataIndex: 'organization.enrollTime',
        title: '加入冰岩',
        render: this.renderMilisTime,
      },
      {
        dataIndex: 'organization.leaveTime',
        title: '毕业时间',
        render: this.renderMilisTime,
      },
    ];

    const tableConfig = {
      columns,
      rowKey: '_id',
      dataSource: this.props.data,
      title: this.renderTitle,
      scroll: {
        x: true,
      },
    };
    const editFormConfig = {
      visible: this.state.isFormVisible,
      onCancel: this.toggleForm,
      onOk: (...args) => console.log(args),
    };

    return (
      <div className={styles.tableContainer}>
        <EditForm {...editFormConfig} />
        <Table {...tableConfig} />
      </div>
    );
  }
}
