import React, { Component } from 'react';

import { Layout } from 'antd';

import styles from './App.css';

const { Header, Content, Footer } = Layout;

export default class App extends Component {
  render() {
    return (
      <Layout className={styles.app}>
        <Header>
          冰岩个人信息平台
        </Header>
        <Content className={styles.content}>
          Welcome
        </Content>
        <Footer>
          Powered by Bingyan Studio
        </Footer>
      </Layout>
    );
  }
}
