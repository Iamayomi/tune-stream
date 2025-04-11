import { SetMetadata } from '@nestjs/common';
import { Roles } from '../types';

export const ROLES = 'roles';

export const RoleAllowed = (...roles: Roles[]) => SetMetadata(ROLES, roles);
