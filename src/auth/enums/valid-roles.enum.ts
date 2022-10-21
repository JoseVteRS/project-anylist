import { registerEnumType } from '@nestjs/graphql';

// TODO Implements enum as GraphQL Enum Type
export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superUser = 'superUser',
}

registerEnumType(ValidRoles, { name: 'ValidRoles' });
