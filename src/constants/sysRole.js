export const editPermissions = {
  self: 'SELF',
  gourp: 'GROUP',
  organization: 'ORGANIZATION',
};
export const createPermissions = {
  group: 'GROUP',
  organization: 'ORGANIZATION',
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
