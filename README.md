# MERN Stack: Courier and Parcel Management System

একটি পূর্ণাঙ্গ এবং আধুনিক কুরিয়ার ও পার্সেল ম্যানেজমেন্ট সিস্টেম যা একটি লজিস্টিকস কোম্পানির জন্য ডিজাইন করা হয়েছে। এই সিস্টেমটি ব্যবহার করে গ্রাহকরা সহজেই পার্সেল বুক করতে পারবেন, অ্যাডমিনরা ডেলিভারি এজেন্ট অ্যাসাইন করতে পারবেন এবং সবাই মিলে রিয়েল-টাইমে পার্সেল ট্র্যাক করতে পারবেন।

## 🔗 প্রকল্পের লিঙ্কসমূহ
- **লাইভ ওয়েব অ্যাপ**: [https://tracking-pro.vercel.app/](https://tracking-pro.vercel.app/)
- **ভিডিও ডেমো**: [প্রকল্পের ভিডিও ডেমো দেখুন](#)
- **পোস্টম্যান কালেকশন**: [API ডকুমেন্টেশন](https://www.postman.com/devcoded/workspace/courier-tracking-pro-collections/collection/24636468-99dc365c-1dec-46dc-b43d-1673cd2969ec?action=share&creator=24636468&active-environment=24636468-22a3fd01-a282-4b92-bcdf-2048daefb732)

## 🌟 মূল বৈশিষ্ট্য (Key Features)
এই প্ল্যাটফর্মটি তিনটি প্রধান ভূমিকার (Role) উপর ভিত্তি করে তৈরি:

### 👤 Customer Features
- **রেজিস্ট্রেশন ও লগইন**: নিরাপদ JWT-ভিত্তিক প্রমাণীকরণ।
- **পার্সেল বুকিং**: পিকআপ ও ডেলিভারি ঠিকানা, পার্সেলের আকার, ওজন এবং পেমেন্টের ধরন (COD বা প্রিপেইড) উল্লেখ করে সহজেই বুকিং।
- **বুকিং হিস্টোরি**: নিজের সমস্ত বুকিং এবং তাদের বর্তমান স্ট্যাটাস দেখুন।
- **রিয়েল-টাইম ট্র্যাকিং**: ইন্টারেক্টিভ ম্যাপে লাইভ পার্সেল ট্র্যাক করুন।
- **নোটিফিকেশন**: পার্সেল স্ট্যাটাস পরিবর্তনের সাথে সাথে ইমেইল/SMS নোটিফিকেশন (বোনাস)।

### 🛵 Delivery Agent Features
- **অ্যাসাইন করা পার্সেল**: নিজের জন্য নির্ধারিত সমস্ত পার্সেল দেখুন।
- **স্ট্যাটাস আপডেট**: এক ক্লিকে পার্সেলের স্ট্যাটাস পরিবর্তন (Picked Up, In Transit, Delivered, Failed)।
- **অপ্টিমাইজড রুট**: Google Maps API ব্যবহার করে সবচেয়ে কার্যকর ডেলিভারি রুট দেখুন।
- **বারকোড স্ক্যানিং**: পিকআপ এবং ডেলিভারি নিশ্চিত করার জন্য বারকোড/QR কোড স্ক্যান (বোনাস)।

### 👨‍💻 Admin Features
- **অ্যাডমিন ড্যাশবোর্ড**: প্রতিদিনের বুকিং, সফল ও ব্যর্থ ডেলিভারি, এবং মোট COD কালেকশনের মতো গুরুত্বপূর্ণ মেট্রিক্স দেখুন।
- **এজেন্ট অ্যাসাইনমেন্ট**: বুক করা পার্সেলের জন্য উপযুক্ত ডেলিভারি এজেন্ট নিয়োগ করুন।
- **ব্যবহারকারী ও বুকিং ম্যানেজমেন্ট**: সমস্ত গ্রাহক, এজেন্ট এবং বুকিং দেখুন ও পরিচালনা করুন।
- **রিপোর্ট এক্সপোর্ট**: CSV বা PDF ফরম্যাটে বিস্তারিত রিপোর্ট ডাউনলোড করুন।

## 🛠️ টেকনোলজি স্ট্যাক (Technology Stack)

| ক্যাটেগরি          | টেকনোলজি                                                                 |
|---------------------|--------------------------------------------------------------------------|
| ফ্রন্টএন্ড         | Next.js, Tailwind CSS, Socket.IO Client, React Query, Zustand, Axios, Mapbox Maps API |
| ব্যাকএন্ড          | Node.js, Express.js, Postgresql (with Sequalize ORM), JSON Web Token (JWT), Socket.IO, Bcrypt.js |
| ডেটাবেস            | Postgresql                                                            |
| ডকুমেন্টেশন        | Postman for API testing and documentation.                              |
| ডিপ্লয়মেন্ট        | Vercel (Frontend), Heroku / Render (Backend)                            |

## 🚀 প্রকল্পটি লোকাল মেশিনে চালানোর নির্দেশিকা (Getting Started)
এই প্রকল্পটি আপনার লোকাল মেশিনে সেটআপ করতে নিচের ধাপগুলো অনুসরণ করুন।

### পূর্বশর্ত (Prerequisites)
- Node.js (v16 or later)
- npm বা yarn বা pnpm
- Git
- Postgresql (লোকাল বা Deployed Version)

### সেটআপ নির্দেশিকা
1. **রিপোজিটরিটি ক্লোন করুন**:
   ```bash
   git clone https://github.com/jsdevrazuislam/Tracking-Pro
   cd Tracking-Pro
2. **ব্যাকএন্ড সেটআপ**:
   ```bash
   cd server
   pnpm install
3. **server ফোল্ডারে .example.env ফাইলটিকে .env নামে কপি করুন এবং আপনার তথ্য দিয়ে পূরণ করুন:**:
   ```bash
    DB_NAME=postgres
    DB_USER=db_username
    DB_PASS=db_password
    DB_HOST=localhost
    PORT=8000
    ACCESS_TOKEN_SECRET=ACCESS_TOKEN_SECRET
    ACCESS_TOKEN_EXPIRY=1
    REFRESH_TOKEN_SECRET=REFRESH_TOKEN_SECRET
    REFRESH_TOKEN_EXPIRY=7
    SMTP_TOKEN=Breavo_api_key
    SERVER_URL=http://localhost:8000
    CLIENT_URL=http://localhost:3000

4. **ব্যাকএন্ড সার্ভার চালু করুন:**
    ```bash
    pnpm run dev
5. **ফ্রন্টএন্ড সেটআপ:**
    ```bash
    cd ../client
    pnpm install
6. **client ফোল্ডারে .env.example ফাইলটিকে .env নামে কপি করুন এবং আপনার তথ্য দিয়ে পূরণ করুন:**
    ```bash
    NEXT_PUBLIC_API_BASE_URL=http://192.168.1.104:8000
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=mapbox-key
7. **ফ্রন্টএন্ড অ্যাপ চালু করুন:**
    ```bash
    pnpm run dev

# 📂 প্রকল্পের গঠন (Project Structure)
```bash
    ├── client/ (Next.js App)
    │   ├── public/
    │   └── app/
    │       ├── components/ui (Reusable UI components)
    │       ├── /components/pages/ (Page level components)
    │       ├── lib/api/ (API call functions)
    │       ├── store/ (State management)
    │       ├── hooks/ (Custom hooks)
    │
    ├── server/ (Node.js/Express App)
        ├── public/
    │   └── src/
    │       ├── config/ (DB connection)
    │       ├── controllers/ (Request handling logic)
    │       ├── middleware/ (Auth, RBAC, Validator)
    │       ├── models/ (sequelize schemas)
    │       ├── routes/ (API endpoints)
    │       ├── utils/ (Utility functions)
    │       ├── types/ (Types Interface)
    │       ├── socket/ (Socket Functons And Events)
    │       └── app.ts
    │       └── server.ts
    │
    └── README.md
```
# 📂 ✅ অ্যাডভান্সড ফিচার যা সম্পন্ন হয়েছে (Bonus Features Implemented)

```bash
[✔] QR Code Generation: প্রতিটি পার্সেলের জন্য একটি ইউনিক QR কোড তৈরি করা হয়।

[✔] Barcode Scanning: এজেন্টরা মোবাইল ক্যামেরা ব্যবহার করে পিকআপ ও ডেলিভারি কনফার্ম করতে পারে।

[✔] Email/SMS Notifications: পার্সেলের স্ট্যাটাস পরিবর্তনের সাথে সাথে গ্রাহকদের ইমেইল নোটিফিকেশন পাঠানো হয়।

[✔] Multi-language Support: ইংরেজি এবং বাংলা উভয় ভাষায় সিস্টেমটি ব্যবহারযোগ্য।
```