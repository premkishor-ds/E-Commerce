# ApexStore Platform Workspace

This workspace contains all environments and user consoles for the ApexStore E-Commerce system.

---

## 📁 Project Structure

| Folder       | Role                              | Port   |
|--------------|-----------------------------------|--------|
| `backend`    | NestJS REST API                   | `5001` |
| `customer`   | Customer Storefront (B2C)         | `3000` |
| `admin`      | Admin Dashboard                   | `3004` |
| `seller`     | Seller Console                    | `3002` |
| `vendor`     | Vendor Console                    | `3003` |

---

## 🔐 Credentials & Port Directory

### 1. Customer Storefront (B2C Shopping)
* **URL**: [http://localhost:3000](http://localhost:3000)
* **Access Role**: `Customer`
* **Login Credentials**:
  * **Email**: `newuser@example.com`
  * **Password**: `Password123!`
  * *Alternatively*: Click **Google** or **GitHub** buttons to bypass, or input any phone number and use OTP **`123456`**.

### 2. Seller Console (Store & Inventory Management)
* **URL**: [http://localhost:3002](http://localhost:3002)
* **Access Role**: `Seller`
* **Login Credentials**:
  * **Email**: *Any valid email address* (e.g., `seller@example.com`)
  * **Password**: *Any password* (e.g., `password123`)

### 3. Vendor Console (Wholesale & Payout Settlements)
* **URL**: [http://localhost:3003](http://localhost:3003)
* **Access Role**: `Vendor`
* **Login Credentials**:
  * **Email**: *Any valid email address* (e.g., `vendor@example.com`)
  * **Password**: *Any password* (e.g., `password123`)

### 4. Admin Dashboard (Platform Management)
* **URL**: [http://localhost:3004](http://localhost:3004)
* **Access Role**: `Admin` / `Super Admin`
* **Login Credentials**:
  * **Email**: `admin@example.com`
  * **Password**: `AdminPassword123!`

---

## 🚀 Running Dev Servers

```bash
# Backend API (port 5001)
cd backend && npm run start

# Customer Storefront (port 3000)
cd customer && npm run dev

# Admin Dashboard (port 3004)
cd admin && npm install && npm run dev

# Seller Console (port 3002)
cd seller && npm run dev

# Vendor Console (port 3003)
cd vendor && npm run dev
```
