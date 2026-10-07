import type { Role } from '@/types/roles';

export type Permission =
   | 'view_dashboard'
   | 'manage_company'
   | 'invite_users'
   | 'manage_roles'
   | 'manage_teams'
   | 'create_project'
   | 'edit_project'
   | 'delete_project'
   | 'assign_tasks'
   | 'manage_tasks'
   | 'view_all_tasks'
   | 'view_analytics'
   | 'manage_performance'
   | 'manage_hr_records'
   | 'view_team_work'
   | 'view_own_tasks'
   | 'log_work_time';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
   OWNER: [
      'view_dashboard',
      'manage_company',
      'invite_users',
      'manage_roles',
      'manage_teams',
      'create_project',
      'edit_project',
      'delete_project',
      'assign_tasks',
      'manage_tasks',
      'view_all_tasks',
      'view_analytics',
      'manage_performance',
      'manage_hr_records',
      'view_team_work',
      'view_own_tasks',
      'log_work_time',
   ],
   HR: [
      'view_dashboard',
      'invite_users',
      'manage_roles',
      'manage_teams',
      'view_all_tasks',
      'view_analytics',
      'manage_performance',
      'manage_hr_records',
      'view_team_work',
      'view_own_tasks',
      'log_work_time',
   ],
   REGIONAL_MANAGER: [
      'view_dashboard',
      'invite_users',
      'manage_teams',
      'create_project',
      'edit_project',
      'delete_project',
      'assign_tasks',
      'manage_tasks',
      'view_all_tasks',
      'view_analytics',
      'manage_performance',
      'view_team_work',
      'view_own_tasks',
      'log_work_time',
   ],
   SENIOR_MANAGER: [
      'view_dashboard',
      'manage_teams',
      'create_project',
      'edit_project',
      'assign_tasks',
      'manage_tasks',
      'view_all_tasks',
      'view_analytics',
      'view_team_work',
      'view_own_tasks',
      'log_work_time',
   ],
   MANAGER: [
      'view_dashboard',
      'manage_teams',
      'assign_tasks',
      'manage_tasks',
      'view_all_tasks',
      'view_team_work',
      'view_own_tasks',
      'log_work_time',
   ],
   EMPLOYEE: ['view_dashboard', 'view_own_tasks', 'log_work_time'],
   GUEST: [],
};

export function mapMetadataToRole(
   metadata?: Record<string, unknown> | null,
): Role {
   if (!metadata) return 'EMPLOYEE';

   const roleRaw = String(
      metadata.teamRole || metadata.role || metadata.user_role || '',
   )
      .trim()
      .toLowerCase();

   switch (roleRaw) {
      case 'owner':
      case 'admin':
         return 'OWNER';
      case 'hr':
      case 'hr_manager':
         return 'HR';
      case 'regional_manager':
         return 'REGIONAL_MANAGER';
      case 'senior_manager':
         return 'SENIOR_MANAGER';
      case 'manager':
      case 'team_lead':
         return 'MANAGER';
      case 'employee':
      case 'member':
         return 'EMPLOYEE';
      default:
         return 'EMPLOYEE';
   }
}

export function hasPermission(
   role: Role | null | undefined,
   permission: Permission,
): boolean {
   if (!role) return false;
   if (role === 'OWNER') return true;
   return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
   role: Role | null | undefined,
   permissions: Permission[],
): boolean {
   if (!role) return false;
   if (role === 'OWNER') return true;
   return permissions.some((permission) => hasPermission(role, permission));
}

export function canManageInvites(role: Role | null | undefined): boolean {
   return hasPermission(role, 'invite_users');
}

export function isManagerOrAbove(role: Role | null | undefined): boolean {
   if (!role) return false;
   return [
      'OWNER',
      'HR',
      'REGIONAL_MANAGER',
      'SENIOR_MANAGER',
      'MANAGER',
   ].includes(role);
}
