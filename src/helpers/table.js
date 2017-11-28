import * as R from 'ramda';
import { types } from '../constants/table';

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

export const transColumnDataPathToColumnPath = R.compose(
  R.filter(path => !(Number(path) >=0 && Number(path) <= 100000)),
  R.split('.'),
);

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
}
