import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

@Form.create()
export default class EditForm extends Component {
  render() {
    const modalConfig = {
      title: '编辑个人资料',
      visible: true,
    };
    const formItemConfig = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <Modal {...modalConfig}>
        <Form layout="horizontal">
          <FormItem {...formItemConfig}  label="姓名">
            {getFieldDecorator('name')(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
