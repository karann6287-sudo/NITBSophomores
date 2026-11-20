# 📚 NITBSophomores

![Home Page](./assets/screenshots/Home.png)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

NITBSophomores is a centralized platform built for **Electrical Engineering students of MANIT Bhopal** to access semester-wise study materials, previous year papers, notes, books, assignments, and lab manuals in one place.

🌐 **Live Website:** **https://nitbsophomores.netlify.app/**

---

## ✨ Features

- 📚 Semester-wise organization of study materials
- 📖 Subject-wise resource categorization
- 📝 Notes, Books & Previous Year Papers
- 📋 Assignments & Lab Manuals
- 🌙 Dark / Light Theme
- 📱 Fully Responsive Design
- ⚡ Fast and optimized with Vite

---

- ⚛️ React
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧭 React Router DOM
- 💻 JavaScript (ES6+)

---

## 📸 Screenshots

### Home Page

![Home Page](./assets/screenshots/Home.png)

### Subject Page

![Subject Page](./assets/screenshots/resources.png)

### Mobile View

![Mobile View](./assets/screenshots/Home-mobile.png)

---

## 👨‍💻 Author

**Karan Verma**

- GitHub: [karann6287-sudo](https://github.com/karann6287-sudo)
- LinkedIn: [Karan Verma](https://www.linkedin.com/in/karan-verma-48262a363/)

⭐ If you found this project useful, consider starring the repository!

---

## Private Google Drive PDF proxy

The Netlify Function at `/.netlify/functions/pdf?id=FILE_ID` serves PDFs from
files shared with a Google Cloud service account. The PDFs remain Restricted
in the owner's personal Google Drive.

### Google Cloud setup

1. Create or select a Google Cloud project.
2. Enable the Google Drive API.
3. Create a service account and generate a JSON key.
4. In Google Drive, share the PDF files or a dedicated PDF folder with the
   service-account email address (`client_email`) as **Viewer**.
5. Do not enable public sharing. Domain-wide delegation is not required.

### Netlify environment variables

Set this variable in Netlify:

```text
GOOGLE_SERVICE_ACCOUNT_JSON=<complete service-account JSON>
```

The value may be the raw JSON or its base64 encoding.

Optional:

```text
PDF_PROXY_MAX_BYTES=52428800
```

The default is 50 MB. Files exceeding this limit return an error instead of
being buffered into an oversized function response.

### Local test

Set `GOOGLE_SERVICE_ACCOUNT_JSON` in the local shell or Netlify CLI environment
and run:

```text
netlify dev
```

Then request one allowed file ID from `pdfFiles.json`:

```text
http://localhost:8888/.netlify/functions/pdf?id=GOOGLE_DRIVE_FILE_ID
```

Verify:

- The response is `200` and `Content-Type: application/pdf`.
- `Content-Length` is present.
- Restricted Drive sharing remains unchanged.
- An unknown ID returns `404`.
- Credentials never appear in browser responses or browser network URLs.

The function forwards one valid `Range` header to Google when supplied. It
returns `206` only when Google returns a valid `206` and `Content-Range`.
Otherwise it safely returns the complete PDF as `200`. Google credentials and
API error details are never returned to callers.
