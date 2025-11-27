# AsCaixa

A financial management system for cash flow control with income and expense transactions.


## 🚀 Features

* **PIN Authentication**: Secure login with 5-digit PIN (viewer or administrator roles)
* **Transaction Management**:
  * Create, edit, and delete income and expense entries
  * Categorize transactions (membership fees, donations, equipment, maintenance, etc.)
  * Track transaction status (confirmed or pending)
  * Add descriptions and due dates
* **Advanced Filtering**:
  * Search by title, category, amount range, date period, and status
  * Multiple filter combinations for precise data queries
* **Monthly Dashboard**:
  * View monthly income and expenses
  * Track total balance across all time
  * Monitor pending transactions
  * Navigate through different months
* **Data Management**:
  * Export entire project or individual collections to JSON
  * Import data to restore or migrate records
  * Delete collections or entire project data
  * View project statistics
* **Pagination**: Organized view with configurable items per page (30, 50, 100, 200)

---

## 🛠 Technologies

* **React 19** with **TypeScript**
* **Material UI** for UI components and theming
* **Zustand** for global state management
* **React Router** for navigation
* **Axios** for HTTP requests
* **Yup** for form validation
* **Styled Components** for custom styling

---

## 🔐 User Roles

* **Viewer**: Read-only access to view transactions
* **Administrator**: Full access (CRUD operations + data management)

---

## ⚙️ Installation & Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/odutradev/ascaixa.git
   cd ascaixa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with required variables:
   ```env
   VITE_BASEURL=your_api_url
   VITE_CONTROL_ACCESS=your_access_key
   VITE_PRODUCTION=false
   VITE_PIN_NORMAL=your_viewer_pin
   VITE_PIN_ADMIN=your_admin_pin
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:7100](http://localhost:7100) in your browser.

---

## 📦 Build for Production

```bash
npm run build
```

---

## 👤 Author

**João Dutra** ([odutradev](https://github.com/odutradev))

## 📄 License

This project is licensed under the [MIT License](LICENSE).