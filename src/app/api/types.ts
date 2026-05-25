export type ApiErrorItem = { field?: string | null; message: string };

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  errors: ApiErrorItem[] | null;
  meta: Record<string, unknown>;
};

export type CustomerProfile = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  shoeSize: string | null;
  isVerified: boolean;
  createdAt: string;
};

export type Product = {
  id: number;
  name: string;
  color: string;
  size: string;
  price: string;
  description: string | null;
  image: string | null;
  /** Absolute URL from API (preferred for Image). */
  imageUrl?: string | null;
  images: string[];
  imageUrls?: string[];
  /** All display paths for carousel (from API; matches website gallery). */
  gallery?: string[];
  galleryUrls?: string[];
  availableStock: number;
};

/** Product detail payload from GET /api/customer/products/{id} */
export type ProductDetail = Product & {
  /** Expanded from size range on the product (e.g. "8-12" → ["8","9",…,"12"]). */
  availableSizes?: string[];
};

export type OrderSummary = {
  id: number;
  orderNumber: string;
  orderStatus: string;
  paymentMethod: string;
  totalPrice: string;
  quantity: number;
  dateCreated: string | null;
  trackingNumber: string | null;
};

export type OrderDetail = OrderSummary & {
  products: Array<{
    id: number;
    name: string;
    color: string;
    size: string;
    price: string;
    image: string | null;
    imageUrl?: string | null;
  }>;
  payment: {
    method: string;
    totalPrice: string;
    status: string;
  };
};

export type ServiceBooking = {
  id: number;
  shoeName: string;
  packageName: string;
  status: string;
  progress: number;
  phase: string;
  note: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CustomerAddress = {
  id: number;
  label: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  province: string | null;
  postalCode: string | null;
  country: string;
  contactEmail: string | null;
  contactPhone: string | null;
  isDefault: boolean;
  displayLine1: string;
  displayLine2: string;
  createdAt: string;
};
