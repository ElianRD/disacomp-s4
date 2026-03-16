<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '../stores/auth';
import api from '../services/api';
import { KeyRound, Mail, LogIn, AlertCircle } from 'lucide-vue-next';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    });
    
    // Almacenar el token y datos en local
    authStore.setAuth(response.data.access_token, response.data.user);
    
    // Redirigir al dashboard/invoices
    router.push('/invoices');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMsg.value = 'Correo electrónico o contraseña incorrectos.';
    } else {
      errorMsg.value = 'Ocurrió un error al intentar conectarse al servidor.';
    }
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center z-50">
    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="flex justify-center mb-4">
         <div class="h-16 w-16 bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/30 flex items-center justify-center transform -rotate-6">
            <KeyRound class="w-8 h-8 text-white transform rotate-6" />
         </div>
      </div>
      <h2 class="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
        Bienvenido a DISA<span class="text-primary-600">COMP</span>
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Por favor, ingresa tus credenciales para acceder al ERP
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100/50">
        
        <div v-if="errorMsg" class="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
            <AlertCircle class="w-5 h-5 shrink-0 mt-0.5" />
            <span>{{ errorMsg }}</span>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Correo Electrónico </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input v-model="email" id="email" type="email" required autocomplete="email" class="focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl bg-gray-50 py-3 outline-none border transition-all" placeholder="cliente1@correo.com">
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> Contraseña </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound class="h-5 w-5 text-gray-400" />
              </div>
              <input v-model="password" id="password" type="password" required autocomplete="current-password" class="focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl bg-gray-50 py-3 outline-none border transition-all" placeholder="••••••••">
            </div>
          </div>

          <div>
            <button type="submit" :disabled="loading" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-primary-500/25 disabled:opacity-75 relative overflow-hidden group">
              <span v-if="!loading" class="flex items-center gap-2">
                 Iniciar Sesión
                 <LogIn class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span v-else class="flex items-center gap-2">
                 <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                 Validando...
              </span>
            </button>
          </div>
        </form>
        
        <div class="mt-6">
            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">Credenciales de Ejemplo</span>
                </div>
            </div>
            <div class="mt-6 text-xs text-gray-500 text-center space-y-2">
                <p>📍 Admin: <b>admin@disacomp.com</b> / <b>admin123</b></p>
                <p>📍 Cliente: <b>cliente2@correo.com</b> / <b>cliente123</b></p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
