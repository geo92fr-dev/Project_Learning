<script lang="ts">
  import { toasts, toastActions, type ToastMessage } from "$lib/stores/toast";
  import { slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  function getIcon(type: ToastMessage["type"]): string {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  }

  function getColorClass(type: ToastMessage["type"]): string {
    switch (type) {
      case "success":
        return "toast-success";
      case "error":
        return "toast-error";
      case "warning":
        return "toast-warning";
      case "info":
        return "toast-info";
      default:
        return "toast-info";
    }
  }
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <div
      class="toast {getColorClass(toast.type)}"
      transition:slide={{ duration: 300, easing: quintOut }}
    >
      <div class="toast-content">
        <div class="toast-icon">
          {getIcon(toast.type)}
        </div>
        <div class="toast-body">
          <div class="toast-title">{toast.title}</div>
          {#if toast.message}
            <div class="toast-message">{toast.message}</div>
          {/if}
        </div>
        {#if toast.dismissible}
          <button
            class="toast-close"
            on:click={() => toastActions.remove(toast.id)}
            aria-label="Fermer"
          >
            ×
          </button>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 400px;
    pointer-events: none;
  }

  .toast {
    pointer-events: auto;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-left: 4px solid;
    overflow: hidden;
  }

  .toast-success {
    border-left-color: #28a745;
  }

  .toast-error {
    border-left-color: #dc3545;
  }

  .toast-warning {
    border-left-color: #ffc107;
  }

  .toast-info {
    border-left-color: #007bff;
  }

  .toast-content {
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    gap: 0.75rem;
  }

  .toast-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .toast-body {
    flex: 1;
    min-width: 0;
  }

  .toast-title {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }

  .toast-message {
    color: #6c757d;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .toast-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    flex-shrink: 0;
    transition: color 0.15s ease;
  }

  .toast-close:hover {
    color: #495057;
  }

  @media (max-width: 480px) {
    .toast-container {
      left: 1rem;
      right: 1rem;
      max-width: none;
    }

    .toast-content {
      padding: 0.875rem;
    }

    .toast-title {
      font-size: 0.95rem;
    }

    .toast-message {
      font-size: 0.85rem;
    }
  }
</style>
