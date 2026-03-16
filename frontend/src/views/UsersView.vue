<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { Plus, Trash2, Edit, Users, ShieldAlert, KeyRound } from 'lucide-vue-next'

const usersList = ref([])
const clientsList = ref([])
const loading = ref(true)

// Control UI
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const submitLoading = ref(false)
const errorMsg = ref('')

// Formulario reactivo
const formData = ref({
  email: '',
  passwordRaw: '',
  role: 'CLIENT',
  clientId: ''
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await api.get('/users')
    usersList.value = res.data.data ? res.data.data : res.data
  } catch (err) {
    errorMsg.value = 'Error cargando usuarios'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchClients = async () => {
  try {
    const res = await api.get('/clients')
    clientsList.value = res.data.data ? res.data.data : res.data
  } catch(err) {
    console.error('Error cargando clientes para el select')
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = { email: '', passwordRaw: '', role: 'CLIENT', clientId: '' }
  errorMsg.value = ''
  showModal.value = true
}

const openEditModal = (user) => {
  isEditing.value = true
  editingId.value = user.id
  formData.value = {
    email: user.email,
    passwordRaw: '',
    role: user.role,
    clientId: user.clientId || ''
  }
  errorMsg.value = ''
  showModal.value = true
}

const handleCreateUser = async () => {
  submitLoading.value = true
  errorMsg.value = ''
  
  // Validations
  if (formData.value.role === 'CLIENT' && !formData.value.clientId) {
    errorMsg.value = 'Un usuario de tipo CLIENTE debe estar vinculado a una empresa Emisora.'
    submitLoading.value = false
    return
  }
  
  try {
    const payload = { ...formData.value }
    if (payload.role === 'ADMIN') {
        delete payload.clientId
    }
    
    if (isEditing.value) {
      await api.put(`/users/${editingId.value}`, payload)
    } else {
      await api.post('/users', payload)
    }
    showModal.value = false
    await fetchUsers()
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Error al guardar el usuario.'
  } finally {
    submitLoading.value = false
  }
}

const handleDeleteUser = async (id) => {
  if(!confirm('¿Estás seguro de que deseas eliminar permanentemente a este usuario?')) return;
  try {
    await api.delete(`/users/${id}`)
    await fetchUsers()
  } catch (error) {
    alert(error.response?.data?.message || 'Error al eliminar usuario')
  }
}

onMounted(() => {
  fetchUsers()
  fetchClients()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header/Nav -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShieldAlert class="w-6 h-6 text-primary-500" />
          Gestión de Credenciales
        </h2>
        <p class="text-gray-500 text-sm mt-1">Administra los accesos al sistema, contraseñas y roles</p>
      </div>
      
      <button @click="openCreateModal" class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 border border-transparent text-white rounded-xl hover:bg-primary-700 transition-all font-medium shadow-md shadow-primary-500/20">
        <Plus class="w-4 h-4" />
        Nuevo Usuario
      </button>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div v-if="loading" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-gray-50/80 text-gray-700 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th scope="col" class="px-6 py-4">Email</th>
              <th scope="col" class="px-6 py-4 text-center">Rol</th>
              <th scope="col" class="px-6 py-4">ID Cliente Asignado</th>
              <th scope="col" class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="usersList.length === 0 && !loading">
               <td colspan="4" class="px-6 py-12 text-center text-gray-500">No hay usuarios registrados.</td>
            </tr>
            <tr 
              v-for="user in usersList" 
              :key="user.id"
              class="hover:bg-primary-50/50 transition-colors group"
            >
              <td class="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                 <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold border border-gray-100 shadow-sm shrink-0">
                   {{ user.email.charAt(0).toUpperCase() }}
                 </div>
                 {{ user.email }}
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center justify-center px-3 py-1 text-xs font-bold leading-none rounded-full"
                      :class="user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-green-100 text-green-700 border border-green-200'">
                   {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500 italic text-xs">
                {{ user.clientId || 'N/A' }}
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="openEditModal(user)" class="p-2 mr-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors inline-block" title="Editar Acceso">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="handleDeleteUser(user.id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors inline-block" title="Eliminar Acceso">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Drawer (Crear) -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="showModal = false"></div>
      
      <!-- Modal Panel -->
      <div class="bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all sm:max-w-lg w-full relative z-10 border border-gray-100">
        <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 class="text-xl font-bold flex items-center gap-2 text-gray-800">
             <KeyRound class="text-primary-600 w-5 h-5"/>
             {{ isEditing ? 'Modificar Acceso' : 'Otorgar Acceso' }}
          </h3>
        </div>
        
        <form @submit.prevent="handleCreateUser" class="p-6 space-y-5">
           <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
              {{ errorMsg }}
           </div>

           <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
              <input v-model="formData.email" :disabled="isEditing" type="email" required class="block w-full border-gray-300 rounded-xl bg-gray-50 py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 border focus:bg-white transition-all text-sm mb-2 disabled:opacity-50" placeholder="usuario@correo.com">
           </div>
           
           <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña {{ isEditing ? '(Opcional)' : 'Inicial' }}</label>
              <input v-model="formData.passwordRaw" type="password" :required="!isEditing" minlength="6" class="block w-full border-gray-300 rounded-xl bg-gray-50 py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 border focus:bg-white transition-all text-sm mb-2" placeholder="Mínimo 6 caracteres">
           </div>

           <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nivel de Privilegios</label>
              <select v-model="formData.role" class="block w-full border-gray-300 rounded-xl bg-gray-50 py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 border focus:bg-white transition-all text-sm">
                <option value="CLIENT">Cliente Limitado (Lectura Únicamente)</option>
                <option value="ADMIN">Administrador (Control Total)</option>
              </select>
           </div>
           
           <div v-if="formData.role === 'CLIENT'" class="pt-2 animate-fade-in">
             <label class="block text-sm font-semibold text-gray-700 mb-1">Enlazar con Cliente Comercial</label>
             <select v-model="formData.clientId" class="block w-full border-gray-300 rounded-xl bg-gray-50 py-2.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 border focus:bg-white transition-all text-sm">
                  <option disabled value="">Seleccione una empresa...</option>
                  <option v-for="c in clientsList" :key="c.id" :value="c.id">
                     {{ c.tradeName || c.legalName }} ({{c.rnc}})
                  </option>
             </select>
           </div>

           <div class="pt-6 flex gap-3 justify-end">
             <button type="button" @click="showModal = false" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
               Cancelar
             </button>
             <button type="submit" :disabled="submitLoading" class="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 border border-transparent shadow-md shadow-primary-500/20 transition-all flex items-center gap-2">
               <span v-if="submitLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
               {{ submitLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario') }}
             </button>
           </div>
        </form>
      </div>
    </div>

  </div>
</template>
