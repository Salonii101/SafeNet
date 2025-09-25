# SafeNet

**SafeNet** is a secure file storage and user authentication system, combining:

1. **User authentication & session management**
2. **File encryption & secure cloud storage**
3. **Scam detection and AI analysis for URLs, images, and text**

Built with **Node.js**, **Express**, **MongoDB**, and **AWS S3**, SafeNet ensures high security with **AES-256 encryption**, **JWT-based sessions**, **OTP verification**, and automated notifications.

---

## Features

### Authentication & User Management

* User registration with **OTP verification**
* Login and logout with **JWT-based authentication**
* Role-based access control (Admin / User)
* Automatic email reminders every 30 minutes for active sessions
* Password reset and update functionality
* User cleanup: automatically remove unverified users after a set time

### File Encryption & Storage

* Secure file uploads with **AES-256-GCM encryption**
* Temporary local storage and encrypted upload to **AWS S3**
* Signed URLs for secure downloads
* File metadata stored in MongoDB

### Scam Detection & AI Analysis

* Image, URL, and text analysis using **Hugging Face** APIs
* Malware and phishing detection via **VirusTotal**
* AI inference for text/images

---

## Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JWT, Bcrypt
* **File Storage:** AWS S3
* **Encryption:** AES-256-GCM
* **File Uploads:** Multer
* **Email & Notifications:** Nodemailer, Node-cron
* **Scam Detection:** Hugging Face, VirusTotal APIs
* **Environment Variables:** dotenv

---

## Folder Structure

```
SafeNet/
├── encrypt/
│   ├── controllers/         # File upload & encryption logic
│   ├── utils/               # encryptFile / decryptFile
│   ├── routes/              # file.route.js
│   └── config/              # AWS S3 configuration
├── auth/
│   ├── controllers/         # authController.js
│   ├── middlewares/         # authMiddleware.js
│   ├── models/              # User schema
│   ├── routes/              # authRouter.js, userRouter.js, scanRouter.js
│   ├── services/            # notifyUsers.js, removeUnverifiedUser.js
│   └── utils/               # sendEmail.js, sendToken.js, sendVerificationCode.js, emailTemplate.js
├── database/                # MongoDB connection logic
│   └── connectDB.js
├── app.js                   # Express app config & middleware
├── server.js                # Main server entry point
├── package.json             # Dependencies & scripts
├── .env                     # Environment variables
└── README.md
```

---

## Installation

1. **Clone the repo**

```bash
git clone https://github.com/Salonii101/SafeNet.git
cd SafeNet
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file`**

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGO_URI=<your_mongodb_connection_string>
SMTP_HOST=smtp.gmail.com
SMTP_SERVICE=gmail
SMTP_PORT=465
SMTP_MAIL=<your_mail_id>
SMTP_PASSWORD=<your_SMTP_pass>
JWT_SECRET_KEY=<your_key>
JWT_EXPIRE=3d
COOKIE_EXPIRE=3
CLOUDINARY_CLIENT_NAME=<your_client_name>
CLOUDINARY_CLIENT_API=<your_api_key>
CLOUDINARY_CLIENT_SECRET=<your_secret_key>
AWS_KEY=<your_aws_access_key>
AWS_SECRET=<your_aws_secret_key>
AWS_REGION=<your_aws_region>
S3_BUCKET=<your_s3_bucket_name>
HUGGINGFACE_API_KEY=<your_huggingface_api_key>
VIRUSTOTAL_API_KEY=<your_virustotal_api_key>
```

4. **Start the server**

```bash
npm start
```

* Server runs on `.env` `PORT` (default 5000)

---

## API Endpoints

### Auth Routes (`/api/v1/auth`)

| Method | Endpoint               | Description                     |
| ------ | ---------------------- | ------------------------------- |
| POST   | /register              | Register a new user             |
| POST   | /verify-otp            | Verify OTP                      |
| POST   | /login                 | User login                      |
| GET    | /logout                | Logout user                     |
| GET    | /me                    | Get current user info           |
| POST   | /password/forgot       | Forgot password                 |
| PUT    | /password/reset/:token | Reset password                  |
| PUT    | /password/update       | Update password (authenticated) |

### User Routes (`/api/v1/user`)

| Method | Endpoint       | Description                     |
| ------ | -------------- | ------------------------------- |
| GET    | /all           | Get all users (Admin only)      |
| POST   | /add/new-Admin | Register new Admin (Admin only) |

### Scan Routes (`/api/v1/scan`)

| Method | Endpoint      | Description                          |
| ------ | ------------- | ------------------------------------ |
| POST   | /file         | Upload & scan a file (authenticated) |
| POST   | /url          | Scan a URL (authenticated)           |
| GET    | /analysis/:id | Get scan results (authenticated)     |
| POST   | /ai           | AI model inference (authenticated)   |

### File Routes (`/api/files/`)

| Method | Endpoint | Description             |
| ------ | -------- | ----------------------- |
| POST   | /        | Upload & encrypt a file |

---

## Security & Utilities

* AES-256-GCM encryption for all files
* JWT protects all user sessions
* Email reminders via Node-cron
* Scheduled tasks: `notifyUsers.js` & `removeUnverifiedUser.js`
* Utility modules for sending emails, tokens, and OTPs
* VirusTotal & Hugging Face integration for content verification

---

## License

MIT License
