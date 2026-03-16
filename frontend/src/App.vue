<script setup>
import { ref, computed } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Receipt, PackageSearch, Users, ShieldAlert, Menu, X, LogOut } from 'lucide-vue-next'
import { authStore } from './stores/auth'

const isSidebarOpen = ref(window.innerWidth >= 1024)
const route = useRoute()

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false
  }
}

const router = useRouter()
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const isAuthRoute = computed(() => route.meta.public === true)
</script>

<template>
  <div v-if="isAuthRoute" class="h-screen w-full bg-gray-50">
    <router-view v-slot="{ Component }">
       <transition name="fade" mode="out-in">
         <component :is="Component" />
       </transition>
    </router-view>
  </div>
  
  <div v-else class="flex h-screen bg-gray-50 font-sans overflow-hidden">
    
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="toggleSidebar"
      class="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-64',
        'fixed lg:static shrink-0 inset-y-0 left-0 w-64 bg-dark-900 text-white flex flex-col transition-all duration-300 ease-in-out z-50 shadow-2xl lg:shadow-none'
      ]"
    >
      <div class="h-16 flex items-center justify-between px-6 border-b border-dark-800">
        <h1 class="text-2xl font-bold tracking-wider text-primary-400">DISA<span class="text-white">COMP</span></h1>
        <button @click="toggleSidebar" class="lg:hidden text-gray-400 hover:text-white">
          <X class="w-6 h-6" />
        </button>
      </div>
      
      <nav class="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <RouterLink 
          to="/invoices" 
          @click="closeSidebar"
          class="flex items-center px-4 py-3 text-gray-300 rounded-xl hover:bg-dark-800 hover:text-white transition-colors group"
          active-class="bg-primary-600 text-white shadow-lg shadow-primary-500/30"
        >
          <Receipt class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          <span class="font-medium">Facturas</span>
        </RouterLink>

        <template v-if="authStore.isAdmin">
          <RouterLink 
            to="/products"
            @click="closeSidebar"
            class="flex items-center px-4 py-3 text-gray-300 rounded-xl hover:bg-dark-800 hover:text-white transition-colors group"
            active-class="bg-primary-600 text-white shadow-lg shadow-primary-500/30"
          >
            <PackageSearch class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span class="font-medium">Productos</span>
          </RouterLink>

          <RouterLink 
            to="/clients"
            @click="closeSidebar"
            class="flex items-center px-4 py-3 text-gray-300 rounded-xl hover:bg-dark-800 hover:text-white transition-colors group"
            active-class="bg-primary-600 text-white shadow-lg shadow-primary-500/30"
          >
            <Users class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span class="font-medium">Clientes</span>
          </RouterLink>

          <!-- Modulo Admin Exclusivo: Cuentas Roles Creados JWT -->
          <RouterLink 
            to="/users"
            @click="closeSidebar"
            class="flex items-center px-4 py-3 text-gray-300 rounded-xl hover:bg-dark-800 hover:text-white transition-colors group"
            active-class="bg-primary-600 text-white shadow-lg shadow-primary-500/30"
          >
            <ShieldAlert class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span class="font-medium">Usuarios</span>
          </RouterLink>
        </template>
      </nav>

      <div class="p-4 border-t border-dark-800 text-center text-sm text-gray-400">
        &copy; 2026 ERP System
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar Header -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shadow-sm z-10 shrink-0">
        <div class="flex items-center gap-4">
          <button @click="toggleSidebar" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Alternar Menú">
            <Menu class="w-6 h-6" />
          </button>
          <h2 class="text-xl font-semibold text-gray-800 hidden sm:block">Dashboard</h2>
        </div>
        <div class="flex items-center space-x-4">
          <div class="hidden sm:flex flex-col text-right">
             <span class="text-sm font-bold text-gray-800">{{ authStore.user?.email }}</span>
             <span class="text-xs text-primary-600 font-semibold">{{ authStore.role }}</span>
          </div>
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/30">
            {{ authStore.user?.email?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <button @click="handleLogout" class="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Cerrar Sesión">
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </header>

      <!-- Page Content View -->
      <div class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-6 md:p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style>
/* Active link exact rule */
.router-link-active {
  background-color: var(--color-primary-600);
  color: white;
}
</style>
