import * as R from 'ramda';
import { createPermissions, editPermissions } from '../constants/sysRole';

export const validatePermissions = (
  shouldPermssions = [],
  hadPermissions = [],
  isAny = true,
) => R[isAny ? 'any' : 'all'](
  R.contains(R.__, shouldPermssions),
  hadPermissions,
);

export const canCreateMember = hadPermissions => validatePermissions(
  R.values(createPermissions),
  hadPermissions,
);

export const canEditAll = hadPermissions => validatePermissions(
  [editPermissions.organization],
  hadPermissions,
);

export const canEditGroup = hadPermissions => validatePermissions(
  [editPermissions.group],
  hadPermissions,
);
