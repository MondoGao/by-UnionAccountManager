import * as R from 'ramda';
import { types } from '../constants/table';

export const getColumnOrTypeProp = ({ columnDef, path }) => {
  const cProp = R.path(path, columnDef);
  const tProp = R.path(path, columnDef.type);

  return R.mergeDeepRight(tProp ? tProp : {}, cProp ? cProp : {});
}

/**
 * 遍历属性配置，并向 generateFun 中传递 columnDataPath 等进行处理
 */
export const transformColumns = ({
  generateFun,
  ctx,
  columns,
  willFlattenResult = true,
}) => {
  const flattenResult = willFlattenResult ?
    R.compose(
      R.flatten,
      R.values,
    ) :
    R.identity;

  const generateFormFromColumns = (basePath = []) => {
    const generateFormFromColumn = (column, path) => {
      switch (column.type) {
        case types.array:
          return flattenResult(generateFormFromColumns([...path, 0])(column.children));
        case types.object:
          return flattenResult(generateFormFromColumns(path)(column.children));
        default:
          return generateFun({
            column,
            path,
            ctx,
          });
      }
    };

    return R.mapObjIndexed((value, key) => generateFormFromColumn(value, [...basePath, key]));
  };

  return R.compose(
    flattenResult,
    generateFormFromColumns([]),
  )(columns);
};

/**
 * 将非嵌套路径转换为数组默认为 0 的嵌套路径，并同时返回对应属性配置
 */
export const transColumnPathToColumnDataPath = ({ columns, columnPath }) => {
  const columnDataPath = [];

  const column = R.reduce((nowColumns, path) => {
    columnDataPath.push(path);
    const nowColumn = nowColumns[path];

    switch (nowColumn.type) {
      case types.array:
        columnDataPath.push(0);
        return nowColumn.children;
      case types.object:
        return nowColumn.children;
      default:
        return nowColumn;
    }
  }, columns, columnPath);

  return {
    column,
    columnDataPath,
  };
};


/**
 * 生成 rc-table 用单个 column 属性配置
 */
export const generateTableConfig = ({ columnPath, data, columns }) => {
  const { column, columnDataPath } = transColumnPathToColumnDataPath({
    columns,
    columnPath,
  });

  const tableConfigs = {
    title: column.title,
    dataIndex: columnDataPath.join('.'),
  };

  if (column.tableOptions) {
    R.mapObjIndexed((config, key) => {
      if (key === 'hasFilters' && config) {
        const getExistData = R.compose(
          R.uniq,
          R.map(R.path(columnDataPath)),
        );

        const generateTableFilter = uniqData => ({
          text: uniqData,
          value: uniqData,
        });
        const generateTableFilters = R.map(generateTableFilter);

        tableConfigs.filters = R.compose(
          generateTableFilters,
          getExistData,
        )(data);

        tableConfigs.onFilter = (value, record) => R.path(columnDataPath, record) === value;
      } else {
        tableConfigs[key] = config;
      }
    }, column.tableOptions);
  }

  return tableConfigs;
};

/**
 * 遍历 formData, 对其属性是使用 transFun
 */
export const transformFormData = ({ transFun, formData, transformColumns, columns }) => {
  let resultFormData = R.clone(formData);

  transformColumns({
    columns,
    generateFun({ column, path }) {
      const lens = R.lensPath(path);
      const formItem = R.view(lens, resultFormData);

      resultFormData = R.set(lens, transFun({
        column,
        path,
        formItem,
      }), resultFormData);
    },
  });

  return resultFormData;
};

/**
 * 从 dataPath 得到对应属性原配置
 */
export const getColumnDefineFromColumnDataPath = (columns, columnDataPath) => {
  let needJumpNext = false;

  return R.compose(
    R.reduce((acc, path) => {
      if (needJumpNext) {
        needJumpNext = false;
        return acc;
      }

      const columnDef = acc[path];

      switch (columnDef.type) {
        case types.array:
          needJumpNext = true;
          return columnDef.children;
        case types.object:
          return columnDef.children;
        default:
          return columnDef;
      }
    }, columns),
    R.split('.'),
  )(columnDataPath);
};
