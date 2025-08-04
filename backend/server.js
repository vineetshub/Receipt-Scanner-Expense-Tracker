const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory storage (replace with database in production)
let receipts = [];

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads';
    await fs.ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed!'));
    }
  }
});

// Helper function to extract text from image using OpenAI Vision API
async function extractTextFromImage(imagePath) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all the text from this receipt image. Return only the raw text without any formatting or interpretation."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${fs.readFileSync(imagePath, 'base64')}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from image');
  }
}

// Helper function to parse receipt data using GPT-4
async function parseReceiptData(rawText) {
  try {
    const prompt = `Here's a receipt:
${rawText}

Extract the following information and return it as valid JSON:
- merchant: The name of the store/merchant
- date: The date in YYYY-MM-DD format
- items: Array of objects with name and price for each item
- subtotal: The subtotal amount (number)
- tax: The tax amount (number)
- total: The total amount (number)
- category: One of: Food, Travel, Grocery, Entertainment, Transportation, Shopping, Healthcare, Utilities, Other
- paymentMethod: The payment method if available (optional)

Example response format:
{
  "merchant": "Chipotle",
  "date": "2024-01-15",
  "items": [
    {"name": "Burrito", "price": 9.99},
    {"name": "Drink", "price": 2.00}
  ],
  "subtotal": 11.99,
  "tax": 0.85,
  "total": 12.84,
  "category": "Food",
  "paymentMethod": "Credit Card"
}

Return only the JSON, no additional text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error parsing receipt data:', error);
    throw new Error('Failed to parse receipt data');
  }
}

// API Routes

// Upload and process receipt
app.post('/api/receipts/upload', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const imagePath = req.file.path;
    const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;

    // Extract text from image
    const rawText = await extractTextFromImage(imagePath);

    // Parse receipt data using AI
    const parsedData = await parseReceiptData(rawText);

    // Create receipt object
    const receipt = {
      id: uuidv4(),
      imageUrl,
      parsedData,
      rawText,
      uploadedAt: new Date().toISOString()
    };

    // Store receipt (in memory for now)
    receipts.unshift(receipt);

    res.json({
      success: true,
      data: receipt
    });

  } catch (error) {
    console.error('Error processing receipt:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process receipt'
    });
  }
});

// Get all receipts
app.get('/api/receipts', (req, res) => {
  res.json(receipts);
});

// Get dashboard statistics
app.get('/api/receipts/stats', (req, res) => {
  try {
    const totalSpent = receipts.reduce((sum, receipt) => sum + receipt.parsedData.total, 0);
    const totalReceipts = receipts.length;

    // Calculate monthly spending
    const monthlySpending = {};
    receipts.forEach(receipt => {
      const month = receipt.parsedData.date.substring(0, 7); // YYYY-MM
      monthlySpending[month] = (monthlySpending[month] || 0) + receipt.parsedData.total;
    });

    const monthlySpendingArray = Object.entries(monthlySpending)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate category breakdown
    const categoryBreakdown = {};
    receipts.forEach(receipt => {
      const category = receipt.parsedData.category;
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + receipt.parsedData.total;
    });

    const categoryBreakdownArray = Object.entries(categoryBreakdown)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    res.json({
      totalSpent,
      totalReceipts,
      monthlySpending: monthlySpendingArray,
      categoryBreakdown: categoryBreakdownArray
    });

  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({
      error: 'Failed to calculate statistics'
    });
  }
});

// Delete receipt
app.delete('/api/receipts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const receiptIndex = receipts.findIndex(r => r.id === id);
    
    if (receiptIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Receipt not found'
      });
    }

    const receipt = receipts[receiptIndex];
    
    // Delete file from filesystem
    const filePath = receipt.imageUrl.replace(`${req.protocol}://${req.get('host')}/`, '');
    try {
      await fs.remove(filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
    }

    // Remove from memory
    receipts.splice(receiptIndex, 1);

    res.json({
      success: true,
      message: 'Receipt deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete receipt'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    receiptsCount: receipts.length
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 