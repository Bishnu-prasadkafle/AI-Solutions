# AI-Solution

A full-stack web platform for an AI solutions company, built with **Django REST Framework** (backend) and **Next.js 15** (frontend). It includes a public-facing website, a protected admin dashboard, a chatbot, and a full content management system.

## Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Frontend   | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend    | Django 5, Django REST Framework, SimpleJWT     |
| Database   | SQLite (development)                           |
| Auth       | JWT (access + refresh tokens)                  |
| Media      | Django media file serving (Pillow)             |
| AI Chatbot | Google Gemini API                              |

## Project Structure

ai_solution/
├── backend/
│ ├── apps/
│ │ ├── accounts/ # Auth, admin login, dashboard stats
│ │ ├── blogs/ # Blog posts CRUD
│ │ ├── chatbot/ # Gemini AI chatbot
│ │ ├── contacts/ # Contact / enquiry form
│ │ ├── feedback/ # Customer feedback & testimonials
│ │ ├── gallery/ # Gallery & events (images)
│ │ ├── services/ # Company services
│ │ └── team/ # Team members
│ ├── media/ # Uploaded files
│ ├── ai_solution/ # Django project settings & URLs
│ ├── manage.py
│ ├── requirements.txt
│ └── .env.example
└── frontend/
├── src/
│ ├── app/ # Next.js App Router pages
│ │ ├── admin/ # Protected admin dashboard
│ │ ├── blog/ # Public blog pages
│ │ ├── events/ # Gallery & events page
│ │ ├── services/ # Services pages
│ │ └── ...
│ ├── components/ # Reusable UI components
│ ├── hooks/ # Custom React hooks
│ └── lib/ # API client, Zustand store
├── public/
├── package.json
└── .env.local.example

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd ai_solution/backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
copy .env.example .env
```

Edit `.env`:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
EMAIL_HOST_USER=your@email.com
EMAIL_HOST_PASSWORD=your-email-password
GEMINI_API_KEY=your-gemini-api-key
```

```bash
# Run migrations
python manage.py migrate

# Create admin superuser
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

---

### Frontend Setup

```bash
cd ai_solution/frontend

# Install dependencies
npm install

# Copy and configure environment variables
copy .env.local.example .env.local
```

`.env.local` values:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_MEDIA_URL=http://localhost:8000
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

```bash
# Start the development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Admin Dashboard

Access the admin panel at `http://localhost:3000/admin`

Login with the superuser credentials created during backend setup.

### Dashboard Sections

| Section          | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| Dashboard        | Stats overview — services, blogs, gallery, enquiries, feedback |
| Analytics        | Charts and platform reports                                    |
| Services         | Add / edit / delete company services                           |
| Blog Posts       | Write, publish, and manage blog articles                       |
| Gallery / Events | Upload images, manage upcoming and past events                 |
| Team             | Manage team member profiles                                    |
| Enquiries        | View and manage contact form submissions                       |
| Feedback         | Approve / hide customer testimonials                           |

## API Endpoints

### Auth

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/auth/login/`   | Admin login — returns JWT tokens |
| POST   | `/api/auth/refresh/` | Refresh access token             |
| POST   | `/api/auth/logout/`  | Logout                           |

### Services

| Method         | Endpoint              | Access                  |
| -------------- | --------------------- | ----------------------- |
| GET            | `/api/services/`      | Public                  |
| POST           | `/api/services/`      | Admin                   |
| GET/PUT/DELETE | `/api/services/<id>/` | Public GET, Admin write |

### Blogs

| Method         | Endpoint           | Notes                        |
| -------------- | ------------------ | ---------------------------- |
| GET            | `/api/blogs/`      | Supports `?category=` filter |
| POST           | `/api/blogs/`      | Admin                        |
| GET/PUT/DELETE | `/api/blogs/<id>/` | Public GET, Admin write      |

### Gallery / Events

| Method         | Endpoint             | Notes                                                           |
| -------------- | -------------------- | --------------------------------------------------------------- |
| GET            | `/api/gallery/`      | Supports `?type=event\|general`, `?upcoming=true`, `?past=true` |
| POST           | `/api/gallery/`      | Admin — multipart/form-data                                     |
| GET/PUT/DELETE | `/api/gallery/<id>/` | Public GET, Admin write                                         |

### Contacts / Enquiries

| Method | Endpoint                        | Access     |
| ------ | ------------------------------- | ---------- |
| GET    | `/api/contacts/`                | Admin only |
| POST   | `/api/contacts/`                | Public     |
| PATCH  | `/api/contacts/<id>/mark-read/` | Admin      |
| DELETE | `/api/contacts/<id>/`           | Admin      |

### Feedback

| Method | Endpoint                      | Access                 |
| ------ | ----------------------------- | ---------------------- |
| GET    | `/api/feedback/`              | Public (approved only) |
| POST   | `/api/feedback/`              | Public                 |
| PATCH  | `/api/feedback/<id>/approve/` | Admin                  |
| DELETE | `/api/feedback/<id>/`         | Admin                  |

### Stats

| Method | Endpoint      | Access     |
| ------ | ------------- | ---------- |
| GET    | `/api/stats/` | Admin only |

### Chatbot

| Method | Endpoint     | Access |
| ------ | ------------ | ------ |
| POST   | `/api/chat/` | Public |

---

## Key Features

- **JWT Authentication** — access tokens (24h) + refresh tokens (7 days) with auto-rotation
- **Gallery & Events** — images categorised as `general` or `event`, with `is_upcoming` flag to separate upcoming vs past events
- **AI Chatbot** — powered by Google Gemini, embedded on the public site
- **Contact Enquiries** — form submissions with unread badge in admin
- **Feedback / Testimonials** — star ratings with admin approval workflow
- **Blog** — rich content posts with category filtering
- **Media uploads** — images served via Django at `/media/`
- **CORS** configured for local development

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable              | Description                      |
| --------------------- | -------------------------------- |
| `SECRET_KEY`          | Django secret key                |
| `DEBUG`               | `True` for development           |
| `EMAIL_HOST_USER`     | Gmail address for contact emails |
| `EMAIL_HOST_PASSWORD` | Gmail app password               |
| `GEMINI_API_KEY`      | Google Gemini API key            |

### Frontend (`frontend/.env.local`)

| Variable                     | Description            |
| ---------------------------- | ---------------------- |
| `NEXT_PUBLIC_API_URL`        | Backend API base URL   |
| `NEXT_PUBLIC_MEDIA_URL`      | Backend media base URL |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API key  |

---

## Available Scripts

### Backend

```bash
python manage.py runserver        # Start dev server
python manage.py makemigrations   # Create migrations
python manage.py migrate          # Apply migrations
python manage.py createsuperuser  # Create admin user
```

### Frontend

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
