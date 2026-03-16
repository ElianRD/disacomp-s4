<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { PackageSearch, Edit, Trash2, Plus, X, Save } from 'lucide-vue-next'

const products = ref([])
const loading = ref(true)
const error = ref(null)

// Modal State
const isModalOpen = ref(false)
const modalMode = ref('CREATE') // 'CREATE' | 'EDIT'
const currentProduct = ref({ name: '', description: '', price: 0, stock: 0, sku: '' })

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await api.get('/products')
    products.value = res.data.data ? res.data.data : res.data
  } catch (err) {
    error.value = 'No se pudieron cargar los productos'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  modalMode.value = 'CREATE'
  currentProduct.value = { name: '', description: '', price: 0, stock: 0, sku: '' }
  isModalOpen.value = true
}

const openEditModal = (product) => {
  modalMode.value = 'EDIT'
  currentProduct.value = { ...product }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  currentProduct.value = { name: '', description: '', price: 0, stock: 0, sku: '' }
}

const saveProduct = async () => {
  try {
    if (modalMode.value === 'CREATE') {
      await api.post('/products', {
         ...currentProduct.value,
         price: Number(currentProduct.value.price),
         stock: Number(currentProduct.value.stock)
      })
    } else {
      await api.put(`/products/${currentProduct.value.id}`, {
         ...currentProduct.value,
         price: Number(currentProduct.value.price),
         stock: Number(currentProduct.value.stock)
      })
    }
    closeModal()
    fetchProducts()
  } catch (err) {
    alert('Error al guardar el producto')
    console.error(err)
  }
}

const deleteProduct = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este producto? Podría afectar las facturas antiguas.')) return
  try {
    await api.delete(`/products/${id}`)
    fetchProducts()
  } catch (err) {
    alert('No se puede eliminar el producto.')
    console.error(err)
  }
}

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)

onMounted(fetchProducts)
</script>

<template>
  <div class="space-y-6">
    <!-- Action Bar -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <PackageSearch class="w-6 h-6 text-primary-500" />
          Catálogo de Productos
        </h2>
        <p class="text-gray-500 text-sm mt-1">Gestión de inventario y precios base</p>
      </div>

      <button @click="openCreateModal" class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 border border-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-medium whitespace-nowrap shadow-md shadow-primary-500/20">
        <Plus class="w-4 h-4" />
        Nuevo Producto
      </button>
    </div>

    <!-- Grid de Productos -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="products.length === 0" class="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-500">
      No hay productos en el inventario. Asegúrate de ejecutar el seed en el API.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all group flex flex-col"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="bg-primary-50 text-primary-700 px-3 py-1 rounded-md text-xs font-bold font-mono border border-primary-100">
            {{ product.sku }}
          </div>
          <div class="text-2xl font-black text-gray-800">
            {{ formatCurrency(product.price) }}
          </div>
        </div>

        <h3 class="text-xl font-bold text-gray-900 mb-2 leading-tight">{{ product.name }}</h3>
        <p class="text-gray-500 text-sm flex-1 mb-6">{{ product.description }}</p>

        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div class="flex items-center gap-2">
             <div class="w-2 h-2 rounded-full" :class="product.stock > 0 ? 'bg-green-500' : 'bg-red-500'"></div>
             <span class="text-sm font-medium" :class="product.stock > 0 ? 'text-green-700' : 'text-red-700'">
                Stock: {{ product.stock }} uds
             </span>
          </div>
          <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openEditModal(product)" class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Editar">
              <Edit class="w-4 h-4" />
            </button>
            <button @click="deleteProduct(product.id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form (Create/Edit) -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" @click.stop>
          <div class="flex justify-between items-center bg-gray-50 px-6 py-4 border-b border-gray-100">
             <h3 class="font-bold text-xl text-gray-800">
               {{ modalMode === 'CREATE' ? 'Registrar Producto' : 'Editar Producto' }}
             </h3>
             <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
               <X class="w-5 h-5"/>
             </button>
          </div>
          <form @submit.prevent="saveProduct" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
              <input v-model="currentProduct.name" type="text" required class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea v-model="currentProduct.description" required rows="2" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input v-model="currentProduct.sku" type="text" required class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio Unitario</label>
                <input v-model="currentProduct.price" type="number" step="0.01" min="0" required class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock Disponible</label>
              <input v-model="currentProduct.stock" type="number" min="0" required class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
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
