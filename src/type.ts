export type Credentials = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  tenant: Tenant | null;
};

export type CreateUserData = {
  emai: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  tenantId: number;
};

export type CreateTenantData = {
  name: string;
  address: string;
};

export type Tenant = {
  id: number;
  name: string;
  address: string;
};

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: string[];
  };
}

export interface Attribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}
export interface Category {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}

export type FieldData = {
  name: string[];
  value?: string;
};
export type ProductAttribute = {
  name: string;
  value: string | boolean;
};
export type Product = {
  _id: string;
  name: string;
  image: string;
  priceConfiguration: PriceConfiguration;
  attributes: ProductAttribute[];
  description: string;
  category: Category;
  isPublish: boolean;
  createdAt: string;
};

export type ImageField = { file: File };
export type CreateProductData = Product & { image: ImageField };

export interface Promo {
  _id: string;
  title: string;
  code: string;
  validUpto: string;
  tenantId: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromoPayload {
  title: string;
  code: string;
  validUpto: string;
  tenantId: number;
  discount: number;
}

export interface PromoListResponse {
  data: Promo[];
  total: number;
}

export const OrderStatus = {
  RECEIVED: "received",
  CONFIRMED: "confirmed",
  PREPARED: "prepared",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMode = {
  CARD: "card",
  CASH: "cash",
} as const;

export type PaymentMode = (typeof PaymentMode)[keyof typeof PaymentMode];

export type Topping = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export interface CartItem
  extends Pick<Product, "_id" | "name" | "image" | "priceConfiguration"> {
  chosenConfiguration: {
    priceConfiguration: {
      [key: string]: string;
    };
    selectedToppings: Topping[];
  };
  qty: number;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
}
export interface Order {
  _id: string;
  image: any;
  cart: CartItem[];
  customerId: Customer;
  total: number;
  discount: number;
  taxes: number;
  deliveryCharges: number;
  address: string;
  tenantId: string;
  comment?: string;
  paymentMode: PaymentMode;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: string;
}
