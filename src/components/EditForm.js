import React, { Component } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import * as R from 'ramda';
import moment from 'moment';

import { columns, types } from '../constants/table';
import {
  transformColumns,
  transColumnDataPathToColumnPath,
  getColumnDefineFromColumnDataPath,
} from '../constants/tableHelpers';

const FormItem = Form.Item;

const generateFormItemFromColumn = ({ path, column, ctx }) => {
  const generateFieldDecoratorFromSchema = ({ path, type, getFieldDecorator }) => {
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

  const formItemConfig = {
    label: column.title,
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const formItem = (
    <FormItem {...formItemConfig} key={path.join('.')}>
      {generateFieldDecoratorFromSchema({
        path,
        getFieldDecorator: ctx.getFieldDecorator,
        type: column.type,
      })}
    </FormItem>
  );

  return formItem;
}

const transformFormDataToDotFlattenObj = ({ formData, columnsDataPath }) => {
  let resultObj = {};

  R.mapObjIndexed((value, key) => {
    if (value instanceof Array) {
      R.map((columnItem) => {
        resultObj = {
          ...resultObj,
          ...transformFormDataToDotFlattenObj({
            formData: columnItem,
            columnsDataPath: columnsDataPath[key],
          }),
        };
      }, value);
    } else if (typeof value === 'object') {
      resultObj = {
        ...resultObj,
        ...transformFormDataToDotFlattenObj({
          formData: value,
          columnsDataPath: columnsDataPath[key],
        }),
      };
    } else {
      const columnDataPath = columnsDataPath[key];
      if (columnDataPath) {
        const columnDef = getColumnDefineFromColumnDataPath(columns, columnDataPath);

        if (columnDef.type === types.time && typeof value === 'number') {
          resultObj[columnDataPath] = moment(value);
          return;
        }

        resultObj[columnDataPath] = value;
      }
    }
  }, formData);

  return resultObj;
};

const columnsWithColumnDataPath = transformColumns({
  columns,
  generateFun({ path }) {
    return path.join('.');
  },
  willFlattenResult: false,
});

const transformFormDataToFormFields = ({ formData, columnsDataPath }) => (
  R.map(
    value => ({ value }),
    transformFormDataToDotFlattenObj({
      formData,
      columnsDataPath,
    }),
  )
);

@Form.create()
export default class EditForm extends Component {
  handleModalSubmit = () => {
    this.props.form.validateFields({}, (errors, values) => {
      this.props.onOk({
        errors,
        values,
      });
    });
  }

  componentDidUpdate({ formData: prevFormData }) {
    const { formData, form } = this.props;
    if (prevFormData !== formData) {
      form.resetFields();

      if (formData) {
        const result = transformFormDataToFormFields({
          formData,
          columnsDataPath: columnsWithColumnDataPath,
        });

        form.setFields(result);
      }
    }
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
          {transformColumns({
            columns,
            ctx: { getFieldDecorator },
            generateFun: generateFormItemFromColumn,
          })}
        </Form>
      </Modal>
    );
  }
}
