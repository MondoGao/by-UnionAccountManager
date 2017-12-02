import React, { Component } from 'react';
import { Layout } from 'antd';

import MemberTable from './MemberTable';
import Login from './Login';
import * as users from '../sources/users';

import styles from './App.css';

const { Header, Content } = Layout;

export default class App extends Component {
  state = {
    users: [],
    loginUser: null,
  }

  async componentDidUpdate(prevProps, { loginUser: prevLoginUser }) {
    const { loginUser } = this.state;

    if (loginUser && loginUser !== prevLoginUser) {
      this.updateUserList();
    }
  }

  updateUserList = async () => {
    const { users: userList } = await users.getList();

    this.setState(() => ({
      users: userList,
    }));
  }

  onLoginUserChange = (loginUser) => {
    this.setState(() => ({
      loginUser,
    }));
  }

  render() {
    return (
      <Layout className={styles.app}>
        <Header>
          冰岩个人信息平台
          <Login user={this.state.loginUser} onLoginUserChange={this.onLoginUserChange} />
        </Header>

        <Content>
          <section className="section">
            <MemberTable user={this.state.loginUser} data={this.state.users} freshData={this.updateUserList} />
          </section>
        </Content>
      </Layout>
    );
  }
}

