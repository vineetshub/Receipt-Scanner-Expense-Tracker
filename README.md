# �� AI Receipt Scanner

Upload receipt images and get AI-extracted data using OpenAI's GPT-4 Vision API.

## Features

- Upload receipt images (JPG, PNG, PDF)
- AI extracts merchant, date, items, totals, and categories
- Works as standalone HTML or React app

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/vineetshub/Receipt-Scanner-Expense-Tracker.git
cd Receipt-Scanner-Expense-Tracker
npm install
cd backend && npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Add your OpenAI API key to .env
```

### 3. Run

**Option A: Standalone HTML**
```bash
cd backend && npm start
# Open index.html in browser
```

**Option B: React App**
```bash
npm run dev
# Open http://localhost:3000
```

## Tech Stack

- **Frontend**: React/HTML + Tailwind CSS
- **Backend**: Node.js + Express + OpenAI API
- **AI**: GPT-4 Vision for OCR and data extraction

