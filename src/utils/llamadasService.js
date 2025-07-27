import { supabase } from './supabase.js'

export const getLlamadasCitas = async () => {
  try {
    const { data, error } = await supabase
      .from('appointment_calls')
      .select('*')
      .order('fecha_registro', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching appointment_calls:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    return {
      success: true,
      data: data || [],
      error: null
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error.message,
      data: []
    }
  }
}

export const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from('appointment_calls')
      .update({ procesado: newStatus === 'Procesado' })
      .eq('call_id', appointmentId)
      .select()

    if (error) {
      console.error('Error updating appointment status:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    return {
      success: true,
      data: data,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

export const getMetricasAgente = async () => {
  try {
    // Obtener métricas básicas de appointment_calls
    const { data: llamadas, error } = await supabase
      .from('appointment_calls')
      .select('*')

    if (error) {
      console.error('Error fetching metrics:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    // Calcular métricas
    const totalLlamadas = llamadas?.length || 0
    const citasProcesadas =
      llamadas?.filter((l) => l.procesado === true).length || 0
    const tasaConversion =
      totalLlamadas > 0 ? (citasProcesadas / totalLlamadas) * 100 : 0

    return {
      success: true,
      data: {
        llamadasTotales: totalLlamadas,
        citasProcesadas: citasProcesadas,
        tasaConversion: tasaConversion.toFixed(1),
        llamadasPerdidas: Math.max(0, totalLlamadas - citasProcesadas - 10),
        ingresoEstimado: citasProcesadas * 150, // Estimación promedio por cita
        satisfaccionCliente: 94.2 // Valor fijo por ahora
      },
      error: null
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

// Datos de fallback para llamadas recientes
export const fallbackLlamadas = []

// Datos de fallback para métricas
export const fallbackMetricas = {
  llamadasTotales: 0,
  citasProcesadas: 0,
  tasaConversion: 0,
  llamadasPerdidas: 0,
  ingresoEstimado: 0,
  satisfaccionCliente: 0
}
