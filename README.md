# Apple Credit Bot

A Telegram bot for managing Apple device credit applications with a web dashboard for administrators.

## Features

### 🤖 Telegram Bot
- Collect user information for Apple device credit applications
- Support for iPhone, iPad, and Mac applications
- Automated form handling and data validation

### 📊 Web Dashboard
- **Orders Management**: View all credit applications in a paginated table
- **Search Functionality**: Search orders by ID or email with 500ms debouncing
- **Status Updates**: Update application status (New, In Review, Approved, Rejected)
- **User Communication**: Direct chat with users via Telegram
- **Order Actions**: Delete orders with confirmation
- **Real-time Stats**: Dashboard showing counts by status

## Tech Stack

- **Backend**: Node.js with Bun runtime
- **Database**: SQLite with Drizzle ORM
- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Bot Framework**: Telegram Bot API

## Installation

1. Install dependencies:
```bash
bun install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Set up the database:
```bash
bun db:generate
bun db:migrate
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Database Configuration
DATABASE_URL=./database.sqlite

# Optional: Development Settings
NODE_ENV=development
```

### Getting a Telegram Bot Token
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Use `/newbot` command and follow instructions
3. Copy the token provided and add it to your `.env` file

## Available Scripts

### Development
- `bun bot:dev` - Start Telegram bot in development mode
- `bun web:dev` - Start web dashboard in development mode

### Production
- `bun bot:start` - Start Telegram bot in production mode
- `bun web:start` - Start web dashboard in production mode

### Database Management
- `bun db:generate` - Generate database schema from Drizzle definitions
- `bun db:migrate` - Run database migrations
- `bun db:studio` - Open Drizzle Studio for database management

## Running the Application

### Development Mode
Start the Telegram bot:
```bash
bun bot:dev
```

Start the web dashboard (in another terminal):
```bash
bun web:dev
```

### Production Mode
```bash
bun bot:start    # Start bot
bun web:start    # Start web dashboard
```

The web dashboard will be available at `http://localhost:3000`

## Project Structure

```
├── packages/core/          # Shared core functionality
│   ├── dal/                # Data Access Layer
│   └── types/              # TypeScript types
├── apps/web/               # Next.js web dashboard
│   ├── app/                # App router pages
│   ├── components/         # React components
│   └── actions/            # Server actions
└── index.ts                # Telegram bot entry point
```

## Database Schema

The application uses SQLite with the following main entities:
- **Orders**: Credit applications with user details, device info, and status
- **Users**: Telegram user information
- **Application Status**: New, In Review, Approved, Rejected

## Dashboard Features

### Search & Filtering
- Search by order ID or iCloud email
- Real-time search with debouncing
- Pagination with search state preservation

### Order Management
- View all orders in a responsive table
- Update order status via dropdown
- Delete orders with confirmation
- Chat with users directly in Telegram

### Statistics
- Live counts of orders by status
- Total applications overview

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
