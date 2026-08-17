import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// merge default admin-plugin permissions (user management: ban, set-role, etc.)
// with anything ISP-CRM-specific you might add later
const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  ...adminAc.statements, // full admin plugin permissions (ban, set-role, impersonate, etc.)
});

export const support = ac.newRole({
  // no user-management permissions — support staff can't ban/promote other staff
});

export const technician = ac.newRole({});

export const accountant = ac.newRole({});
