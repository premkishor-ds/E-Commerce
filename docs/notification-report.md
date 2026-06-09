# Notification Center Report

This report documents the notification system architecture.

---

## 1. Multi-Channel Messaging
- **Channels**: Supports Nodemailer (SMTP), Twilio (SMS / WhatsApp), and In-App WebSocket notifications.
- **Delivery Priorities**: Critical transactions (e.g. 2FA OTP, order status) are sent with immediate delivery guarantees.

---

## 2. Notification Preferences
- Users can customize notification types (e.g., disable promo emails but keep delivery SMS alerts) inside their profiles.
