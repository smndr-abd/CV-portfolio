# Samandar Abdujabbarov — Portfolio

A modern, dark-themed React portfolio built with Vite.

## Setup

```bash
npm install
npm run dev
```

## 🔧 Things to customize

### 1. Fix your email
In `Contact.jsx`, update the email address and phone number.

### 2. Add real projects
Replace the placeholder SVGs in `MyWork.jsx` with actual screenshots of your work. Add real links to each project.

### 3. Connect the contact form
The form is wired up and ready. Sign up at [formspree.io](https://formspree.io), create a form, and replace `YOUR_FORM_ID` in `Contact.jsx`.

### 4. Update social links
In `Contact.jsx`, replace the GitHub and LinkedIn `href` values with your real profiles.

### 5. Add your resume
In `Hero.jsx`, the "View My Work" button is linked. If you want a "Download Resume" button, add your PDF to the `public/` folder and link to it.

## Stack
- React 18 + Vite
- Syne + DM Mono (Google Fonts)
- react-anchor-link-smooth-scroll
- No UI library — all custom CSS

## Deploy
```bash
npm run build
# Then deploy the /dist folder to Vercel, Netlify, or GitHub Pages
```
