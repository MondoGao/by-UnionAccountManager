import React, { Component } from 'react';
import { Table, Checkbox, Button, message } from 'antd';
import * as R from 'ramda';

import styles from './MemberTable.css';
import { columns } from '../constants/table';
import sysRoleData from '../constants/sysRole';
import {
  transformColumns,
  transformFormData,
  generateTableConfig,
  getColumnOrTypeProp,
} from '../helpers/table';
import { canCreateMember } from '../helpers/sysRole';
import * as users from '../sources/users';
import EditForm from './EditForm';

const modes = {
  create: 'create',
  edit: 'update',
};
const allColumnsWithPath = transformColumns({
  columns,
  generateFun({ column: columnDef, path }) {
    return {
      ...columnDef,
      path,
    };
  },
  willAddArrayIndex: false,
});

const pathArrToDotStr = path => path.join('.');
const dotStrToPathArr = dotStr => dotStr.split('.');

export default class MemberTable extends Component {
  state = {
    isFormVisible: false,
    selectedColumns: [
      'name',
      'organization.department.name',
      'organization.role',
      'sex',
      'phoneNumber',
      'email',
      'school.class',
      'school.IDNumber',
      'organization.enrollTime',
      'organization.leaveTime',
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

  handleGrantMemberClick = row => async () => {
    if (row.sysRole < 1) {
      await users.update({
        ...row,
        sysRole: 1,
      });

      message.success('设置管理员成功');
      this.props.freshData();
    } else {
      message.info('已经是管理员啦！再设置要登天喽~');
    }
  }

  handleModalOk = async ({ values }) => {
    const resultData = transformFormData({
      transformColumns,
      columns,
      transFun({ column, formItem }) {
        if (R.isNil(formItem)) {
          const getDefaultFormValue = getColumnOrTypeProp({
            columnDef: column,
            path: ['formOptions', 'getDefaultFormValue']
          });

          if (getDefaultFormValue) {
            return getDefaultFormValue(column);
          }

          return '';
        }

        const fieldValueToFormValue = getColumnOrTypeProp({
          columnDef: column,
          path: ['formOptions', 'fieldValueToFormValue'],
        });

        if (fieldValueToFormValue) {
          return fieldValueToFormValue(formItem);
        }

        return formItem;
      },
      formData: values,
    });

    const fullData = R.mergeDeepRight(this.state.formData, resultData);
    console.log(fullData);

    try {
      await users[this.state.mode](fullData);
      this.props.freshData();
    } catch (e) {
      message.error(e.message);
    }

    this.toggleForm();
  }

  handleSelectedColumnsUpdate = (selectedColumns) => {
    this.setState(() => ({
      selectedColumns,
    }));
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

  renderColumnnSelectItem = ({ path, title }) => (
    <Checkbox
      className={styles.ckbColumnSelect}
      key={pathArrToDotStr(path)}
      value={pathArrToDotStr(path)}
    >
      {title}
    </Checkbox>
  )

  renderColumnsSelect = () => (
    <Checkbox.Group 
      className={styles.ckbGroupColumnSelect}
      value={this.state.selectedColumns}
      onChange={this.handleSelectedColumnsUpdate}
    >
      {R.compose(
        R.map(this.renderColumnnSelectItem),
        R.filter(columnDef => !getColumnOrTypeProp({
          columnDef,
          path: ['tableOptions', 'isHidden'],
        })),
      )(allColumnsWithPath)}
    </Checkbox.Group>
  )

  renderTitle = () => (
    <div className={styles.tableTitle}>
      <h2>成员信息</h2>
      {this.renderEditButtons()}
      {this.renderColumnsSelect()}
    </div>
  );

  renderRowActions = (row) => (
    <Button.Group>
      <Button onClick={this.handleEditMemberClick(row)}>编辑</Button>
      <Button onClick={this.handleGrantMemberClick(row)}>设为管理员</Button>
    </Button.Group>
  )

  render() {
    const { selectedColumns, isFormVisible, formData } = this.state;
    const columnsConfig = R.map((columnPath) => generateTableConfig({
      columns,
      columnPath,
      data: this.props.data,
    }), R.map(dotStrToPathArr, selectedColumns));


    const extraColumns = [
      {
        title: '操作',
        key: '__actions',
        render: this.renderRowActions,
      }
    ];

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
