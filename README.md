# HungryMan-UI

[![Angular](https://img.shields.io/badge/Angular-15-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue.svg)](https://www.typescriptlang.org/)
[![Angular Material](https://img.shields.io/badge/Angular%20Material-15.2-pink.svg)](https://material.angular.io/)

## Overview

HungryMan-UI is the Angular frontend for the HungryMan recipe platform. It provides a rich, user-friendly experience for both restaurant owners and food enthusiasts, enabling owners to manage their recipes and foodies to discover, search, and favorite delicious recipes. The application features a responsive design, internationalization support, and secure authentication mechanisms.

## Key Features

- **User Authentication**: Separate registration and login for restaurant owners and food enthusiasts
- **Recipe Management**: Owners can add new recipes with detailed information
- **Recipe Discovery**: Browse and search recipes with advanced filtering
- **Recipe Details**: Comprehensive recipe views with ingredients and instructions
- **Favorites System**: Users can save and manage their favorite recipes
- **Responsive Design**: Optimized for desktop and mobile devices using Angular Material
- **Internationalization**: Multi-language support with ngx-translate
- **Route Protection**: Guards ensure secure access to owner-only features

## Tech Stack

- **Framework**: Angular 15
- **Language**: TypeScript 4.9
- **UI Library**: Angular Material 15.2
- **State Management**: RxJS 7.8
- **Styling**: SCSS
- **Internationalization**: ngx-translate
- **Build Tool**: Angular CLI 15.2
- **Testing**: Jasmine, Karma

## Architecture Overview

The application follows Angular's component-based architecture with clear separation of concerns:

- **Components**: Modular UI elements organized by feature (authentication, recipes, etc.)
- **Services**: Handle API communication, authentication, and business logic
- **Guards**: Protect routes based on authentication and user roles
- **Pipes**: Transform data for display (e.g., capitalization)
- **Interfaces & Enums**: Provide type safety and define data structures
- **Validators**: Custom form validation logic

The architecture supports scalability and maintainability, with shared components in the `common` folder and feature-specific components in dedicated folders.

## Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/HungryMan-UI.git
   cd HungryMan-UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:4200`.

## Environment Variables

Currently, the application uses hardcoded API endpoints for development. For production deployment, consider configuring environment-specific variables:

- `API_BASE_URL`: Base URL for the backend API (default: `http://localhost:5000/api`)

## How to Run

### Frontend

```bash
npm start
```

This command starts the Angular development server with hot reload enabled.

### Backend

The HungryMan-UI frontend requires a separate backend API server. Ensure the backend is running on `http://localhost:5000`. The backend project (HungryMan-API) should be set up and running independently.

For backend setup instructions, refer to the [HungryMan-API repository](https://github.com/your-username/HungryMan-API).

## API Overview

The frontend communicates with a RESTful API hosted at `http://localhost:5000/api`. Key endpoints include:

### Authentication
- `POST /register/owner` - Register a restaurant owner
- `POST /register/foodie` - Register a food enthusiast
- `POST /login/owner` - Owner login
- `POST /login/foodie` - Foodie login

### Recipes
- `GET /recipes` - Get all recipes
- `GET /recipes/:id` - Get recipe by ID
- `POST /owner/recipes` - Add new recipe (owner only)
- `GET /recipes/search` - Search recipes

### Favorites
- `GET /recipes/favorites` - Get user's favorite recipes
- `POST /recipes/favorites/:id` - Add recipe to favorites
- `DELETE /recipes/favorites/:id` - Remove recipe from favorites

All authenticated requests include JWT tokens in the Authorization header.

## Folder Structure

```
src/
├── app/
│   ├── components/          # Feature-specific components
│   │   ├── home/           # Home page component
│   │   ├── login/          # Login component
│   │   ├── register/       # Registration component
│   │   ├── search-recipe/  # Recipe search component
│   │   ├── owner/          # Owner-specific components
│   │   └── about/          # About page component
│   ├── common/             # Shared components and utilities
│   │   ├── components/     # Reusable UI components (header, footer, etc.)
│   │   ├── interfaces/     # TypeScript interfaces
│   │   ├── enums/          # Application enums
│   │   └── validators/     # Custom validators
│   ├── guards/             # Route guards
│   ├── pipes/              # Custom pipes
│   ├── services/           # API and business logic services
│   ├── app-routing.module.ts  # Route configuration
│   └── app.module.ts       # Main application module
├── assets/                 # Static assets
│   ├── images/            # Image files
│   └── i18n/              # Translation files
└── styles.scss            # Global styles
```

## Screenshots

*Coming soon - Add screenshots of the application here*

## Future Improvements

- **Enhanced Search**: Implement advanced filtering by cuisine, dietary restrictions, and ingredients
- **Recipe Ratings & Reviews**: Allow users to rate and review recipes
- **Social Features**: Recipe sharing, user profiles, and following system
- **Offline Support**: Progressive Web App (PWA) capabilities
- **Admin Panel**: Comprehensive dashboard for platform management
- **Recipe Recommendations**: AI-powered recipe suggestions based on user preferences
- **Mobile App**: Native mobile applications for iOS and Android

## Testing

Run the test suite with:

```bash
npm test
```

Tests are written using Jasmine and executed with Karma.

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Contribution Guidelines

We welcome contributions! Please follow these guidelines:

1. **Fork the repository** and create a feature branch from `main`
2. **Follow Angular style guide** and use consistent naming conventions
3. **Write tests** for new features and ensure all tests pass
4. **Update documentation** including this README if necessary
5. **Submit a pull request** with a clear description of changes

### Code Style

- Use TypeScript strict mode
- Follow Angular's official style guide
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
