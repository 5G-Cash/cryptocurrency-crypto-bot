# 5G-CASH Discord Bot Access Web Interface

This web application provides a user interface for the 5G-CASH Discord bot, allowing users to view their wallet information and administrators to monitor bot statistics.

## Features

- Discord OAuth2 authentication
- User dashboard with wallet information
- Admin panel with detailed statistics
- Real-time transaction monitoring
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js >= 16.11.0
- MySQL database
- Discord application credentials

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Generate a random value for `JWT_SECRET` and add it to `.env`. The previous
`jwt_secret.txt` file has been removed from the repository; secrets should be
stored using environment variables only.

Edit the `.env` file with your configuration:

- `VITE_DISCORD_CLIENT_ID`: Your Discord application client ID
- `DISCORD_CLIENT_SECRET`: Your Discord application client secret
- `DISCORD_REDIRECT_URI`: OAuth2 redirect URI (default: http://localhost:5173/callback)
- `DB_HOST`: MySQL database host
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT tokens (generate a secure random string)
- `PORT`: API server port (default: 3001)

3. Start the development server:
```bash
# Start the API server
node api/server.js

# In another terminal, start the frontend
npm run dev
```

4. Access the application at http://localhost:5173

## Production Deployment

1. Build the frontend:
```bash
npm run build
```

2. Serve the built files using your preferred web server

3. Start the API server:
```bash
NODE_ENV=production node api/server.js
```
4. Configure a process manager such as **PM2** to keep the API running:
```bash
pm2 start api/server.js --name crypto-bot-api
pm2 save
```

5. Serve the contents of `dist/` using a web server (e.g. **Nginx**). A minimal
   Nginx configuration:
```nginx
server {
    listen 80;
    server_name example.com;
    root /path/to/webapp/dist;
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

6. Obtain a TLS certificate (e.g. via **Let's Encrypt**) and enable HTTPS on the
   reverse proxy to encrypt all traffic between clients and the server.

7. Ensure the required environment variables are set on the host (see `.env.example`).

## Security Notes

- Always use HTTPS in production
- Keep your JWT_SECRET secure and unique
- Regularly update dependencies
- Monitor Discord application credentials
- Follow security best practices for MySQL configuration

## Architecture

- Frontend: React + Vite
- Styling: Tailwind CSS
- State Management: Zustand
- API: Express.js
- Authentication: Discord OAuth2 + JWT
- Database: MySQL

## API Endpoints

### Authentication
- `POST /api/auth/discord`: Discord OAuth2 callback handler

### User Routes
- `GET /api/wallet/:userId`: Get user wallet information

### Admin Routes
- `GET /api/admin/stats`: Get system-wide statistics (admin only)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request