// stores/notificationStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../../services/api'
import { useAuthStore } from '../authStore'

export const useNotificationStore = defineStore('notification', () => {
  // ============ STATE ============
  const notifications = ref([])
  const unreadCount = ref(0)
  const isLoading = ref(false)
  const error = ref(null)
  const selectedUserNotifications = ref([])
  const allNotifications = ref([])
  const notificationsTotal = ref(0)
  const sendingNotification = ref(false)
  const sendingBroadcast = ref(false)

  // ============ GETTERS ============
  const hasNotifications = computed(() => notifications.value.length > 0)
  const hasUnread = computed(() => unreadCount.value > 0)

  // ============ HELPER FUNCTIONS ============
  const persistToStorage = () => {
    if (notifications.value.length > 0) {
      localStorage.setItem('user_notifications', JSON.stringify(notifications.value))
    } else {
      localStorage.removeItem('user_notifications')
    }
    
    if (unreadCount.value !== undefined) {
      localStorage.setItem('user_unread_count', unreadCount.value.toString())
    } else {
      localStorage.removeItem('user_unread_count')
    }
  }

  const loadFromStorage = () => {
    const storedNotifications = localStorage.getItem('user_notifications')
    const storedUnreadCount = localStorage.getItem('user_unread_count')
    
    if (storedNotifications) {
      notifications.value = JSON.parse(storedNotifications)
    }
    
    if (storedUnreadCount) {
      unreadCount.value = parseInt(storedUnreadCount)
    }
  }

  // ============ USER NOTIFICATIONS ACTIONS ============
  
  /**
   * Fetch current user's notifications
   * @param {number} limit - Number of notifications to fetch
   * @param {number} offset - Pagination offset
   * @param {boolean} unreadOnly - Fetch only unread notifications
   */
  const fetchMyNotifications = async (limit = 50, offset = 0, unreadOnly = false) => {
    isLoading.value = true
    error.value = null
    
    try {
      const params = { limit, offset }
      if (unreadOnly) params.unreadOnly = true
      
      const response = await api.get('/notifications/my', { params })
      
      if (response.data?.success) {
        notifications.value = response.data.data.notifications || []
        notificationsTotal.value = response.data.data.total || 0
        
        // Update unread count
        if (!unreadOnly) {
          unreadCount.value = notifications.value.filter(n => !n.is_read).length
        }
        
        persistToStorage()
        
        return { 
          success: true, 
          data: response.data.data,
          notifications: notifications.value,
          total: notificationsTotal.value
        }
      }
      
      return { success: false, message: response.data?.message || 'Failed to fetch notifications' }
    } catch (err) {
      console.error('Fetch notifications error:', err)
      error.value = err.message || 'Failed to fetch notifications'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch only unread count for current user
   */
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/my/unread-count')
      
      if (response.data?.success) {
        unreadCount.value = response.data.data.unread_count || 0
        persistToStorage()
        return { success: true, count: unreadCount.value }
      }
      
      return { success: false, count: 0 }
    } catch (err) {
      console.error('Fetch unread count error:', err)
      return { success: false, count: 0 }
    }
  }

  /**
   * Mark a single notification as read
   * @param {string} notificationId 
   */
  const markAsRead = async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`)
      
      if (response.data?.success) {
        // Update local state
        const notification = notifications.value.find(n => n.id === notificationId)
        if (notification && !notification.is_read) {
          notification.is_read = true
          unreadCount.value = Math.max(0, unreadCount.value - 1)
          persistToStorage()
        }
        
        return { success: true, message: 'Notification marked as read' }
      }
      
      return { success: false, message: response.data?.message || 'Failed to mark as read' }
    } catch (err) {
      console.error('Mark as read error:', err)
      return { success: false, message: err.message }
    }
  }

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    try {
      const response = await api.put('/notifications/read-all')
      
      if (response.data?.success) {
        // Update local state
        notifications.value.forEach(n => {
          if (!n.is_read) n.is_read = true
        })
        unreadCount.value = 0
        persistToStorage()
        
        return { success: true, message: response.data.message || 'All notifications marked as read' }
      }
      
      return { success: false, message: response.data?.message || 'Failed to mark all as read' }
    } catch (err) {
      console.error('Mark all as read error:', err)
      return { success: false, message: err.message }
    }
  }

  /**
   * Delete a notification
   * @param {string} notificationId 
   */
  const deleteNotification = async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`)
      
      if (response.data?.success) {
        // Update local state
        const index = notifications.value.findIndex(n => n.id === notificationId)
        if (index !== -1) {
          const wasUnread = !notifications.value[index].is_read
          notifications.value.splice(index, 1)
          if (wasUnread) {
            unreadCount.value = Math.max(0, unreadCount.value - 1)
          }
          persistToStorage()
        }
        
        return { success: true, message: 'Notification deleted' }
      }
      
      return { success: false, message: response.data?.message || 'Failed to delete notification' }
    } catch (err) {
      console.error('Delete notification error:', err)
      return { success: false, message: err.message }
    }
  }

  // ============ ADMIN NOTIFICATION ACTIONS ============

  /**
   * ADMIN: Send notification to a single user by phone number
   * @param {string} phoneNumber 
   * @param {string} title 
   * @param {string} message 
   * @param {string} type 
   * @param {object} metadata 
   */
  const adminSendToUser = async (phoneNumber, title, message, type = 'info', metadata = null) => {
    sendingNotification.value = true
    error.value = null
    
    try {
      const response = await api.post('/notifications/admin/send', {
        phone_number: phoneNumber,
        title,
        message,
        type,
        metadata
      })
      
      if (response.data?.success) {
        return { 
          success: true, 
          message: response.data.message || 'Notification sent successfully',
          data: response.data.data
        }
      }
      
      return { success: false, message: response.data?.message || 'Failed to send notification' }
    } catch (err) {
      console.error('Admin send to user error:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to send notification'
      return { success: false, message: error.value }
    } finally {
      sendingNotification.value = false
    }
  }

  /**
   * ADMIN: Send notification to multiple users by phone numbers
   * @param {string[]} phoneNumbers 
   * @param {string} title 
   * @param {string} message 
   * @param {string} type 
   * @param {object} metadata 
   */
  const adminSendToMultipleUsers = async (phoneNumbers, title, message, type = 'info', metadata = null) => {
    sendingNotification.value = true
    error.value = null
    
    try {
      const response = await api.post('/notifications/admin/send-multiple', {
        phone_numbers: phoneNumbers,
        title,
        message,
        type,
        metadata
      })
      
      if (response.data?.success) {
        return { 
          success: true, 
          message: response.data.message || 'Notifications sent successfully',
          data: response.data.data
        }
      }
      
      return { success: false, message: response.data?.message || 'Failed to send notifications' }
    } catch (err) {
      console.error('Admin send to multiple error:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to send notifications'
      return { success: false, message: error.value }
    } finally {
      sendingNotification.value = false
    }
  }

  /**
   * ADMIN: Send broadcast notification to all users
   * @param {string} title 
   * @param {string} message 
   * @param {string} type 
   * @param {object} metadata 
   */
  const adminSendBroadcast = async (title, message, type = 'promotion', metadata = null) => {
    sendingBroadcast.value = true
    error.value = null
    
    try {
      const response = await api.post('/notifications/admin/send-all', {
        title,
        message,
        type,
        metadata
      })
      
      if (response.data?.success) {
        return { 
          success: true, 
          message: response.data.message || 'Broadcast sent successfully',
          data: response.data.data
        }
      }
      
      return { success: false, message: response.data?.message || 'Failed to send broadcast' }
    } catch (err) {
      console.error('Admin send broadcast error:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to send broadcast'
      return { success: false, message: error.value }
    } finally {
      sendingBroadcast.value = false
    }
  }

  /**
   * ADMIN: Get all notifications (system-wide)
   * @param {number} limit 
   * @param {number} offset 
   * @param {object} filters 
   */
  const adminGetAllNotifications = async (limit = 100, offset = 0, filters = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      const params = { limit, offset, ...filters }
      const response = await api.get('/notifications/admin/all', { params })
      
      if (response.data?.success) {
        allNotifications.value = response.data.data.notifications || []
        notificationsTotal.value = response.data.data.total || 0
        
        return { 
          success: true, 
          data: response.data.data,
          notifications: allNotifications.value,
          total: notificationsTotal.value
        }
      }
      
      return { success: false, message: response.data?.message || 'Failed to fetch notifications' }
    } catch (err) {
      console.error('Admin get all notifications error:', err)
      error.value = err.message || 'Failed to fetch notifications'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * ADMIN: Get notifications for a specific user by phone number
   * @param {string} phoneNumber 
   * @param {number} limit 
   */
  const adminGetUserNotifications = async (phoneNumber, limit = 50) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/notifications/admin/user/${phoneNumber}`, {
        params: { limit }
      })
      
      if (response.data?.success) {
        selectedUserNotifications.value = response.data.data.notifications || []
        
        return { 
          success: true, 
          data: response.data.data,
          notifications: selectedUserNotifications.value,
          total: response.data.data.total || 0
        }
      }
      
      return { success: false, message: response.data?.message || 'Failed to fetch user notifications' }
    } catch (err) {
      console.error('Admin get user notifications error:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to fetch user notifications'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * ADMIN: Check if user exists by phone number
   * @param {string} phoneNumber 
   */
  const adminCheckUserExists = async (phoneNumber) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/notifications/admin/check/${phoneNumber}`)
      
      if (response.data?.success) {
        return { 
          success: true, 
          exists: response.data.data.exists,
          user: response.data.data.user
        }
      }
      
      return { success: false, exists: false, user: null }
    } catch (err) {
      console.error('Admin check user error:', err)
      error.value = err.message || 'Failed to check user'
      return { success: false, exists: false, user: null }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * ADMIN: Get unread count for a specific user by phone number
   * @param {string} phoneNumber 
   */
  const adminGetUserUnreadCount = async (phoneNumber) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/notifications/admin/unread-count/${phoneNumber}`)
      
      if (response.data?.success) {
        return { 
          success: true, 
          unread_count: response.data.data.unread_count
        }
      }
      
      return { success: false, unread_count: 0 }
    } catch (err) {
      console.error('Admin get user unread count error:', err)
      error.value = err.message || 'Failed to get unread count'
      return { success: false, unread_count: 0 }
    } finally {
      isLoading.value = false
    }
  }

  // ============ CLEAR/CACHE ACTIONS ============

  /**
   * Clear all notification state (used on logout)
   */
  const clearNotifications = () => {
    notifications.value = []
    unreadCount.value = 0
    selectedUserNotifications.value = []
    allNotifications.value = []
    notificationsTotal.value = 0
    error.value = null
    
    localStorage.removeItem('user_notifications')
    localStorage.removeItem('user_unread_count')
  }

  /**
   * Refresh current user's notifications (useful after new notification arrives)
   */
  const refreshMyNotifications = async () => {
    await fetchUnreadCount()
    await fetchMyNotifications(50, 0, false)
  }

  // ============ INITIALIZATION ============
  
  // Load cached data on store creation
  loadFromStorage()

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    selectedUserNotifications,
    allNotifications,
    notificationsTotal,
    sendingNotification,
    sendingBroadcast,
    
    // Getters
    hasNotifications,
    hasUnread,
    
    // User Actions
    fetchMyNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshMyNotifications,
    
    // Admin Actions
    adminSendToUser,
    adminSendToMultipleUsers,
    adminSendBroadcast,
    adminGetAllNotifications,
    adminGetUserNotifications,
    adminCheckUserExists,
    adminGetUserUnreadCount,
    
    // Utility
    clearNotifications
  }
})