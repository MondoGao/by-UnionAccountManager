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
    isModalVisible: false,
    isModalLoading: true,
  }

  componentDidMount() {
    if (!this.props.user) {
      this.readLoginFromLocalStorage();
    }
  }

  isLoginIn = () => !!this.props.user

  getUserName = () => this.isLoginIn() ? this.props.user.accountName : '请登录'

  loadModal = () => {
    this.setState(() => ({
      isModalLoading: true
    }));
  }

  exitLoadingModal = () => {
    this.setState(() => ({
      isModalLoading: false,
    }));
  }

  toggleModal = () => {
    this.setState(({ isModalVisible }) => ({
      isModalVisible: !isModalVisible,
    }));
  }

  hideModal = () => {
    this.setState(({ isModalVisible }) => ({
      isModalVisible: false,
    }));
  }

  showModal = () => {
    this.setState(({ isModalVisible }) => ({
      isModalVisible: true,
    }));

  }

  validateToken = async () => {
    await users.getList();
  }

  readLoginFromLocalStorage = async () => {
    const token = window.localStorage.getItem('token');
    const user = window.localStorage.getItem('user');

    if (token && user) {
      try {
        await this.validateToken();

        this.props.onLoginUserChange(JSON.parse(user));

        this.hideModal();
      } catch (e) {
        this.showModal();
      }
    }

    this.exitLoadingModal();
  }

  login = async (values) => {
    try {
      const { token, user } = await users.login(values);

      window.localStorage.setItem('token', token);
      window.localStorage.setItem('user', JSON.stringify(user));

      this.props.onLoginUserChange(user);
      this.hideModal();
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

  handleMenuClick = ({ key }) => {
    switch (key) {
      case 'login':
        this.toggleModal();
        break;
      default:
    }
  }

  renderMenu = () => {
    return (
      <Menu onClick={this.handleMenuClick}>
        {this.isLoginIn() ?
            [
              <Menu.Item key="edit">修改个人信息</Menu.Item>,
              <Menu.Item key="logout">切换用户</Menu.Item>,
            ] :
            <Menu.Item key="login">登录</Menu.Item>}
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
          {this.getUserName()} <Icon type="down" />
          {this.renderModal()}
        </span>
      </Dropdown>
    );
  }
}
