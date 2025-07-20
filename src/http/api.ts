import type {
  CreateTenantData,
  CreateUserData,
  Credentials,
  OrderStatus,
  PromoPayload,
} from "../type";
import { api } from "./client";

export const AUTH_SERVICE = "/api/auth";
const CATALOG_SERVICE = "/api/catalog";
const ORDER_SERVICE = "/api/order";


//Auth service
export const login = (credentials: Credentials) =>
  api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);
export const getUsers = (queryString: string) =>
  api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const getTenants = (queryString: string) =>
  api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const createUser = (user: CreateUserData) =>
  api.post(`${AUTH_SERVICE}/users`, user);
export const createTenant = (tenant: CreateTenantData) =>
  api.post(`${AUTH_SERVICE}/tenants`, tenant);
export const updateUser = (user: CreateUserData, id: string) =>
  api.patch(`${AUTH_SERVICE}/users/${id}`, user);

// Categories service
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);
export const getProducts = (queryParam: string) =>
  api.get(`${CATALOG_SERVICE}/Products?${queryParam}`);

export const createProduct = (product: FormData) =>
  api.post(`${CATALOG_SERVICE}/products`, product, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getCategory = (id: string) =>
  api.get(`${CATALOG_SERVICE}/categories/${id}`);

export const updateProduct = (product: FormData, id: string) => {
  return api.put(`${CATALOG_SERVICE}/products/${id}`, product, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

//  order service
export const getPromos = (queryParam: string) => api.get(`${ORDER_SERVICE}/coupons?${queryParam}`);

export const createPromo = (data: PromoPayload) =>
  api.post(`${ORDER_SERVICE}/coupons`, data);

export const updatePromo = (id: string, data: PromoPayload) =>
  api.put(`${ORDER_SERVICE}/coupons/${id}`, data);

export const deletePromo = (id: string) =>
  api.delete(`${ORDER_SERVICE}/coupons/${id}`);


export const getOrders = (queryString: string) => api.get(`${ORDER_SERVICE}/orders?${queryString}`)
export const getSingle = (orderId: string, queryString: string) => api.get(`${ORDER_SERVICE}/orders/${orderId}?${queryString}`)

export const changeStatus = (orderId: string, data: {status: OrderStatus}) => api.patch(`${ORDER_SERVICE}/orders/change-status/${orderId}`, data)

