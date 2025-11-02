// src/seeds/role.seed.ts
import { RoleEntity } from 'src/role/role.entity';
import { DataSource } from 'typeorm';

export const seedRoles = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(RoleEntity);

  const roles = [
    { name: 'ADMIN' },
    { name: 'USER' },
    { name: 'EDITOR' },
  ];

  for (const role of roles) {
    const found = await roleRepository.findOne({ where: { name: role.name } });
    if (!found) {
      await roleRepository.save(role);
      console.log(`✅ Added role: ${role.name}`);
    } else {
      console.log(`⚠️ Role ${role.name} already exists`);
    }
  }
};
