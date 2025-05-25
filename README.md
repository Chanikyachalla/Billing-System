# 🧾 Offline Billing and Stock Management System

An offline desktop application for hardware and electrical shops to efficiently manage stock, perform billing, apply discounts, and generate printable PDF bills — all without needing an internet connection.

## 🚀 Features

### 🧮 Billing System
- Add items **one-by-one** with dynamic search and autocomplete.
- Apply **optional per-item discounts or hikes** as percentages.
- Apply an **overall discount on the total amount**.
- Preview bill **before confirming**.
- Print preview available before saving or confirming.
- Confirming the bill **deducts stock quantities** automatically.
- Final bill displays **only discounts** (hikes are for internal calculation).
- Bills are generated as **printable PDFs**.

### 🧾 Bill History
- Bills are grouped **day-wise**.
- Each entry shows **timestamp, total after discount**, and all item details.
- **Daily summary** is shown with total billing amount of that day.

### 🗃️ Stock Management
- Add/update items with name, rate, and quantity.
- Stock is updated automatically after billing.
- All stock operations are done **offline**.

### 💻 Offline Desktop App (Electron)
- Built using **Electron**, **Node.js**, **EJS**, and **JavaScript**.
- Fully functional **without internet**.
- Clean MVC structure — easy to extend and maintain.
- you can download it here 
 [https://drive.google.com/drive/folders/11sUAdXMh7laZg9u_GUJdI7Xt8ecZK1m9?usp=sharing]

## 🧰 Tech Stack

- 💻 **Frontend:** HTML, CSS, TailwindCSS, JavaScript, EJS
- ⚙️ **Backend:** Node.js, Express.js
- 🧠 **State & Logic:** Local file storage (JSON-based for offline use)
- 📦 **Desktop Integration:** Electron
- 🧾 **PDF Generation:** html-pdf
- 🔍 **Autocomplete & Live Search:** JavaScript + backend APIs

---

## 🛠️ Installation & Setup

### 📁 Prerequisites

- Node.js (v16+ recommended)
- Git



### 📥 Clone the Repository

```bash
git clone https://github.com/your-username/billing-system.git
cd billing-system


 


