<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { ArrowLeft, Save, Plus, Trash2, Box } from 'lucide-vue-next'

const router = useRouter()
const products = ref([])
const clients = ref([])
const loading = ref(true)

const form = ref({
  clientId: '',
  date: new Date().toISOString().split('T')[0],
  items: []
})

// UI States
const selectedProductId = ref('')
const selectedQuantity = ref(1)

const fetchInitialData = async () => {
  try {
    const [resProducts, resClients] = await Promise.all([
      api.get('/products'),
      api.get('/clients')
    ])
    products.value = resProducts.data.data ? resProducts.data.data : resProducts.data
    clients.value = resClients.data.data ? resClients.data.data : resClients.data
  } catch (err) {
    console.error('Error cargando datos', err)
  } finally {
    loading.value = false
  }
}

const addItem = () => {
  if (!selectedProductId.value || selectedQuantity.value < 1) return
  
  const product = products.value.find(p => p.id === selectedProductId.value)
  if (!product) return

  // Comprobar si ya existe
  const existing = form.value.items.find(i => i.productId === product.id)
  if (existing) {
    existing.quantity += selectedQuantity.value
  } else {
    form.value.items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: selectedQuantity.value
    })
  }

  selectedProductId.value = ''
  selectedQuantity.value = 1
}

const removeItem = (index) => {
  form.value.items.splice(index, 1)
}

const totalBruto = computed(() => {
  return form.value.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
})
const impuestos = computed(() => totalBruto.value * 0.18)
const totalNeto = computed(() => totalBruto.value + impuestos.value)

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)

const isSubmitting = ref(false)
const saveInvoice = async () => {
  if (form.value.items.length === 0) {
    alert('Debe agregar al menos un producto')
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      clientId: form.value.clientId,
      date: new Date(form.value.date).toISOString(),
      items: form.value.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      status: 'PENDING'
    }

    await api.post('/invoices', payload)
    router.push('/invoices')
  } catch (err) {
    alert(err.response?.data?.message || 'Error guardando factura')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchInitialData)
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    
    <!-- Top Bar -->
    <div class="flex items-center gap-4 mb-8">
      <button @click="router.back()" class="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Nueva Factura</h2>
        <p class="text-gray-500">Crea un nuevo registro de ventas</p>
      </div>
    </div>

    <!-- Spinner General -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Izquierda: Formulario y Agregar Items -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Info Básica -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Información del Cliente</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select v-model="form.clientId" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all">
                <option value="" disabled>-- Selecciona un cliente --</option>
                <option v-for="c in clients" :key="c.id" :value="c.id">
                  {{ c.name || c.nombre }} - {{ c.rnc }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Emisión</label>
              <input v-model="form.date" type="date" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 outline-none" />
            </div>
          </div>
        </div>

        <!-- Agregar Productos -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
            <Box class="w-5 h-5 text-primary-500"/>
            Artículos
          </h3>
          
          <div class="flex items-end gap-3 mb-6 bg-primary-50/50 p-4 rounded-xl border border-primary-100">
             <div class="flex-1">
                <label class="block text-sm font-medium text-primary-900 mb-1">Seleccionar Producto</label>
                <select v-model="selectedProductId" class="w-full bg-white border border-primary-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="" disabled>-- Elige un producto --</option>
                  <option v-for="p in products" :key="p.id" :value="p.id">
                    {{ p.name }} ({{ formatCurrency(p.price) }}) - Stock: {{ p.stock }}
                  </option>
                </select>
             </div>
             <div class="w-24">
               <label class="block text-sm font-medium text-primary-900 mb-1">Cant.</label>
               <input v-model.number="selectedQuantity" type="number" min="1" class="w-full bg-white border border-primary-200 rounded-lg px-4 py-2.5 outline-none text-center" />
             </div>
             <button @click="addItem" :disabled="!selectedProductId" class="h-[46px] px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2 font-medium shadow-sm">
                <Plus class="w-5 h-5" />
                Agregar
             </button>
          </div>

          <!-- Tabla de Items Actuales -->
          <div v-if="form.items.length > 0" class="border border-gray-200 rounded-xl overflow-hidden">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th class="px-4 py-3">Producto</th>
                  <th class="px-4 py-3 text-center">Cant.</th>
                  <th class="px-4 py-3 text-right">Precio</th>
                  <th class="px-4 py-3 text-right">Subtotal</th>
                  <th class="px-4 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(item, idx) in form.items" :key="idx" class="hover:bg-gray-50/50">
                  <td class="px-4 py-3 font-medium text-gray-800">{{ item.name }}</td>
                  <td class="px-4 py-3 text-center">{{ item.quantity }}</td>
                  <td class="px-4 py-3 text-right">{{ formatCurrency(item.price) }}</td>
                  <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(item.price * item.quantity) }}</td>
                  <td class="px-4 py-3 text-center">
                    <button @click="removeItem(idx)" class="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-8 text-gray-400 border border-dashed border-gray-300 rounded-xl">
             Aún no hay artículos agregados a esta factura.
          </div>
        </div>

      </div>

      <!-- Derecha: Resumen y Guardar -->
      <div class="lg:col-span-1">
        <div class="bg-dark-900 text-white p-6 rounded-2xl shadow-xl sticky top-8">
          <h3 class="text-xl font-bold mb-6 text-primary-400 border-b border-dark-800 pb-4">Resumen de Factura</h3>
          
          <div class="space-y-4 mb-8 text-gray-300">
            <div class="flex justify-between">
              <span>Subtotal:</span>
              <span class="font-medium text-white">{{ formatCurrency(totalBruto) }}</span>
            </div>
            <div class="flex justify-between">
              <span>ITBIS (18%):</span>
              <span class="font-medium text-white">{{ formatCurrency(impuestos) }}</span>
            </div>
            <div class="pt-4 border-t border-dark-800 flex justify-between items-center">
              <span class="text-lg font-bold text-white">Total:</span>
              <span class="text-2xl font-bold text-primary-400">{{ formatCurrency(totalNeto) }}</span>
            </div>
          </div>

          <button 
            @click="saveInvoice"
            :disabled="isSubmitting || form.items.length === 0 || !form.clientId"
            class="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary-600/30 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting" class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
            <template v-else>
              <Save class="w-5 h-5" />
              Procesar Factura
            </template>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
