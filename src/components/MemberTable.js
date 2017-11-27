import React, { Component } from 'react';
import { Table, Button } from 'antd';
import * as R from 'ramda';

import styles from './MemberTable.css';
import { columns } from '../constants/table';
import EditForm from './EditForm';

const generateTableConfig = ({ columnPath, data }) => {
  const afterPath = columnPath.join('.children.').split('.');
  const column = R.path(afterPath, columns);

  const tableConfigs = {
    title: column.title,
    dataIndex: columnPath.join('.'),
  };

  if (column.tableOptions) {
    R.mapObjIndexed((config, key) => {
      if (key.indexOf('$') === 0) {
        tableConfigs[key.slice(1)] = config(data);
      } else {
        tableConfigs[key] = config;
      }
    }, column.tableOptions);
  }

  return tableConfigs;
};

export default class MemberTable extends Component {
  state = {
    isFormVisible: false,
    selectedColomns: [
      ['name'],
      ['organization', 'department', 'name'],
      ['organization', 'role'],
      ['sex'],
      ['phoneNumber'],
      ['email'],
      ['school','class'],
      ['school', 'IDNumber'],
      ['organization', 'enrollTime'],
      ['organization', 'leaveTime'],
    ],
  }

  toggleForm = () => {
    this.setState(state => ({
      isFormVisible: !state.isFormVisible,
    }));
  }

  handleAddMemberClick = () => {
    this.toggleForm();
  }


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
    const { selectedColomns, isFormVisible } = this.state;
    const columns = R.map((columnPath) => generateTableConfig({ columnPath, data: this.props.data }), selectedColomns);

    console.log(columns);

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
      visible: isFormVisible,
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
