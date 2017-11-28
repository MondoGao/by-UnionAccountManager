import React, { Component } from 'react';
import { Table, Button, message } from 'antd';
import * as R from 'ramda';

import styles from './MemberTable.css';
import { columns, types } from '../constants/table';
import sysRoleData, { editPermissions, createPermissions } from '../constants/sysRole';
import {
  transformColumns,
  transformFormData,
  generateTableConfig,
} from '../helpers/table';
import { canCreateMember } from '../helpers/sysRole';
import * as users from '../sources/users';
import EditForm from './EditForm';

const modes = {
  create: 'create',
  edit: 'edit',
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
      ['school', 'class'],
      ['school', 'IDNumber'],
      ['organization', 'enrollTime'],
      ['organization', 'leaveTime'],
    ],
    formData: null,
    mode: modes.create,
  }

  toggleForm = () => {
    this.setState(state => ({
      isFormVisible: !state.isFormVisible,
    }));
  }

  handleAddMemberClick = () => {
    this.setState(() => ({
      formData: null,
      mode: modes.create,
    }));

    this.toggleForm();
  }

  handleEditMemberClick = row => () => {
    this.setState(() => ({
      formData: row,
      mode: modes.edit,
    }));

    this.toggleForm();
  }

  handleModalOk = async ({ values }) => {
    const resultData = transformFormData({
      transformColumns,
      columns,
      transFun({ column, formItem }) {
        if (R.isNil(formItem)) {
          switch (column.type) {
            case types.string:
            case types.password:
              return '';
            case types.time:
              return Date.now();
            case types.object:
              return {};
            case types.array:
              return [];
            default:
              return '';
          }
        }

        if (column.type === types.time) {
          return formItem.valueOf();
        }


        return formItem;
      },
      formData: values,
    });

    const fullData = R.mergeDeepRight(this.state.formData, resultData);
    console.log(fullData);

    try {
      await users[this.state.mode](fullData);
    } catch (e) {
      message.error(e.message);
    }

    this.toggleForm();
  }

  renderEditButtons = () => {
    const { user } = this.props;

    if (!user) {
      return null;
    }

    const { sysRole } = user;
    const sysRoleDef = sysRoleData[sysRole];

    if (!canCreateMember(sysRoleDef.permissions)) {
      return null;
    }

    return (
      <span>
        <Button.Group>
          <Button type="primary" onClick={this.handleAddMemberClick}>增加成员</Button>
          <Button type="primary">批量上传</Button>
        </Button.Group>
      </span>
    );
  }

  renderTitle = () => {

    return (
      <div className={styles.tableTitle}>
        <h2>成员信息</h2>
        {this.renderEditButtons()}
      </div>
    );
  }

  renderRowActions = (row) => (
    <Button onClick={this.handleEditMemberClick(row)}>编辑</Button>
  )

  render() {
    const { selectedColomns, isFormVisible, formData } = this.state;
    const columnsConfig = R.map((columnPath) => generateTableConfig({
      columns,
      columnPath,
      data: this.props.data,
    }), selectedColomns);

    const extraColumns = [
      {
        title: '操作',
        key: '__actions',
        render: this.renderRowActions,
      }
    ]

    const tableConfig = {
      columns: [...columnsConfig, ...extraColumns],
      rowKey: '_id',
      dataSource: this.props.data,
      title: this.renderTitle,
      scroll: {
        x: true,
      },
    };
    const editFormConfig = {
      formData,
      visible: isFormVisible,
      onCancel: this.toggleForm,
      onOk: this.handleModalOk,
    };

    return (
      <div className={styles.tableContainer}>
        <EditForm {...editFormConfig} />
        <Table {...tableConfig} />
      </div>
    );
  }
}
