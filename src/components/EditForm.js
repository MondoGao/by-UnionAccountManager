import React, { Component } from 'react';
import { Modal, Form } from 'antd';
import * as R from 'ramda';
import moment from 'moment';

import { columns, types } from '../constants/table';
import {
  transformColumns,
  getColumnDefineFromColumnDataPath,
} from '../helpers/table';
import { generateFormItemFromColumn } from '../helpers/form';

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
