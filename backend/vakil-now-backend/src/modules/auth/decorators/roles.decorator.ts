
import { SetMetadata } from '@nestjs/common';

// Define the key constant
export const ROLES_KEY = 'roles';

// Create a decorator to attach roles to routes
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
