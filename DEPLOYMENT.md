# RutuFruits Website - Deployment Guide (Hostinger VPS)

This guide walks you through deploying the Next.js project to your Hostinger VPS and pointing the domain `rutufruits.in` to it.

## 1. Initial VPS Setup

Log into your Hostinger VPS via SSH:
```bash
ssh root@<your_vps_ip>
```

Install the required software (Node.js, Git, PM2, and Nginx):
```bash
# Install Node.js & npm (Using NVM is recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 # Or whatever your preferred LTS version is

# Install PM2 globally
npm install -g pm2

# Install Nginx
sudo apt update
sudo apt install nginx -y
```

## 2. Clone the Repository

Navigate to your web directory (e.g., `/var/www/`) and clone the repo:
```bash
cd /var/www
git clone https://github.com/VipulPhatangare/rutufruits.git
cd rutufruits/website
```

## 3. Build & Run the Application

Install dependencies and build the production bundle of the Next.js app:
```bash
npm install
npm run build
```

Start the application in the background using PM2:
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup # Follow the instructions it outputs to ensure PM2 restarts on server reboot
```

## 4. Configure Nginx (Reverse Proxy for rutufruits.in)

Create a new Nginx configuration file for your domain:
```bash
sudo nano /etc/nginx/sites-available/rutufruits.in
```

Paste the following configuration into the file:

```nginx
server {
    listen 80;
    server_name rutufruits.in www.rutufruits.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/rutufruits.in /etc/nginx/sites-enabled/
sudo nginx -t # Test configuration
sudo systemctl restart nginx
```

## 5. Secure with SSL (Certbot)

Install Certbot and get a free Let's Encrypt SSL certificate for `https://`:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d rutufruits.in -d www.rutufruits.in
```

Follow the prompts. Choose "Yes" to redirect all traffic to HTTPS. That's it! Your site is now live at `https://rutufruits.in`.
