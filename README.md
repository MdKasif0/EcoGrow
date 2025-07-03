# EcoGrow 🌱

## Introduction
EcoGrow is a comprehensive plant growth management platform that helps gardeners and farmers track, manage, and optimize their growing journey. From seed to harvest, EcoGrow provides intelligent tools and insights to ensure successful plant cultivation.

## Features

### Smart Calendar & Reminders
- Interactive calendar for tracking plant care tasks
- Customizable reminders for watering, fertilizing, and maintenance
- Task completion tracking and progress monitoring

### Plant Growth Tracker / Plant Journal
- Detailed logging of plant development stages
- Photo documentation and progress tracking
- Weather integration for environmental context
- Growth stage monitoring and milestone tracking

### Seed-to-Harvest Timeline Visualization
- Interactive timeline showing plant growth stages
- Visual progress tracking from seedling to harvest
- Integration with journal entries and calendar tasks
- Zoom and pan controls for detailed timeline exploration
- Stage-specific care instructions and milestones

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open http://localhost:9002 in your browser

## Prerequisites

*   **Node.js:** This project uses a specific Node.js version. Please ensure you are using a version compatible with the one specified in the `.nvmrc` file (e.g., by using NVM: `nvm use`).

## Environment Variables

This project requires certain environment variables to be set up for full functionality, especially for AI features and Firebase integration (if applicable).

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Edit the newly created `.env` file and fill in the required API keys and configuration values:
    *   `GOOGLE_API_KEY`: Your Google AI (Gemini) API key for server-side AI features.
    *   `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase project's API Key.
    *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase project's Auth Domain.
    *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project's Project ID.
    *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase project's Storage Bucket.
    *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase project's Messaging Sender ID.
    *   `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase project's App ID.
    *   `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: Your VAPID public key for enabling push notifications.

**Note on API Keys:**
Keep your `.env` file secure and do not commit it to version control. The `.gitignore` file is already configured to ignore `.env*` files.
Variables prefixed with `NEXT_PUBLIC_` are exposed to the client-side. For sensitive keys like `GOOGLE_API_KEY` (used for server-side operations), ensure they are not prefixed with `NEXT_PUBLIC_`.

## Running Tests

This project uses Jest and React Testing Library for automated tests.

*   To run all tests once:
    ```bash
    npm test
    ```
*   To run tests in interactive watch mode:
    ```bash
    npm run test:watch
    ```

## Tech Stack
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Shadcn UI Components

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
