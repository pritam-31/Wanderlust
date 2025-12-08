----WANDERLUST----
Wanderlust — Airbnb-Style Full-Stack Accommodation Web Application

Wanderlust is a full-stack travel accommodation platform inspired by Airbnb.
Users can explore unique stays, view live maps, create their own listings, upload images, write reviews, and experience a smooth, modern, booking-style interface.

This project is built completely from scratch with real-world backend logic, clean architecture, secure authentication, and a polished UI.


---

🚀 Features

🔐 Authentication & Security

Login / Signup using Passport.js

Password hashing & session-based authentication

Route protection using middleware

Proper redirects + full error handling


🏡 Listing Management

Create, Update, and Delete listings

Upload multiple images using Cloudinary

Auto-compression + secure cloud storage

Strong form validation


⭐ Review System

Star ratings + text reviews

Ownership validation

Safe delete workflow


🗺️ Live Map Integration

Leaflet.js interactive maps

Real-time zoom, drag, and markers

Forward geocoding with Nominatim (OpenStreetMap)


🎨 Clean, Modern UI

Airbnb-inspired design

Category filters (Castles, Rooms, Boats, Trending, Camping…)

Mobile-responsive layouts

High-quality card-based UI


🧭 Explore Page

Dynamic listing grid

Smooth navigation to detail pages



---

🏗️ Tech Stack

Frontend

EJS

HTML5

CSS3

Bootstrap

Custom responsive components


Backend

Node.js

Express.js

REST APIs

MVC Architecture


Database & Storage

MongoDB

Mongoose

Cloudinary


Maps & APIs

Leaflet.js

OpenStreetMap

Nominatim Geocoding API



---

📁 Project Structure

Wanderlust/
│── controllers/
│── models/
│── routes/
│── public/
│── views/
│── utils/
│── app.js
│── package.json
│── README.md


---

⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/yourusername/wanderlust.git
cd wanderlust

2️⃣ Install Dependencies

npm install

3️⃣ Create a .env File

Include the following:

CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret

MAPBOX_TOKEN=your_map_token (if used)

SESSION_SECRET=your_secret

MONGO_URL=mongodb+srv://...

4️⃣ Run the Server

npm start

Server runs on:
http://localhost:8080 (or your configured port)


---

📸 Screenshots (Add your own)

Home Page

Explore Listings

Listing Details

Review Section

Map View

Add Listing Page



---

💡 What I Learned

Writing scalable backend architecture

Structuring MVC applications

Implementing secure authentication

Cloud storage integration

Working with geocoding + maps

Designing clean UI/UX

Debugging & building production-style code



---

🔗 GitHub Repository :-
https://github.com/pritam-31/Wanderlust

👉 Live Code:
https://wanderlust-0mhb.onrender.com


---

👨‍💻 Author

Pritam Padhan
Full-Stack Developer | Backend & API Enthusiast

