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
  image?: ImageUrl;
  restaurantName?: string;
  isOwner?: boolean;
}

export interface RecipeDetails {
  title: string;
  description: string;
  favoritesCount: number
  ingredients: string[];
  steps: string[];
  tags: string[];
  instructions: string;
  image: ImageUrl;
  ownerId?: string; 
  createdAt?: Date; 
  updatedAt?: Date; 
  ratings?: string[];
  vegetarian: boolean;
  views?: string[];
  _id: string;
  __v: number, 
}

export interface ImageUrl {
  url: string;
  public_id: string;
}

export interface MessageResponse {
    message: string
}