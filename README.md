# 🔰 AI-Powered Receipt Scanner & Expense Tracker

A modern web application that uses AI to automatically extract and categorize expense information from receipt images.

## ✨ Features

- **📸 Smart Receipt Upload**: Drag & drop or click to upload receipt images (JPG, PNG, PDF)
- **🔍 AI-Powered OCR**: Uses OpenAI's GPT-4 Vision API for accurate text extraction
- **🧠 Intelligent Parsing**: GPT-4 automatically extracts merchant, date, items, totals, and categorizes expenses
- **📊 Beautiful Dashboard**: Interactive charts showing spending trends and category breakdowns
- **🔍 Advanced Filtering**: Search, filter by category, and sort receipts by date, amount, or merchant
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Dropzone** for file uploads
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **OpenAI GPT-4 & Vision API** for AI processing
- **Multer** for file upload handling
- **CORS** for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- OpenAI API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Receipt-Scanner-Expense-Tracker
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 4. Start the Application
```bash
# Start both frontend and backend (recommended)
npm run dev

# Or start them separately:
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
cd backend && npm run dev
```

### 5. Open Your Browser
Navigate to `http://localhost:3000` to see the application.

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/receipts/upload` | Upload and process a receipt |
| `GET` | `/api/receipts` | Get all receipts |
| `GET` | `/api/receipts/stats` | Get dashboard statistics |
| `DELETE` | `/api/receipts/:id` | Delete a receipt |
| `GET` | `/api/health` | Health check |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
PORT=5000
```

### Getting an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the key and add it to your `.env` file

## 📱 Usage

### Uploading Receipts
1. Click the upload area or drag & drop a receipt image
2. The AI will automatically extract text and parse the data
3. Review the extracted information
4. The receipt is automatically saved and categorized

### Viewing Dashboard
- **Overview Cards**: Total spent, receipt count, average per receipt, monthly spending
- **Monthly Spending Chart**: Bar chart showing spending trends over time
- **Category Breakdown**: Pie chart showing spending by category
- **Recent Receipts**: Latest uploaded receipts with quick access

### Managing Receipts
- **Search**: Find receipts by merchant name or category
- **Filter**: Filter by expense category
- **Sort**: Sort by date, amount, or merchant name
- **View**: Click the eye icon to view the original receipt image
- **Delete**: Remove receipts you no longer need

## 🎯 AI Processing Pipeline

1. **Image Upload**: User uploads receipt image
2. **OCR Extraction**: GPT-4 Vision API extracts all text from the image
3. **Data Parsing**: GPT-4 analyzes the text and extracts structured data:
   - Merchant name
   - Date
   - Individual items and prices
   - Subtotal, tax, and total amounts
   - Expense category
   - Payment method (if available)
4. **Storage**: Parsed data is stored with the original image
5. **Dashboard Update**: Statistics and charts are automatically updated

## 🏗️ Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── ReceiptUpload.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ReceiptList.tsx
│   │   └── LoadingSpinner.tsx
│   ├── services/           # API services
│   │   └── api.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx             # Main app component
│   └── index.tsx           # App entry point
├── backend/
│   ├── server.js           # Express server
│   ├── package.json        # Backend dependencies
│   └── uploads/            # Uploaded files (auto-created)
├── public/                 # Static assets
└── package.json            # Frontend dependencies
```

## 🔮 Future Enhancements

- [ ] **User Authentication**: Multi-user support with login/signup
- [ ] **Database Integration**: Replace in-memory storage with MongoDB/PostgreSQL
- [ ] **Export Features**: Export data to CSV, PDF reports
- [ ] **Budget Tracking**: Set budgets and get alerts
- [ ] **Receipt Templates**: Support for different receipt formats
- [ ] **Mobile App**: React Native version
- [ ] **Cloud Storage**: Store images in AWS S3 or similar
- [ ] **Advanced Analytics**: More detailed spending insights


## 🆘 Support

If you encounter any issues:

1. Check that your OpenAI API key is valid and has sufficient credits
2. Ensure all dependencies are installed correctly
3. Check the browser console and server logs for error messages
4. Verify that the backend server is running on port 5000

## 💡 Tips for Best Results

- **Image Quality**: Use clear, well-lit photos of receipts
- **File Size**: Keep images under 10MB for faster processing
- **Format**: JPG, PNG, and PDF files are supported
- **Orientation**: Ensure text is readable and not rotated

