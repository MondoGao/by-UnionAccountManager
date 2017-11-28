export const editPermissions = {
  self: 'EDIT_SELF',
  gourp: 'EDIT_GROUP',
  organization: 'EDIT_ORGANIZATION',
};
export const createPermissions = {
  group: 'CREATE_GROUP',
  organization: 'CREATE_ORGANIZATION',
};
const sysRoleData = {
  0: {
    name: 'User',
    permissions: [
      editPermissions.self,
    ],
  },
  1: {
    name: 'Manager',
    permissions: [
      editPermissions.group,
      createPermissions.group,
    ],
  },
  2: {
    name: 'Administrator',
    permissions: [
      editPermissions.organization,
      createPermissions.organization,
    ],
  },
};

export default sysRoleData;
