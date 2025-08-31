# ⚙️ Phase 11 : Admin Dashboard (4 jours) - v1.9

## 📋 **Vue d'Ensemble**

**Objectif** : Interface d'administration complète avec analytics et gestion de contenu  
**Version cible** : v1.9 (admin professionnel)  
**Groupe** : 🚀 PRODUCTION - Admin & Déploiement  
**Prérequis** : Phase 10 (PWA & Offline) validée ✅

---

## 🎯 **Principes Fondamentaux & Architecture**

### ⚙️ **Dashboard Architecture**

**Interface d'Administration :**

- **Multi-role Management** : Super Admin, Admin, Instructor, Moderator
- **Real-time Analytics** : Métriques temps réel avec WebSockets
- **Content Management** : CRUD complet cours/exercices/utilisateurs
- **System Monitoring** : Performance, erreurs, utilisation ressources
- **Bulk Operations** : Actions en masse optimisées

**Analytics Avancées :**

- **Learning Analytics** : Patterns d'apprentissage et efficacité
- **User Behavior** : Parcours utilisateurs et points d'abandon
- **Content Performance** : Engagement et taux de complétion
- **System Health** : Monitoring infrastructure et performance
- **Predictive Insights** : ML pour prédictions et recommandations

### 📊 **Data Visualization & Reporting**

**Tableaux de Bord :**

- **Executive Dashboard** : KPIs stratégiques et vue d'ensemble
- **Operational Dashboard** : Métriques opérationnelles temps réel
- **Content Dashboard** : Performance contenu et engagement
- **User Dashboard** : Analytics utilisateurs et progression
- **Technical Dashboard** : Monitoring système et performance

**Reporting Système :**

- **Automated Reports** : Rapports automatiques programmés
- **Custom Reports** : Générateur rapports personnalisés
- **Export Capabilities** : PDF, Excel, CSV avec formatage
- **Data Visualization** : Graphiques interactifs avancés
- **Drill-down Analysis** : Navigation analytique approfondie

### 🔐 **Security & Access Control**

**Gestion Permissions :**

- **Role-Based Access Control (RBAC)** : Permissions granulaires
- **Resource-Level Security** : Contrôle accès par ressource
- **Audit Trail** : Traçabilité complète des actions admin
- **Session Management** : Gestion sessions sécurisées
- **API Security** : Protection APIs avec rate limiting

**Monitoring Sécurité :**

- **Failed Login Detection** : Détection tentatives intrusion
- **Suspicious Activity** : Alertes comportements anormaux
- **Data Access Logging** : Log accès données sensibles
- **Compliance Reporting** : Rapports conformité RGPD
- **Security Alerts** : Notifications incidents sécurité

### 🏗️ **Approche Qualité & Performance**

**Performance Admin :**

- **Lazy Loading** : Chargement données à la demande
- **Virtual Scrolling** : Pagination virtualisée grandes listes
- **Background Processing** : Tâches lourdes en arrière-plan
- **Caching Strategy** : Cache intelligent données admin
- **Real-time Updates** : Mises à jour temps réel optimisées

---

## 📚 **Références Modulaires**

### **[REF]** Admin Core : **[admin-core.md](../references/admin/admin-core.md)**

- ✅ Architecture RBAC complète
- ✅ Interface d'administration responsive
- ✅ Gestion utilisateurs et permissions
- ✅ Audit trail et sécurité

### **[REF]** Analytics Dashboard : **[analytics-dashboard.md](../references/admin/analytics-dashboard.md)**

- ✅ Tableaux de bord temps réel
- ✅ Visualisations données avancées
- ✅ Système de reporting automatisé
- ✅ KPIs et métriques personnalisées

---

## 📝 **Instructions d'Implémentation**

### ⚙️ **Étape 11.1 : Admin Core Infrastructure**

**[FILE]** Créer `src/lib/admin/adminStore.ts` :

```ts
import { writable, derived } from "svelte/store";
import { z } from "zod";
import type { UserProfile } from "$lib/firebase/collections";

// ===== TYPES ADMIN =====
export const AdminRoleSchema = z.enum([
  "super_admin",
  "admin",
  "instructor",
  "moderator",
  "viewer",
]);
export type AdminRole = z.infer<typeof AdminRoleSchema>;

export const AdminPermissionSchema = z.object({
  resource: z.string(),
  actions: z.array(
    z.enum(["create", "read", "update", "delete", "publish", "moderate"])
  ),
});

export const AdminUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: AdminRoleSchema,
  permissions: z.array(AdminPermissionSchema),
  isActive: z.boolean(),
  lastLogin: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const SystemStatsSchema = z.object({
  totalUsers: z.number(),
  activeUsers: z.number(),
  totalCourses: z.number(),
  totalExercises: z.number(),
  totalSessions: z.number(),
  avgSessionDuration: z.number(),
  completionRate: z.number(),
  errorRate: z.number(),
  serverHealth: z.object({
    cpu: z.number(),
    memory: z.number(),
    disk: z.number(),
    uptime: z.number(),
  }),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;
export type SystemStats = z.infer<typeof SystemStatsSchema>;

// ===== ADMIN STATE =====
interface AdminState {
  currentUser: AdminUser | null;
  users: AdminUser[];
  systemStats: SystemStats | null;
  notifications: AdminNotification[];
  isLoading: boolean;
  error: string | null;
}

interface AdminNotification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actions?: Array<{
    label: string;
    action: string;
    variant: "primary" | "secondary" | "danger";
  }>;
}

// ===== STORES =====
export const adminState = writable<AdminState>({
  currentUser: null,
  users: [],
  systemStats: null,
  notifications: [],
  isLoading: false,
  error: null,
});

// Derived stores pour faciliter l'accès
export const currentAdminUser = derived(
  adminState,
  ($state) => $state.currentUser
);
export const adminUsers = derived(adminState, ($state) => $state.users);
export const systemStats = derived(adminState, ($state) => $state.systemStats);
export const adminNotifications = derived(
  adminState,
  ($state) => $state.notifications
);
export const isAdminLoading = derived(adminState, ($state) => $state.isLoading);

// ===== ADMIN MANAGER =====
export class AdminManager {
  private websocket: WebSocket | null = null;
  private refreshInterval: number | null = null;

  /**
   * Initialise la session admin
   */
  async initialize(user: UserProfile): Promise<void> {
    adminState.update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      // Vérifier permissions admin
      const adminUser = await this.validateAdminUser(user);

      // Charger données initiales
      const [users, stats] = await Promise.all([
        this.loadUsers(),
        this.loadSystemStats(),
      ]);

      // Établir connexion temps réel
      await this.connectRealtime(adminUser.id);

      // Démarrer refresh périodique
      this.startPeriodicRefresh();

      adminState.update((state) => ({
        ...state,
        currentUser: adminUser,
        users,
        systemStats: stats,
        isLoading: false,
      }));
    } catch (error) {
      adminState.update((state) => ({
        ...state,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  }

  /**
   * Valide qu'un utilisateur a des permissions admin
   */
  private async validateAdminUser(user: UserProfile): Promise<AdminUser> {
    const response = await fetch("/api/admin/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    if (!response.ok) {
      throw new Error("Accès admin non autorisé");
    }

    const adminUser = await response.json();
    return AdminUserSchema.parse(adminUser);
  }

  /**
   * Charge la liste des utilisateurs
   */
  async loadUsers(): Promise<AdminUser[]> {
    const response = await fetch("/api/admin/users");
    if (!response.ok) throw new Error("Erreur chargement utilisateurs");

    const users = await response.json();
    return z.array(AdminUserSchema).parse(users);
  }

  /**
   * Charge les statistiques système
   */
  async loadSystemStats(): Promise<SystemStats> {
    const response = await fetch("/api/admin/stats");
    if (!response.ok) throw new Error("Erreur chargement statistiques");

    const stats = await response.json();
    return SystemStatsSchema.parse(stats);
  }

  /**
   * Gestion utilisateurs
   */
  async createUser(userData: Partial<AdminUser>): Promise<AdminUser> {
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Erreur création utilisateur");

    const newUser = AdminUserSchema.parse(await response.json());

    adminState.update((state) => ({
      ...state,
      users: [...state.users, newUser],
    }));

    this.addNotification({
      type: "success",
      title: "Utilisateur créé",
      message: `${newUser.name} a été ajouté avec succès`,
    });

    return newUser;
  }

  async updateUser(
    userId: string,
    updates: Partial<AdminUser>
  ): Promise<AdminUser> {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error("Erreur mise à jour utilisateur");

    const updatedUser = AdminUserSchema.parse(await response.json());

    adminState.update((state) => ({
      ...state,
      users: state.users.map((user) =>
        user.id === userId ? updatedUser : user
      ),
    }));

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erreur suppression utilisateur");

    adminState.update((state) => ({
      ...state,
      users: state.users.filter((user) => user.id !== userId),
    }));

    this.addNotification({
      type: "info",
      title: "Utilisateur supprimé",
      message: "L'utilisateur a été supprimé avec succès",
    });
  }

  /**
   * Gestion permissions
   */
  async updateUserPermissions(
    userId: string,
    permissions: AdminPermissionSchema[]
  ): Promise<void> {
    const response = await fetch(`/api/admin/users/${userId}/permissions`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions }),
    });

    if (!response.ok) throw new Error("Erreur mise à jour permissions");

    // Mettre à jour localement
    adminState.update((state) => ({
      ...state,
      users: state.users.map((user) =>
        user.id === userId ? { ...user, permissions } : user
      ),
    }));
  }

  checkPermission(resource: string, action: string): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // Super admin a tous les droits
    if (currentUser.role === "super_admin") return true;

    // Vérifier permissions spécifiques
    return currentUser.permissions.some(
      (permission) =>
        permission.resource === resource &&
        permission.actions.includes(action as any)
    );
  }

  /**
   * Analytics en temps réel
   */
  private async connectRealtime(adminId: string): Promise<void> {
    const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
      window.location.host
    }/api/admin/ws?adminId=${adminId}`;

    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      console.log("Admin WebSocket connecté");
    };

    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleRealtimeUpdate(data);
    };

    this.websocket.onclose = () => {
      console.log("Admin WebSocket fermé");
      // Reconnexion automatique après 5s
      setTimeout(() => this.connectRealtime(adminId), 5000);
    };

    this.websocket.onerror = (error) => {
      console.error("Erreur WebSocket admin:", error);
    };
  }

  private handleRealtimeUpdate(data: any): void {
    switch (data.type) {
      case "stats_update":
        adminState.update((state) => ({
          ...state,
          systemStats: SystemStatsSchema.parse(data.stats),
        }));
        break;

      case "user_activity":
        this.addNotification({
          type: "info",
          title: "Activité utilisateur",
          message: data.message,
        });
        break;

      case "system_alert":
        this.addNotification({
          type: data.severity,
          title: "Alerte système",
          message: data.message,
          actions: data.actions,
        });
        break;

      case "user_update":
        adminState.update((state) => ({
          ...state,
          users: state.users.map((user) =>
            user.id === data.user.id ? AdminUserSchema.parse(data.user) : user
          ),
        }));
        break;
    }
  }

  /**
   * Notifications admin
   */
  private addNotification(
    notification: Omit<AdminNotification, "id" | "timestamp" | "isRead">
  ): void {
    const fullNotification: AdminNotification = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      isRead: false,
      ...notification,
    };

    adminState.update((state) => ({
      ...state,
      notifications: [fullNotification, ...state.notifications].slice(0, 50), // Limiter à 50
    }));
  }

  markNotificationRead(notificationId: string): void {
    adminState.update((state) => ({
      ...state,
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      ),
    }));
  }

  clearNotifications(): void {
    adminState.update((state) => ({
      ...state,
      notifications: [],
    }));
  }

  /**
   * Refresh périodique
   */
  private startPeriodicRefresh(): void {
    this.refreshInterval = setInterval(async () => {
      try {
        const stats = await this.loadSystemStats();
        adminState.update((state) => ({
          ...state,
          systemStats: stats,
        }));
      } catch (error) {
        console.error("Erreur refresh stats:", error);
      }
    }, 30000); // Refresh toutes les 30s
  }

  /**
   * Nettoyage
   */
  cleanup(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }

    adminState.set({
      currentUser: null,
      users: [],
      systemStats: null,
      notifications: [],
      isLoading: false,
      error: null,
    });
  }

  // ===== UTILS =====
  getCurrentUser(): AdminUser | null {
    let currentUser: AdminUser | null = null;
    adminState.subscribe((state) => {
      currentUser = state.currentUser;
    })();
    return currentUser;
  }

  /**
   * Export des données pour rapports
   */
  async exportData(
    type: "users" | "stats" | "analytics",
    format: "csv" | "xlsx" | "pdf"
  ): Promise<Blob> {
    const response = await fetch(`/api/admin/export/${type}?format=${format}`, {
      method: "GET",
      headers: {
        Accept:
          format === "csv"
            ? "text/csv"
            : format === "xlsx"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf",
      },
    });

    if (!response.ok) throw new Error("Erreur export données");

    return response.blob();
  }

  /**
   * Actions en masse
   */
  async bulkUpdateUsers(
    userIds: string[],
    updates: Partial<AdminUser>
  ): Promise<void> {
    const response = await fetch("/api/admin/users/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds, updates }),
    });

    if (!response.ok) throw new Error("Erreur mise à jour en masse");

    // Recharger les utilisateurs
    const users = await this.loadUsers();
    adminState.update((state) => ({ ...state, users }));

    this.addNotification({
      type: "success",
      title: "Mise à jour en masse",
      message: `${userIds.length} utilisateurs mis à jour`,
    });
  }

  async bulkDeleteUsers(userIds: string[]): Promise<void> {
    const response = await fetch("/api/admin/users/bulk", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds }),
    });

    if (!response.ok) throw new Error("Erreur suppression en masse");

    adminState.update((state) => ({
      ...state,
      users: state.users.filter((user) => !userIds.includes(user.id)),
    }));

    this.addNotification({
      type: "info",
      title: "Suppression en masse",
      message: `${userIds.length} utilisateurs supprimés`,
    });
  }
}

// Instance globale
export const adminManager = new AdminManager();

// ===== RBAC HELPERS =====
export const ROLE_PERMISSIONS = {
  super_admin: ["*"], // Tous les droits
  admin: [
    "users.read",
    "users.create",
    "users.update",
    "users.delete",
    "courses.read",
    "courses.create",
    "courses.update",
    "courses.delete",
    "courses.publish",
    "exercises.read",
    "exercises.create",
    "exercises.update",
    "exercises.delete",
    "analytics.read",
    "system.read",
  ],
  instructor: [
    "courses.read",
    "courses.create",
    "courses.update",
    "courses.publish",
    "exercises.read",
    "exercises.create",
    "exercises.update",
    "users.read",
    "analytics.read",
  ],
  moderator: [
    "courses.read",
    "courses.moderate",
    "exercises.read",
    "exercises.moderate",
    "users.read",
    "users.moderate",
  ],
  viewer: ["courses.read", "exercises.read", "users.read", "analytics.read"],
} as const;

export function hasPermission(role: AdminRole, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return rolePermissions.includes("*") || rolePermissions.includes(permission);
}
```

### 📊 **Étape 11.2 : Analytics Dashboard**

**[FILE]** Créer `src/lib/components/admin/AnalyticsDashboard.svelte` :

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { systemStats, adminManager } from '$lib/admin/adminStore';
  import Card from '$lib/components/atoms/Card.svelte';
  import Button from '$lib/components/atoms/Button.svelte';
  import { Chart } from '$lib/components/charts/Chart.svelte';
  import type { SystemStats } from '$lib/admin/adminStore';

  // ===== PROPS =====
  export let timeRange: '24h' | '7d' | '30d' | '90d' = '24h';
  export let refreshInterval: number = 30000; // 30s par défaut

  // ===== STATE =====
  let selectedMetrics = new Set(['users', 'sessions', 'completion', 'performance']);
  let isLoading = false;
  let error: string | null = null;
  let refreshTimer: number;

  // Analytics data
  const analyticsData = writable({
    userGrowth: [],
    sessionActivity: [],
    completionTrends: [],
    performanceMetrics: [],
    popularCourses: [],
    errorLogs: []
  });

  // ===== LIFECYCLE =====
  onMount(() => {
    loadAnalytics();
    startAutoRefresh();
  });

  onDestroy(() => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
  });

  // ===== METHODS =====
  async function loadAnalytics() {
    if (isLoading) return;

    isLoading = true;
    error = null;

    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}&metrics=${Array.from(selectedMetrics).join(',')}`);

      if (!response.ok) {
        throw new Error('Erreur chargement analytics');
      }

      const data = await response.json();
      analyticsData.set(data);
    } catch (err) {
      error = err.message;
      console.error('Erreur analytics:', err);
    } finally {
      isLoading = false;
    }
  }

  function startAutoRefresh() {
    refreshTimer = setInterval(loadAnalytics, refreshInterval);
  }

  function toggleMetric(metric: string) {
    if (selectedMetrics.has(metric)) {
      selectedMetrics.delete(metric);
    } else {
      selectedMetrics.add(metric);
    }
    selectedMetrics = selectedMetrics; // Trigger reactivity
    loadAnalytics();
  }

  async function exportReport(format: 'csv' | 'xlsx' | 'pdf') {
    try {
      const blob = await adminManager.exportData('analytics', format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      error = 'Erreur export rapport';
    }
  }

  // ===== COMPUTED =====
  $: stats = $systemStats;
  $: analytics = $analyticsData;
</script>

<!-- ===== TEMPLATE ===== -->
<div class="analytics-dashboard">
  <!-- Header avec contrôles -->
  <header class="analytics-dashboard__header">
    <div class="analytics-dashboard__title-section">
      <h1 class="analytics-dashboard__title">Analytics Dashboard</h1>
      <p class="analytics-dashboard__subtitle">
        Vue d'ensemble des performances et métriques système
      </p>
    </div>

    <div class="analytics-dashboard__controls">
      <!-- Sélecteur période -->
      <div class="analytics-dashboard__time-range">
        <label for="timeRange">Période:</label>
        <select
          id="timeRange"
          bind:value={timeRange}
          on:change={loadAnalytics}
          class="analytics-dashboard__select"
        >
          <option value="24h">24 heures</option>
          <option value="7d">7 jours</option>
          <option value="30d">30 jours</option>
          <option value="90d">90 jours</option>
        </select>
      </div>

      <!-- Actions -->
      <div class="analytics-dashboard__actions">
        <Button
          variant="secondary"
          size="sm"
          iconLeft="refresh"
          loading={isLoading}
          on:click={loadAnalytics}
        >
          Actualiser
        </Button>

        <div class="analytics-dashboard__export">
          <Button
            variant="ghost"
            size="sm"
            iconLeft="download"
            on:click={() => exportReport('csv')}
          >
            CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeft="download"
            on:click={() => exportReport('xlsx')}
          >
            Excel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeft="download"
            on:click={() => exportReport('pdf')}
          >
            PDF
          </Button>
        </div>
      </div>
    </div>
  </header>

  <!-- Filtres métriques -->
  <div class="analytics-dashboard__filters">
    <h3>Métriques affichées:</h3>
    <div class="analytics-dashboard__metric-toggles">
      {#each ['users', 'sessions', 'completion', 'performance', 'content', 'errors'] as metric}
        <label class="analytics-dashboard__metric-toggle">
          <input
            type="checkbox"
            checked={selectedMetrics.has(metric)}
            on:change={() => toggleMetric(metric)}
          />
          <span class="analytics-dashboard__metric-label">
            {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </span>
        </label>
      {/each}
    </div>
  </div>

  <!-- Grille de métriques principales -->
  {#if stats}
    <div class="analytics-dashboard__kpis">
      <Card class="analytics-dashboard__kpi">
        <div class="analytics-dashboard__kpi-content">
          <div class="analytics-dashboard__kpi-value">{stats.totalUsers.toLocaleString()}</div>
          <div class="analytics-dashboard__kpi-label">Utilisateurs totaux</div>
          <div class="analytics-dashboard__kpi-change">
            +{Math.round(stats.activeUsers / stats.totalUsers * 100)}% actifs
          </div>
        </div>
        <div class="analytics-dashboard__kpi-icon">👥</div>
      </Card>

      <Card class="analytics-dashboard__kpi">
        <div class="analytics-dashboard__kpi-content">
          <div class="analytics-dashboard__kpi-value">{stats.totalSessions.toLocaleString()}</div>
          <div class="analytics-dashboard__kpi-label">Sessions totales</div>
          <div class="analytics-dashboard__kpi-change">
            {Math.round(stats.avgSessionDuration / 60)}min moy.
          </div>
        </div>
        <div class="analytics-dashboard__kpi-icon">📈</div>
      </Card>

      <Card class="analytics-dashboard__kpi">
        <div class="analytics-dashboard__kpi-content">
          <div class="analytics-dashboard__kpi-value">{Math.round(stats.completionRate * 100)}%</div>
          <div class="analytics-dashboard__kpi-label">Taux de complétion</div>
          <div class="analytics-dashboard__kpi-change">
            {stats.completionRate > 0.7 ? '✅' : stats.completionRate > 0.5 ? '⚠️' : '❌'}
            Objectif: 70%
          </div>
        </div>
        <div class="analytics-dashboard__kpi-icon">🎯</div>
      </Card>

      <Card class="analytics-dashboard__kpi">
        <div class="analytics-dashboard__kpi-content">
          <div class="analytics-dashboard__kpi-value">{Math.round(stats.errorRate * 100 * 100) / 100}%</div>
          <div class="analytics-dashboard__kpi-label">Taux d'erreur</div>
          <div class="analytics-dashboard__kpi-change">
            {stats.errorRate < 0.01 ? '✅' : stats.errorRate < 0.05 ? '⚠️' : '❌'}
            Cible: < 1%
          </div>
        </div>
        <div class="analytics-dashboard__kpi-icon">🔧</div>
      </Card>
    </div>
  {/if}

  <!-- Graphiques détaillés -->
  <div class="analytics-dashboard__charts">
    {#if selectedMetrics.has('users') && analytics.userGrowth.length > 0}
      <Card class="analytics-dashboard__chart-card">
        <h3>Croissance des utilisateurs</h3>
        <Chart
          type="line"
          data={analytics.userGrowth}
          options={{
            scales: {
              y: { beginAtZero: true },
              x: { type: 'time' }
            },
            plugins: {
              legend: { display: true }
            }
          }}
        />
      </Card>
    {/if}

    {#if selectedMetrics.has('sessions') && analytics.sessionActivity.length > 0}
      <Card class="analytics-dashboard__chart-card">
        <h3>Activité des sessions</h3>
        <Chart
          type="bar"
          data={analytics.sessionActivity}
          options={{
            scales: {
              y: { beginAtZero: true }
            },
            plugins: {
              legend: { display: false }
            }
          }}
        />
      </Card>
    {/if}

    {#if selectedMetrics.has('completion') && analytics.completionTrends.length > 0}
      <Card class="analytics-dashboard__chart-card">
        <h3>Tendances de complétion</h3>
        <Chart
          type="line"
          data={analytics.completionTrends}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: (value) => value + '%'
                }
              }
            }
          }}
        />
      </Card>
    {/if}

    {#if selectedMetrics.has('performance') && analytics.performanceMetrics.length > 0}
      <Card class="analytics-dashboard__chart-card">
        <h3>Métriques de performance</h3>
        <Chart
          type="radar"
          data={analytics.performanceMetrics}
          options={{
            scales: {
              r: {
                beginAtZero: true,
                max: 100
              }
            }
          }}
        />
      </Card>
    {/if}
  </div>

  <!-- Tableaux détaillés -->
  <div class="analytics-dashboard__tables">
    {#if analytics.popularCourses.length > 0}
      <Card class="analytics-dashboard__table-card">
        <h3>Cours populaires</h3>
        <div class="analytics-dashboard__table-container">
          <table class="analytics-dashboard__table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Inscriptions</th>
                <th>Complétion</th>
                <th>Note moy.</th>
                <th>Temps moy.</th>
              </tr>
            </thead>
            <tbody>
              {#each analytics.popularCourses as course}
                <tr>
                  <td class="analytics-dashboard__course-title">{course.title}</td>
                  <td>{course.enrollments.toLocaleString()}</td>
                  <td>{Math.round(course.completionRate * 100)}%</td>
                  <td>{course.averageRating.toFixed(1)} ⭐</td>
                  <td>{Math.round(course.averageTime / 60)}min</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </Card>
    {/if}

    {#if analytics.errorLogs.length > 0}
      <Card class="analytics-dashboard__table-card">
        <h3>Erreurs récentes</h3>
        <div class="analytics-dashboard__table-container">
          <table class="analytics-dashboard__table">
            <thead>
              <tr>
                <th>Heure</th>
                <th>Type</th>
                <th>Message</th>
                <th>Fréquence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {#each analytics.errorLogs as error}
                <tr class="analytics-dashboard__error-row">
                  <td>{new Date(error.timestamp).toLocaleTimeString()}</td>
                  <td>
                    <span class="analytics-dashboard__error-type analytics-dashboard__error-type--{error.severity}">
                      {error.type}
                    </span>
                  </td>
                  <td class="analytics-dashboard__error-message">{error.message}</td>
                  <td>{error.count}x</td>
                  <td>
                    <Button size="xs" variant="ghost" iconLeft="external-link">
                      Détails
                    </Button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </Card>
    {/if}
  </div>

  <!-- État de chargement -->
  {#if isLoading}
    <div class="analytics-dashboard__loading">
      <div class="analytics-dashboard__spinner"></div>
      <span>Chargement des analytics...</span>
    </div>
  {/if}

  <!-- Erreur -->
  {#if error}
    <div class="analytics-dashboard__error">
      <span class="analytics-dashboard__error-icon">⚠️</span>
      <span>{error}</span>
      <Button size="sm" variant="ghost" on:click={() => error = null}>
        Fermer
      </Button>
    </div>
  {/if}
</div>

<!-- ===== STYLES ===== -->
<style>
  .analytics-dashboard {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    padding: var(--space-6);
    max-width: 100%;
    min-height: 100vh;
    background: var(--color-surface-bg);
  }

  .analytics-dashboard__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-4);
    padding: var(--space-4);
    background: var(--color-surface-card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .analytics-dashboard__title-section {
    flex: 1;
  }

  .analytics-dashboard__title {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 var(--space-1) 0;
  }

  .analytics-dashboard__subtitle {
    color: var(--color-text-secondary);
    margin: 0;
  }

  .analytics-dashboard__controls {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .analytics-dashboard__time-range {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .analytics-dashboard__select {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface-card);
    color: var(--color-text-primary);
  }

  .analytics-dashboard__actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .analytics-dashboard__export {
    display: flex;
    gap: var(--space-1);
  }

  .analytics-dashboard__filters {
    padding: var(--space-4);
    background: var(--color-surface-card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .analytics-dashboard__filters h3 {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 var(--space-3) 0;
  }

  .analytics-dashboard__metric-toggles {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
  }

  .analytics-dashboard__metric-toggle {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
  }

  .analytics-dashboard__metric-label {
    color: var(--color-text-primary);
    font-weight: 500;
  }

  .analytics-dashboard__kpis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-4);
  }

  .analytics-dashboard__kpi {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4);
  }

  .analytics-dashboard__kpi-content {
    flex: 1;
  }

  .analytics-dashboard__kpi-value {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: var(--space-1);
  }

  .analytics-dashboard__kpi-label {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--space-1);
  }

  .analytics-dashboard__kpi-change {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  }

  .analytics-dashboard__kpi-icon {
    font-size: var(--font-size-2xl);
    opacity: 0.7;
  }

  .analytics-dashboard__charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--space-4);
  }

  .analytics-dashboard__chart-card {
    padding: var(--space-4);
  }

  .analytics-dashboard__chart-card h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 var(--space-4) 0;
  }

  .analytics-dashboard__tables {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: var(--space-4);
  }

  .analytics-dashboard__table-card {
    padding: var(--space-4);
  }

  .analytics-dashboard__table-card h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 var(--space-4) 0;
  }

  .analytics-dashboard__table-container {
    overflow-x: auto;
  }

  .analytics-dashboard__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);
  }

  .analytics-dashboard__table th,
  .analytics-dashboard__table td {
    padding: var(--space-2) var(--space-3);
    text-align: left;
    border-bottom: 1px solid var(--color-border);
  }

  .analytics-dashboard__table th {
    background: var(--color-surface-bg);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .analytics-dashboard__table td {
    color: var(--color-text-primary);
  }

  .analytics-dashboard__course-title {
    font-weight: 500;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .analytics-dashboard__error-row {
    &:hover {
      background: var(--color-surface-hover);
    }
  }

  .analytics-dashboard__error-type {
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
    font-weight: 500;

    &--error {
      background: var(--color-error-100);
      color: var(--color-error-800);
    }

    &--warning {
      background: var(--color-warning-100);
      color: var(--color-warning-800);
    }

    &--info {
      background: var(--color-primary-100);
      color: var(--color-primary-800);
    }
  }

  .analytics-dashboard__error-message {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .analytics-dashboard__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-8);
    color: var(--color-text-secondary);
  }

  .analytics-dashboard__spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .analytics-dashboard__error {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--color-error-50);
    border: 1px solid var(--color-error-200);
    border-radius: var(--radius-lg);
    color: var(--color-error-800);
  }

  .analytics-dashboard__error-icon {
    font-size: var(--font-size-lg);
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 1024px) {
    .analytics-dashboard__header {
      flex-direction: column;
      gap: var(--space-3);
    }

    .analytics-dashboard__controls {
      width: 100%;
      justify-content: space-between;
    }

    .analytics-dashboard__charts,
    .analytics-dashboard__tables {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .analytics-dashboard {
      padding: var(--space-4);
      gap: var(--space-4);
    }

    .analytics-dashboard__kpis {
      grid-template-columns: 1fr;
    }

    .analytics-dashboard__metric-toggles {
      flex-direction: column;
      align-items: flex-start;
    }

    .analytics-dashboard__export {
      flex-direction: column;
      width: 100%;
    }
  }
</style>
```

---

## 🧪 **Tests de Validation**

### 🔍 **Tests Obligatoires**

```bash
[TEST] npm run test:admin            # Tests interface admin
[TEST] npm run test:rbac             # Tests permissions RBAC
[TEST] npm run test:analytics        # Tests dashboard analytics
[TEST] npm run validate 11           # Validation complète Phase 11
```

---

## ✅ **Critères de Validation Obligatoires**

- [ ] **[CHECK]** Interface admin complète et responsive
- [ ] **[CHECK]** Système RBAC avec permissions granulaires
- [ ] **[CHECK]** Analytics temps réel avec WebSockets
- [ ] **[CHECK]** Dashboard avec métriques KPI
- [ ] **[CHECK]** Export rapports multiples formats
- [ ] **[CHECK]** Gestion utilisateurs et contenus
- [ ] **[CHECK]** Audit trail et sécurité
- [ ] **[CHECK]** Performance interface < 2s chargement

---

## 🏷️ **Processus de Release v1.9**

```bash
[CMD] npm run validate 11            # Validation complète Phase 11
[CMD] git add . && git commit -m "feat: Phase 11 - Admin Dashboard complete"
[CMD] git tag v1.9                  # Tag release admin
```

**🚫 STOP** : Ne pas passer à Phase 12 sans validation sécurité admin et performance.

---

## 🔗 **Liens Vers Phase Suivante**

**Prochaine étape** : [🚀 Phase 12 : Production Deployment](phase-12-production-deployment.md)  
**Groupe actuel** : 🚀 PRODUCTION - Admin & Déploiement  
**Dépendance** : Phase 11 (Admin Dashboard) validée ✅
