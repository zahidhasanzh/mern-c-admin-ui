export type Credentials = {
  email: string;
  password: string;
}

export type User = {
  id:string;
  emai:  string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export type CreateUserData = {
  emai:  string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  tenantId: number;
}

export type CreateTenantData = {
   name: string;
   address: string;
}

export type Tenant = {
  id: number;
  name: string;
  address: string;
}

export type FieldData = {
  name: string[];
  value?: string;
}