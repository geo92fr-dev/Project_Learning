// Admin Store - RBAC management with TypeScript strict compliance
import { writable, derived, get } from 'svelte/store';
import { z } from 'zod';
import DOMPurify from 'dompurify';

// Types et enums
export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

// Permissions Schema avec z.record pour les permissions
export const PermissionsSchema = z.record(z.string(), z.array(z.enum(['create', 'read', 'update', 'delete'])));

// AdminUser Schema avec permissions typées
export const AdminUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['admin', 'super_admin', 'moderator']),
  permissions: PermissionsSchema,
  isActive: z.boolean(),
  lastLogin: z.string().nullable(),
  createdAt: z.string(),
  avatar: z.string().url().optional()
});

// SystemStats Schema
export const SystemStatsSchema = z.object({
  totalUsers: z.number().min(0),
  totalCourses: z.number().min(0),
  activeUsers: z.number().min(0),
  totalRevenue: z.number().min(0),
  systemLoad: z.number().min(0).max(100),
  memoryUsage: z.number().min(0).max(100),
  diskUsage: z.number().min(0).max(100),
  lastUpdated: z.string()
});

// AdminNotification Schema avec toutes les propriétés requises
export const AdminNotificationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['info', 'warning', 'error', 'success']),
  isRead: z.boolean(),
  createdAt: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  metadata: z.object({
    category: z.string().optional(),
    url: z.string().optional(),
    userId: z.string().optional()
  }),
  actions: z.array(z.object({
    label: z.string(),
    action: z.string(),
    variant: z.enum(['primary', 'secondary', 'danger']).optional()
  })).optional()
});

// Types TypeScript inférés
export type AdminUser = z.infer<typeof AdminUserSchema>;
export type SystemStats = z.infer<typeof SystemStatsSchema>;
export type AdminNotification = z.infer<typeof AdminNotificationSchema>;
export type Permissions = z.infer<typeof PermissionsSchema>;

// Interface de l'état admin
interface AdminState {
  currentUser: AdminUser | null;
  users: AdminUser[];
  systemStats: SystemStats | null;
  notifications: AdminNotification[];
  isLoading: boolean;
  error: string | null;
  selectedTab: string;
}

// État initial
const initialAdminState: AdminState = {
  currentUser: null,
  users: [],
  systemStats: null,
  notifications: [],
  isLoading: false,
  error: null,
  selectedTab: 'dashboard'
};

// Store principal
export const adminState = writable<AdminState>(initialAdminState);

// Stores dérivés
export const currentAdminUser = derived(adminState, ($state) => $state.currentUser);
export const adminUsers = derived(adminState, ($state) => $state.users);
export const systemStats = derived(adminState, ($state) => $state.systemStats);
export const adminNotifications = derived(adminState, ($state) => $state.notifications);
export const unreadNotificationsCount = derived(adminNotifications, ($notifications) => 
  $notifications.filter(n => !n.isRead).length
);
export const isAdminLoading = derived(adminState, ($state) => $state.isLoading);
export const adminError = derived(adminState, ($state) => $state.error);

// Mock data pour développement
const mockAdminUser: AdminUser = {
  id: 'admin-1',
  email: 'admin@example.com',
  name: 'Admin Principal',
  role: 'super_admin',
  permissions: {
    users: ['create', 'read', 'update', 'delete'],
    courses: ['create', 'read', 'update', 'delete'],
    analytics: ['read'],
    system: ['read', 'update']
  },
  isActive: true,
  lastLogin: '2024-01-15T10:30:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  avatar: 'https://ui-avatars.com/api/?name=Admin+Principal'
};

const mockSystemStats: SystemStats = {
  totalUsers: 1250,
  totalCourses: 45,
  activeUsers: 890,
  totalRevenue: 25780,
  systemLoad: 65,
  memoryUsage: 78,
  diskUsage: 45,
  lastUpdated: '2024-01-15T10:30:00Z'
};

const mockNotifications: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'Nouvelle inscription',
    message: '5 nouveaux utilisateurs se sont inscrits',
    type: 'info',
    isRead: false,
    createdAt: '2024-01-15T10:00:00Z',
    priority: 'medium',
    metadata: { category: 'users' },
    actions: [
      { label: 'Voir', action: 'view-users', variant: 'primary' }
    ]
  },
  {
    id: 'notif-2',
    title: 'Erreur système',
    message: 'Problème détecté dans le module de paiement',
    type: 'error',
    isRead: false,
    createdAt: '2024-01-15T09:45:00Z',
    priority: 'high',
    metadata: { category: 'system' },
    actions: [
      { label: 'Diagnostiquer', action: 'diagnose', variant: 'danger' }
    ]
  }
];

// Utilitaires de permission
export function hasPermission(user: AdminUser, resource: string, action: PermissionAction): boolean {
  const userPermissions = user.permissions[resource];
  return Array.isArray(userPermissions) && userPermissions.includes(action);
}

export function hasAnyPermission(user: AdminUser, resource: string, actions: PermissionAction[]): boolean {
  return actions.some(action => hasPermission(user, resource, action));
}

export function hasRole(user: AdminUser, role: AdminUser['role']): boolean {
  return user.role === role;
}

export function isSuperAdmin(user: AdminUser): boolean {
  return user.role === 'super_admin';
}

// Actions du store
export const adminActions = {
  // Initialisation
  async initialize(): Promise<void> {
    adminState.update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validation des données mock
      const validatedUser = AdminUserSchema.parse(mockAdminUser);
      const validatedStats = SystemStatsSchema.parse(mockSystemStats);
      const validatedNotifications = mockNotifications.map(n => AdminNotificationSchema.parse(n));
      
      adminState.update(state => ({
        ...state,
        currentUser: validatedUser,
        users: [validatedUser],
        systemStats: validatedStats,
        notifications: validatedNotifications,
        isLoading: false
      }));
    } catch (error) {
      adminState.update(state => ({
        ...state,
        error: error instanceof Error ? error.message : 'Erreur d\'initialisation',
        isLoading: false
      }));
    }
  },

  // Authentification admin
  async authenticateAdmin(email: string, password: string): Promise<void> {
    adminState.update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      // Simulation d'authentification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email === 'admin@example.com' && password === 'admin123') {
        const validatedUser = AdminUserSchema.parse(mockAdminUser);
        adminState.update(state => ({
          ...state,
          currentUser: validatedUser,
          isLoading: false
        }));
      } else {
        throw new Error('Accès admin non autorisé');
      }
    } catch (error) {
      adminState.update(state => ({
        ...state,
        error: error instanceof Error ? error.message : 'Erreur d\'authentification',
        isLoading: false
      }));
    }
  },

  // Déconnexion
  logout(): void {
    adminState.set(initialAdminState);
  },

  // Gestion des notifications
  addNotification(notification: Omit<AdminNotification, 'id' | 'createdAt' | 'isRead'>): void {
    const newNotification: AdminNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      message: DOMPurify.sanitize(notification.message),
      title: DOMPurify.sanitize(notification.title)
    };

    const validatedNotification = AdminNotificationSchema.parse(newNotification);
    
    adminState.update(state => ({
      ...state,
      notifications: [validatedNotification, ...state.notifications]
    }));
  },

  markNotificationRead(id: string): void {
    adminState.update(state => ({
      ...state,
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    }));
  },

  removeNotification(id: string): void {
    adminState.update(state => ({
      ...state,
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  clearAllNotifications(): void {
    adminState.update(state => ({
      ...state,
      notifications: []
    }));
  },

  // Gestion des erreurs
  clearError(): void {
    adminState.update(state => ({ ...state, error: null }));
  },

  setError(error: string): void {
    adminState.update(state => ({ 
      ...state, 
      error: DOMPurify.sanitize(error)
    }));
  },

  // Navigation des onglets
  setSelectedTab(tab: string): void {
    adminState.update(state => ({ ...state, selectedTab: tab }));
  }
};

// WebSocket pour notifications en temps réel (simulation)
let notificationSocket: WebSocket | null = null;

export function initializeWebSocket(): void {
  if (typeof window !== 'undefined') {
    // Simulation WebSocket
    setInterval(() => {
      const randomNotifications = [
        {
          title: 'Nouveau cours créé',
          message: 'Un instructeur a publié un nouveau cours',
          type: 'success' as const,
          priority: 'low' as const,
          metadata: { category: 'courses' }
        },
        {
          title: 'Activité suspecte',
          message: 'Tentative de connexion inhabituelle détectée',
          type: 'warning' as const,
          priority: 'high' as const,
          metadata: { category: 'security' }
        }
      ];

      if (Math.random() > 0.8) {
        const notification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        adminActions.addNotification(notification);
      }
    }, 30000);
  }
}

export function cleanup(): void {
  if (notificationSocket) {
    notificationSocket.close();
    notificationSocket = null;
  }
}

// Export par défaut pour compatibilité
export default {
  adminState,
  currentAdminUser,
  adminUsers,
  systemStats,
  adminNotifications,
  unreadNotificationsCount,
  isAdminLoading,
  adminError,
  adminActions,
  hasPermission,
  hasAnyPermission,
  hasRole,
  isSuperAdmin,
  initializeWebSocket,
  cleanup
};
