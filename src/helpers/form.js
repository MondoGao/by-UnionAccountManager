import React from 'react';
import { Form, Input, DatePicker, Select } from 'antd';
import * as R from 'ramda';
import { types } from '../constants/table';

export const generateFormItemFromColumn = ({ path, column, ctx }) => {
  const generateFieldDecoratorFromSchema = ({ path, type, getFieldDecorator }) => {
    const name = path.join('.');
    let formItem;
    const fieldOptions = column.formOptions;

    const generateSelectItem = (values) => {
      const generateOption = (title, value) => (
        <Select.Option key={value} value={value}>
          {title}
        </Select.Option>
      );

      return (
        <Select>
          {R.values(R.mapObjIndexed(generateOption, values))}
        </Select>
      );
    }

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
      case types.enum:
        formItem = generateSelectItem(column.values);
        break;
      default:
        formItem = <Input />;
        break;
    }

    return getFieldDecorator(name, fieldOptions)(formItem);
  };

  const formItemConfig = {
    label: column.title,
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const formItem = (
    <Form.Item {...formItemConfig} key={path.join('.')}>
      {generateFieldDecoratorFromSchema({
        path,
        getFieldDecorator: ctx.getFieldDecorator,
        type: column.type,
      })}
    </Form.Item>
  );

  return formItem;
}
