# Saviora Dental Platform

Premium dental clinic website with reservation booking, admin dashboard, and email workflow.

## Stack

- Frontend: React + Vite, Tailwind CSS, Framer Motion, FullCalendar, Axios
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth, Nodemailer, Socket.io

## Features

- Patient booking form with date/time slot availability checks
- Doctors listing with timings
- Services and testimonials pages
- Before/after gallery
- Contact page with map embed and emergency actions
- Admin dashboard with calendar, appointment approvals, and basic patient records
- Email notifications for patients and doctor alerts
- Dark mode, English/Urdu toggle, WhatsApp button, simple AI FAQ chatbot, live chat panel
- Mobile-responsive navigation and layout system
- Real-time admin refresh hooks with Socket.io events on booking/status changes

## Project Structure

- client/src/components
- client/src/pages
- client/src/utils
- server/controllers
- server/models
- server/routes
- server/services

## Setup

1. Install dependencies
   - `npm install`
   - `cd client && npm install`
   - `cd ../server && npm install`
2. Configure environment files
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env`
3. Start MongoDB locally (or use Atlas URI)
4. Run both apps from root
   - `npm run dev`

## Setup Admin + Doctors (One Command)

- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`
- Run `npm run setup` from project root
- This command ensures default doctors exist and creates/updates the admin account
- Login at `/login` using admin credentials

## Security Included

- JWT-based auth
- Input validation with `express-validator`
- HTTP hardening with `helmet`
- Rate limiting on API requests

## Notes

- Slot algorithm:
  - If selected doctor/date/time exists in database => unavailable
  - Else => booking is stored, emails sent, calendar updated
- WhatsApp integration:
   - Floating button: `https://wa.me/923001234567`
   - Contact page direct WhatsApp CTA included
- For production, set HTTPS and secure SMTP credentials.
