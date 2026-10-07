'use client';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import type { Role } from '@/types/roles';
import {
   hasPermission,
   hasAnyPermission,
   canManageInvites,
   isManagerOrAbove,
   type Permission,
} from '@/utils/permissions';

export function useRole() {
   const role = useSelector((state: RootState) => state.auth.role);

   return {
      role,
      isOwner: role === 'OWNER',
      isHR: role === 'HR',
      isRegionalManager: role === 'REGIONAL_MANAGER',
      isSeniorManager: role === 'SENIOR_MANAGER',
      isManager: role === 'MANAGER',
      isEmployee: role === 'EMPLOYEE',
      isManagerOrAbove: isManagerOrAbove(role),
      canManageInvites: canManageInvites(role),
      hasPermission: (permission: Permission) =>
         hasPermission(role, permission),
      can: (permission: Permission) => hasPermission(role, permission),
      hasAnyPermission: (permissions: Permission[]) =>
         hasAnyPermission(role, permissions),
      isAllowed: (allowedRoles: (Role | string)[]) => {
         if (!role) return false;
         if (role === 'OWNER') return true;
         return allowedRoles.includes(role);
      },
   };
}

export default useRole;
