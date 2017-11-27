import * as R from 'ramda';
import { types } from './table';

export const transformColumns = ({ generateFun, ctx, columns }) => {
  const flattenResult = R.compose(
    R.flatten,
    R.values,
  );

  const generateFormFromColumns = (basePath = []) => {
    const generateFormFromColumn = (column, path) => {
      switch (column.type) {
        case types.array:
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
