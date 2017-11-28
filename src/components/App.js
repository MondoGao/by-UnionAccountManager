import React, { Component } from 'react';
import { Layout } from 'antd';

import MemberTable from './MemberTable';
import Login from './Login';
import { getUserList } from '../sources';

import styles from './App.css';

const { Header, Content } = Layout;

export default class App extends Component {
  state = {
    users: [],
    loginUser: null,
  }

  componentDidMount() {
    getUserList()
      .then((users) => {
        this.setState(() => ({
          users,
        }));
      });
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

