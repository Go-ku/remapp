// lib/services/notify.js
import Notification from "../models/Notification";
import { connectDB } from "../db";

export async function createNotification({ recipient, message, type, link = "" }) {
  await connectDB();
  return Notification.create({ recipient, message, type, link });
}

export async function markNotificationAsRead(notificationId) {
  await connectDB();
  return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
}

export async function getUserNotifications(userId, { unreadOnly = false } = {}) {
  await connectDB();
  const query = { recipient: userId };
  if (unreadOnly) query.read = false;
  return Notification.find(query).sort({ createdAt: -1 });
}
