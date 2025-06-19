export interface User {
  email?: string;
  password?: string;
  name?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  restaurantName?: string;
  isOwner?: boolean;
}
