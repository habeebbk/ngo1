# Village Data Collection System 🌿

A professional, localized NGO data platform built with HTML, JavaScript, and Node.js. This system features a real-time CSV storage model, making it ideal for offline-capable field research and office data management.

## 🚀 Features
- **Dashboard:** Real-time search, filtering, and data visualization.
- **Multi-Step Form:** Logical "one-by-one" data entry wizard for better usability.
- **CSV Storage:** Automatic data persistence to `records.csv` via a local Node.js server.
- **CRUD Capabilities:** Full support for creating, reading, updating (editing), and deleting records.
- **Data Export:** Built-in feature to download the latest dataset as a CSV file.
- **Professional UI:** Clean, light-themed "Office Use" design with a responsive layout.

## 🛠️ Tech Stack
- **Frontend:** Vanilla HTML5, CSS3 (Inter & Outfit fonts), JavaScript (ES6+).
- **Backend:** Node.js, Express.js.
- **Database:** Local CSV File (File-based persistence).

## 📦 Installation & Setup
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Access the platform at `http://localhost:3000`.

## 📁 File Structure
- `index.html`: Main Village Insights Dashboard.
- `data.html`: Multi-step data collection form.
- `server.js`: Node.js server handling file storage and API.
- `records.csv`: Automatically generated data storage file.

---
Built for NGO data management and rural development tracking.
