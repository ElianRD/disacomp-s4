<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { Users, Plus, Edit, Trash2, X, Save } from 'lucide-vue-next'

const clients = ref([])
const loading = ref(true)

// Modal State
const isModalOpen = ref(false)
const modalMode = ref('CREATE') // 'CREATE' | 'EDIT'
const currentClient = ref({ nombre: '', rnc: '', direccion: '', telefono: '' })

const fetchClients = async () => {
  loading.value = true
  try {
    const res = await api.get('/clients')
    clients.value = res.data.data ? res.data.data : res.data
  } catch (err) {
    console.error('Error cargando clientes', err)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  modalMode.value = 'CREATE'
  currentClient.value = { nombre: '', rnc: '', direccion: '', telefono: '' }
  isModalOpen.value = true
}

const openEditModal = (client) => {
  modalMode.value = 'EDIT'
  currentClient.value = { ...client }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  currentClient.value = { nombre: '', rnc: '', direccion: '', telefono: '' }
}

const saveClient = async () => {
  try {
    if (modalMode.value === 'CREATE') {
      await api.post('/clients', currentClient.value)
    } else {
      await api.put(`/clients/${currentClient.value.id}`, currentClient.value)
    }
    closeModal()
    fetchClients() // Recargar tabla
  } catch (error) {
    alert('Error al guardar el cliente')
    console.error(error)
  }
}

const deleteClient = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este cliente? Esto podría afectar facturas asociadas.')) return
  try {
    await api.delete(`/clients/${id}`)
    fetchClients() // Recargar tabla
  } catch (error) {
    alert('No se puede eliminar porque posiblemente tiene facturas ligadas a su nombre.')
    console.error(error)
  }
}

onMounted(fetchClients)
</script>

<template>
  <div class="space-y-6 relative">
    
    <!-- Action Bar -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users class="w-6 h-6 text-primary-500" />
          Listado de Clientes
        </h2>
        <p class="text-gray-500 text-sm mt-1">Directorio y gestión de información corporativa</p>
      </div>
      
      <button @click="openCreateModal" class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 border border-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-medium whitespace-nowrap shadow-md shadow-primary-500/20">
        <Plus class="w-4 h-4" />
        Nuevo Cliente
      </button>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div v-if="loading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-sm">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-gray-50/80 text-gray-700 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th scope="col" class="px-6 py-4">Empresa / Nombre</th>
              <th scope="col" class="px-6 py-4">RNC</th>
              <th scope="col" class="px-6 py-4 truncate max-w-xs">Dirección</th>
              <th scope="col" class="px-6 py-4">Teléfono</th>
              <th scope="col" class="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="clients.length === 0 && !loading">
               <td colspan="5" class="px-6 py-12 text-center text-gray-500">No hay clientes registrados.</td>
            </tr>
            <tr 
              v-for="c in clients" 
              :key="c.id"
              class="hover:bg-primary-50/50 transition-colors group"
            >
              <td class="px-6 py-4 font-bold text-gray-900">{{ c.nombre }}</td>
              <td class="px-6 py-4 font-mono text-gray-500">{{ c.rnc }}</td>
              <td class="px-6 py-4 truncate max-w-xs" :title="c.direccion">{{ c.direccion }}</td>
              <td class="px-6 py-4">{{ c.telefono }}</td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                   <button @click="openEditModal(c)" class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Editar">
                     <Edit class="w-4 h-4" />
                   </button>
                   <button @click="deleteClient(c.id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                     <Trash2 class="w-4 h-4" />
                   </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form (Create/Edit) -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" @click.stop>
          <div class="flex justify-between items-center bg-gray-50 px-6 py-4 border-b border-gray-100">
             <h3 class="font-bold text-xl text-gray-800">
               {{ modalMode === 'CREATE' ? 'Registrar Cliente' : 'Editar Cliente' }}
             </h3>
             <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
               <X class="w-5 h-5"/>
             </button>
          </div>
          <form @submit.prevent="saveClient" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre o Razón Social</label>
              <input v-model="currentClient.nombre" type="text" required class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">RNC o Documento</label>
              <input v-model="currentClient.rnc" type="text" required class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input v-model="currentClient.direccion" type="text" required class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input v-model="currentClient.telefono" type="text" required class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
            </div>

            <div class="pt-4 flex justify-end gap-3 mt-6">
              <button type="button" @click="closeModal" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
              <button type="submit" class="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-primary-500/20">
                <Save class="w-4 h-4" />
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
