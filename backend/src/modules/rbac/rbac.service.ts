import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, Permission, RolePermission, UserRole, User } from '../../schemas/schemas';

@Injectable()
export class RbacService implements OnModuleInit {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
    @InjectModel(RolePermission.name) private readonly rolePermissionModel: Model<RolePermission>,
    @InjectModel(UserRole.name) private readonly userRoleModel: Model<UserRole>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async onModuleInit() {
    await this.seedRbac();
  }

  async seedRbac() {
    const rolesList = [
      'Super Admin',
      'Admin',
      'Customer Support',
      'Product Manager',
      'Seller Manager',
      'Vendor Manager',
      'Finance Manager',
      'Analytics Viewer',
      'Marketing Manager',
      'Seller',
      'Vendor',
      'Customer',
    ];

    const permissionsList = [
      'Create',
      'Read',
      'Update',
      'Delete',
      'Approve',
      'Reject',
      'Export',
      'Import',
      'Manage',
    ];

    // 1. Seed Permissions
    const permissionMap = new Map<string, any>();
    for (const name of permissionsList) {
      let perm = await this.permissionModel.findOne({ name });
      if (!perm) {
        perm = await this.permissionModel.create({ name, description: `${name} permission` });
      }
      permissionMap.set(name, perm);
    }

    // 2. Seed Roles
    const roleMap = new Map<string, any>();
    for (const name of rolesList) {
      let role = await this.roleModel.findOne({ name });
      if (!role) {
        role = await this.roleModel.create({ name, description: `${name} role` });
      }
      roleMap.set(name, role);
    }

    // 3. Seed Role Permissions (Super Admin & Admin get all permissions)
    const superAdminRole = roleMap.get('Super Admin');
    const adminRole = roleMap.get('Admin');
    if (superAdminRole && adminRole) {
      for (const [, perm] of permissionMap.entries()) {
        const exists = await this.rolePermissionModel.findOne({
          roleId: superAdminRole._id,
          permissionId: perm._id,
        });
        if (!exists) {
          await this.rolePermissionModel.create({
            roleId: superAdminRole._id,
            permissionId: perm._id,
          });
        }

        const adminExists = await this.rolePermissionModel.findOne({
          roleId: adminRole._id,
          permissionId: perm._id,
        });
        if (!adminExists) {
          await this.rolePermissionModel.create({
            roleId: adminRole._id,
            permissionId: perm._id,
          });
        }
      }
    }
  }

  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) return false;

    if (user.roles.includes('Super Admin') || user.roles.includes('Admin')) {
      return true;
    }

    const userRolesObj = await this.userRoleModel.find({ userId: user._id });
    for (const ur of userRolesObj) {
      const rolePerms = await this.rolePermissionModel.find({ roleId: ur.roleId }).populate('permissionId');
      const hasPerm = rolePerms.some((rp: any) => rp.permissionId && rp.permissionId.name === permissionName);
      if (hasPerm) return true;
    }

    return false;
  }
}
