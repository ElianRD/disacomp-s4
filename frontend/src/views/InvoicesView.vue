<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { Plus, Download, FileText, Trash2, Edit } from 'lucide-vue-next'
import { authStore } from '../stores/auth'

const invoices = ref([])
const loading = ref(true)
const error = ref(null)

const fetchInvoices = async () => {
  loading.value = true
  try {
    const res = await api.get('/invoices')
    invoices.value = res.data.data ? res.data.data : res.data
  } catch (err) {
    error.value = 'No se pudieron cargar las facturas'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const statusColor = (status) => {
  switch (status) {
    case 'PAID': return 'bg-green-100 text-green-800 border-green-200'
    case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-amber-100 text-amber-800 border-amber-200'
  }
}

const formatCurrency = (val) => {
  if (val === undefined || val === null) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

const downloadReport = async () => {
  try {
    const res = await api.get('/invoices/report/pdf?startDate=2024-01-01&endDate=2030-12-31', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'reporte-ventas.pdf')
    document.body.appendChild(link)
    link.click()
  } catch(err) {
    alert('Error al descargar PDF')
  }
}

onMounted(fetchInvoices)
</script>

<template>
  <div class="space-y-6">
    
    <!-- Action Bar -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText class="w-6 h-6 text-primary-500" />
          Listado de Facturas
        </h2>
        <p class="text-gray-500 text-sm mt-1">Gestiona el histórico y estatus de las ventas</p>
      </div>
      
      <div class="flex gap-3" v-if="authStore.isAdmin">
        <button @click="downloadReport" class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-primary-600 transition-all font-medium shadow-sm">
          <Download class="w-4 h-4" />
          Descargar Reporte PDF
        </button>
        <RouterLink to="/invoices/create" class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 border border-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20 font-medium">
          <Plus class="w-4 h-4" />
          Nueva Factura
        </RouterLink>
      </div>
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
              <th scope="col" class="px-6 py-4"># Factura</th>
              <th scope="col" class="px-6 py-4">Fecha</th>
              <th scope="col" class="px-6 py-4">Cliente (ID)</th>
              <th scope="col" class="px-6 py-4">Ítems</th>
              <th scope="col" class="px-6 py-4">Total</th>
              <th scope="col" class="px-6 py-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="invoices.length === 0 && !loading">
               <td colspan="6" class="px-6 py-12 text-center text-gray-500">No hay facturas registradas.</td>
            </tr>
            <tr 
              v-for="inv in invoices" 
              :key="inv.id"
              class="hover:bg-primary-50/50 transition-colors group cursor-default"
            >
              <td class="px-6 py-4 font-medium text-gray-900">{{ inv.invoiceNumber }}</td>
              <td class="px-6 py-4">{{ new Date(inv.date).toLocaleDateString() }}</td>
              <td class="px-6 py-4 truncate max-w-[150px]" :title="inv.clientId">{{ inv.clientId }}</td>
              <td class="px-6 py-4">
                 <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-700 bg-primary-100 rounded-full">
                    {{ inv.items ? inv.items.length : 0 }}
                 </span>
              </td>
              <td class="px-6 py-4 font-bold text-gray-800">{{ formatCurrency(inv.total) }}</td>
              <td class="px-6 py-4 text-center">
                <span :class="statusColor(inv.status)" class="px-3 py-1 rounded-full text-xs font-bold border">
                  {{ inv.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
