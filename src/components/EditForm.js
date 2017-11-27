import React, { Component } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import * as R from 'ramda';
import moment from 'moment';

import { columns, types } from '../constants/table';

const FormItem = Form.Item;


const generateForm = (getFieldDecorator) => {
  const generateFieldDecoratorFromSchema = ({ path, type }) => {
    const name = path.join('.');
    let formItem;
    const fieldOptions = {};

    switch (type) {
      case types.string:
        formItem = <Input />;
        break;
      case types.time:
        formItem = <DatePicker />;
        break;
      case types.password:
        formItem = <Input type="password" />;
        break;
      default:
        formItem = <Input />;
        break;
    }

    return getFieldDecorator(name, fieldOptions)(formItem);
  };

  const flattenResult = R.compose(
    R.flatten,
    R.values,
  );

  const generateFormFromColumns = (basePath = []) => {
    const generateFormFromColumn = (column, path) => {
      const formItemConfig = {
        label: column.title,
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      };

      const formItems = [];

      switch (column.type) {
        case types.array:
        case types.object:
          return flattenResult(generateFormFromColumns(path)(column.children));
        default: {
          const formItem = (
            <FormItem {...formItemConfig} key={path.join('.')}>
              {generateFieldDecoratorFromSchema({
                path,
                type: column.type,
              })}
            </FormItem>
          );

          formItems.push(formItem);
        }
      }

      return formItems;
    };

    return R.mapObjIndexed((value, key) => generateFormFromColumn(value, [...basePath, key]));
  };

  return R.compose(
    flattenResult,
    generateFormFromColumns([]),
  );
};

const generateEmptyFormFields = (columns) => {

  const generateEmptyFormField = (column) => {
    switch (column.type) {
      case types.array:
      case types.object:
        return generateEmptyFormFields(column.children);
      case types.string:
      case types.password:
        return 'test';
      case types.time:
        return moment();
      default:
        return undefined;
    }
  }

  return R.map(generateEmptyFormField, columns);
};

console.log(generateEmptyFormFields(columns));

@Form.create({
})
export default class EditForm extends Component {
  handleModalSubmit = () => {
    this.props.form.validateFields({}, (errors, values) => {
      this.props.onOk({
        errors,
        values,
      });
    });
  }

  render() {
    const modalConfig = {
      title: '编辑个人资料',
      visible: this.props.visible,
      onOk: this.handleModalSubmit,
      onCancel: this.props.onCancel,
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <Modal {...modalConfig}>
        <Form layout="horizontal">
          {generateForm(getFieldDecorator)(columns)}
        </Form>
      </Modal>
    );
  }
}
