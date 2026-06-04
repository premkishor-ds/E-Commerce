# ApexStore Platform Workspace

This workspace contains all environments and user consoles for the ApexStore E-Commerce system. Each user group has its own dedicated application running on a separate port.

---

## 🔐 Credentials & Port Directory

### 1. Customer Storefront (B2C Shopping)
* **URL**: [http://localhost:3000](http://localhost:3000)
* **Access Role**: `Customer`
* **Login Credentials**:
  * **Email**: *Any valid email address* (e.g., `customer@example.com`)
  * **Password**: *Any password* (e.g., `password123`)
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
  * *Action*: Simulates requesting transfers of pending payout balances to bank accounts.

### 4. Admin Dashboard (Platform Settings & Audit Logs)
* **URL**: [http://localhost:5001/admin](http://localhost:5001/admin)
* **Access Role**: `Admin` / `Super Admin`
* **Login Credentials**:
  * **Email**: `admin@example.com`
  * **Password**: `AdminPassword123!`

---

## 🚀 Running Dev Servers

To boot the entire ecosystem, make sure all services are running:

* **Backend API**: `npm run start` inside the `/backend` folder (port `5001`)
* **Customer Storefront**: `npm run dev` inside the `/frontend` folder (port `3000`)
* **Seller Console**: `npm run dev` inside the `/seller` folder (port `3002`)
* **Vendor Console**: `npm run dev` inside the `/vendor` folder (port `3003`)
