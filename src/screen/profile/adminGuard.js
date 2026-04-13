// router/guards/adminGuard.js
import { useAuthStore } from '../../store/authStore'

export const adminGuard = async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Check if user is logged in
  if (!authStore.isAuthenticated) {
    // Redirect to login
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }
  
  // Check if user has admin phone number
  const userPhone = authStore.user?.phone_number || authStore.user?.phone;
  const adminPhones = ['683307420', '748090224', '672572874', '745211365'];
  
  // Also check from backend to be safe
  try {
    const response = await fetch('/api/auth/check-admin', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    const data = await response.json();
    
    if (data.isAdmin) {
      return next();
    } else {
      // Not admin - redirect to home or show error
      return next({ name: 'home' });
    }
  } catch (error) {
    console.error('Admin check failed:', error);
    return next({ name: 'home' });
  }
};