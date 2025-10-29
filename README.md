# Highland AI Calculator

A compliance tracking system for sole traders to manage earnings, expenses, and generate reports for Universal Credit and bankruptcy requirements.

## Features

- Track contract earnings and business expenses
- Automatic profit calculations
- Monthly and yearly summaries
- Tax estimates (Income Tax + National Insurance Class 2 & 4)
- Generate PDF reports for:
  - Universal Credit earnings declarations
  - Bankruptcy trustee income reporting
- All data stored locally on your PC (no cloud, complete privacy)

## Setup Instructions

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and go to:
```
http://localhost:3000
```

## How to Use

### Adding Contracts
1. Fill in the "Add Contract" form with:
   - Date of work/payment
   - Client name
   - Description of work
   - Gross amount earned
   - Payment status (invoiced or received)
   - Optional notes
2. Click "Add Contract" to save

### Adding Expenses
1. Fill in the "Add Expense" form with:
   - Date of expense
   - Category (e.g., Equipment, Travel, Software)
   - Description
   - Amount
   - Optional notes
2. Click "Add Expense" to save

### Viewing Reports
1. Use the month selector at the top to choose which month to view
2. The dashboard shows:
   - Monthly totals (earnings, expenses, profit)
   - Yearly tax estimates
3. All your contracts and expenses are listed below

### Generating Reports
1. Scroll to the "Generate Reports" section
2. Choose the report type:
   - **Universal Credit Report** - Monthly earnings for UC declarations
   - **Bankruptcy Trustee Report** - Income and expenditure for bankruptcy compliance
3. Click the button to download a PDF report

## Important Notes

- All data is stored in your browser's local storage
- Tax calculations use 2024/2025 UK tax year rates
- Tax estimates are for guidance only - consult an accountant for official advice
- Reports generate based on the selected month
- Bankruptcy tracking valid until February 2025

## Data Management

Your data is stored locally in your browser. To backup or transfer data:
1. Open browser Developer Tools (F12)
2. Go to Application > Local Storage
3. Export the data if needed

To clear all data: Clear your browser's local storage for this site.

## Support

This is a local-only application. All processing happens on your computer.
