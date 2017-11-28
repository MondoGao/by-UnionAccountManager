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

  async componentDidMount() {
    const userList = await users.getList();

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
            <MemberTable data={this.state.users} />
          </section>
        </Content>
      </Layout>
    );
  }
}

