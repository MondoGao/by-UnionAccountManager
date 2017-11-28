import React, { Component } from 'react';
import * as R from 'ramda';
import { Menu, Dropdown, Modal, Icon, Form, message } from 'antd';

import styles from './Login.css';
import * as users from '../sources/users';
import { types } from '../constants/table';
import {
  transformColumns,
} from '../helpers/table';
import { generateFormItemFromColumn } from '../helpers/form';

const getFormErrorMessages = R.compose(
  R.flatten,
  R.map(R.map(R.prop('message'))),
  R.map(R.prop('errors')),
  R.values,
);

@Form.create()
export default class Login extends Component {
  state = {
    isModalVisible: true,
    isModalLoading: true,
  }

  isLoginIn = () => !!this.props.user

  toggleModal = () => {
    this.setState(({ isModalVisible }) => ({
      isModalVisible: !isModalVisible,
    }));
  }

  login = async (values) => {
    try {
      await users.login(values);
    } catch (e) {
      console.log(e);
    }
  }

  handleModalOk = () => {
    const { form } = this.props;

    form.validateFields({}, (errors, values) => {
      if (!errors) {
        this.login(values);
      }
    });
  }

  renderMenu = () => {
    return (
      <Menu>
        <Menu.Item key="1">修改个人信息</Menu.Item>
        <Menu.Item key="2">注销</Menu.Item>
      </Menu>
    );
  }

  renderModal = () => {
    const { isModalVisible, isModalLoading } = this.state;
    const { form: { getFieldDecorator } } = this.props;

    const modalConfig = {
      visible: isModalVisible,
      title: '登录',
      confirmLoading: isModalLoading,
      onCancel: this.toggleModal,
      onOk: this.handleModalOk,
    };

    const columns = {
      accountType: {
        type: types.enum,
        title: '登录类型',
        values: {
          accountName: '账户名',
          weixinName: '微信名',
          weiboName: '微博名',
          phoneNumber: '手机号',
          email: '邮箱',
          QQNumber: 'QQ',
          IDCardNumber: '身份证号',
        },
        formOptions: {
          initialValue: 'accountName',
          rules: [
            {
              required: true,
            },
          ],
        },
      },
      identity: {
        type: types.string,
        title: '登录名',
        formOptions: {
          rules: [
            {
              required: true,
              message: '请输入登录名哦~填写符合登录类型的即可~',
            },
          ],
        },
      },
      pwd: {
        type: types.password,
        title: '密码',
        formOptions: {
          rules: [
            {
              required: true,
              message: '请输入密码',
            },
          ],
        },
      },
    };

    return (
      <Modal {...modalConfig}>
        <Form>
          {transformColumns({
            columns,
            ctx: { getFieldDecorator },
            generateFun: generateFormItemFromColumn,
          })}
        </Form>
      </Modal>
    );
  }

  render() {
    return (
      <Dropdown placement="bottomRight" overlay={this.renderMenu()}>
        <span className={styles.loginUser}>
          测试 <Icon type="down" />
          {this.renderModal()}
        </span>
      </Dropdown>
    );
  }
}
