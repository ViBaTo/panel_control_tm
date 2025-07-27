import { useState, useEffect } from 'react'
import {
  getMetricasAgente,
  getLlamadasCitas,
  fallbackMetricas,
  fallbackLlamadas
} from '../utils/llamadasService'

const Dashboard = () => {
  const [metrics, setMetrics] = useState(fallbackMetricas)
  const [recentCalls, setRecentCalls] = useState(fallbackLlamadas)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Obtener métricas
        const metricsResult = await getMetricasAgente()
        if (metricsResult.success && metricsResult.data) {
          setMetrics(metricsResult.data)
        } else {
          setMetrics(fallbackMetricas)
          setIsUsingFallback(true)
        }

        // Obtener llamadas recientes
        const callsResult = await getLlamadasCitas()
        if (callsResult.success && callsResult.data.length > 0) {
          setRecentCalls(callsResult.data)
        } else {
          setRecentCalls(fallbackLlamadas)
          setIsUsingFallback(true)
        }

        if (metricsResult.error || callsResult.error) {
          setError(metricsResult.error || callsResult.error)
        }
      } catch (err) {
        setError(err.message)
        setIsUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const [taskProgress, setTaskProgress] = useState([
    { label: 'Llamadas atendidas', percentage: 89, color: 'bg-green-500' },
    { label: 'Citas confirmadas', percentage: 76, color: 'bg-blue-500' },
    {
      label: 'Seguimientos realizados',
      percentage: 82,
      color: 'bg-purple-500'
    },
    { label: 'Reagendamientos', percentage: 45, color: 'bg-orange-500' },
    { label: 'Cancelaciones procesadas', percentage: 23, color: 'bg-red-500' }
  ])

  const [appointmentStatus, setAppointmentStatus] = useState([
    {
      id: 1,
      patient: 'María García',
      phone: '612-345-678',
      service: 'Limpieza dental',
      date: '2024-01-20',
      status: 'Confirmada'
    },
    {
      id: 2,
      patient: 'Carlos López',
      phone: '623-456-789',
      service: 'Ortodoncia',
      date: '2024-01-21',
      status: 'Pendiente'
    },
    {
      id: 3,
      patient: 'Ana Martín',
      phone: '634-567-890',
      service: 'Blanqueamiento',
      date: '2024-01-22',
      status: 'Confirmada'
    },
    {
      id: 4,
      patient: 'Luis Rodríguez',
      phone: '645-678-901',
      service: 'Implantes',
      date: '2024-01-23',
      status: 'Reagendada'
    },
    {
      id: 5,
      patient: 'Elena Sánchez',
      phone: '656-789-012',
      service: 'Revisión',
      date: '2024-01-24',
      status: 'Confirmada'
    }
  ])

  // Función para obtener iniciales de forma segura
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?'
    return name.charAt(0).toUpperCase()
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>
            Cargando datos del agente de voz...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Panel de Control - Agente de Voz
          </h1>
          {isUsingFallback && (
            <p className='text-sm text-amber-600 mt-1'>
              ⚠️ Mostrando datos de ejemplo -{' '}
              {error ? `Error: ${error}` : 'Conectando con la base de datos...'}
            </p>
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
            <span className='mr-2'>✏️</span>
            Editar
          </button>
          <button className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'>
            <span className='mr-2'>➕</span>
            Añadir
          </button>
          <button className='px-2 py-2 text-gray-400 hover:text-gray-600'>
            <span className='text-xl'>⋯</span>
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500 mb-2'>
            Llamadas Totales
          </h3>
          <div className='flex items-center'>
            <span className='text-2xl font-bold text-gray-900'>
              {metrics.llamadasTotales?.toLocaleString() || '0'}
            </span>
            <span className='ml-2 text-sm text-green-600 font-medium'>
              +12% ↗
            </span>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500 mb-2'>
            Citas Agendadas
          </h3>
          <div className='flex items-center'>
            <span className='text-2xl font-bold text-gray-900'>
              {metrics.citasProcesadas?.toLocaleString() || '0'}
            </span>
            <span className='ml-2 text-sm text-green-600 font-medium'>
              +8% ↗
            </span>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500 mb-2'>
            Tasa de Conversión
          </h3>
          <div className='flex items-center'>
            <span className='text-2xl font-bold text-gray-900'>
              {metrics.tasaConversion || '0'}%
            </span>
            <span className='ml-2 text-sm text-green-600 font-medium'>
              +5% ↗
            </span>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500 mb-2'>
            Satisfacción Cliente
          </h3>
          <div className='flex items-center'>
            <span className='text-2xl font-bold text-gray-900'>
              {metrics.satisfaccionCliente || '0'}%
            </span>
            <span className='ml-2 text-sm text-red-600 font-medium'>-2% ↘</span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Llamadas Recientes */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Llamadas Recientes
              </h2>
              <div className='flex items-center space-x-2'>
                <button className='p-1 text-gray-400 hover:text-gray-600'>
                  <span>←</span>
                </button>
                <button className='p-1 text-gray-400 hover:text-gray-600'>
                  <span>→</span>
                </button>
                <button className='p-1 text-gray-400 hover:text-gray-600'>
                  <span>⋯</span>
                </button>
              </div>
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Llamante
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Servicio
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Hora
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Estado
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {recentCalls.map((call) => (
                  <tr key={call.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                          <span className='text-sm font-medium text-blue-600'>
                            {getInitials(call.caller)}
                          </span>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {call.caller || 'Sin nombre'}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {call.phone || 'Sin teléfono'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {call.service || 'Sin servicio'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {call.time || 'Sin hora'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          call.status === 'Cita agendada'
                            ? 'bg-green-100 text-green-800'
                            : call.status === 'Información solicitada'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {call.status || 'Sin estado'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <div className='flex items-center space-x-2'>
                        <button className='text-blue-600 hover:text-blue-800'>
                          ✏️
                        </button>
                        <button className='text-green-600 hover:text-green-800'>
                          ✅
                        </button>
                        <button className='text-red-600 hover:text-red-800'>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='px-6 py-3 bg-gray-50 text-sm text-gray-500'>
            Mostrando {recentCalls.length} de 247 llamadas
          </div>
        </div>

        {/* Progreso de Tareas */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Rendimiento del Agente
              </h2>
              <button className='p-1 text-gray-400 hover:text-gray-600'>
                <span>⋯</span>
              </button>
            </div>
          </div>
          <div className='p-6 space-y-4'>
            {taskProgress.map((task, index) => (
              <div key={index}>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-medium text-gray-700'>
                    {task.label}
                  </span>
                  <span className='text-sm text-gray-500'>
                    {task.percentage}%
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full ${task.color}`}
                    style={{ width: `${task.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segunda fila */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Estado de Citas */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Estado de Citas
              </h2>
              <div className='flex items-center space-x-2'>
                <button className='p-1 text-gray-400 hover:text-gray-600'>
                  <span>←</span>
                </button>
                <button className='p-1 text-gray-400 hover:text-gray-600'>
                  <span>→</span>
                </button>
                <button className='p-1 text-gray-400 hover:text-gray-600'>
                  <span>⋯</span>
                </button>
              </div>
            </div>
          </div>
          <div className='p-6 space-y-4'>
            {appointmentStatus.map((appointment) => (
              <div
                key={appointment.id}
                className='flex items-center justify-between'
              >
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                    <span className='text-sm font-medium text-green-600'>
                      {getInitials(appointment.patient)}
                    </span>
                  </div>
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      {appointment.patient || 'Sin paciente'}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {appointment.service || 'Sin servicio'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='w-32 bg-gray-200 rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full ${
                        appointment.status === 'Confirmada'
                          ? 'bg-green-500'
                          : appointment.status === 'Reagendada'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width:
                          appointment.status === 'Confirmada'
                            ? '100%'
                            : appointment.status === 'Reagendada'
                            ? '75%'
                            : '25%'
                      }}
                    ></div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.status === 'Confirmada'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'Reagendada'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {appointment.status || 'Sin estado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className='px-6 py-3 bg-gray-50 text-sm text-gray-500'>
            Mostrando {appointmentStatus.length} de 325 citas
          </div>
        </div>

        {/* Gráfico de Rendimiento */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Rendimiento
              </h2>
              <div className='flex items-center space-x-2'>
                <button className='text-xs px-2 py-1 bg-green-100 text-green-700 rounded'>
                  Semana pasada
                </button>
                <button className='text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded'>
                  Esta semana
                </button>
                <button className='p-1 text-gray-400 hover:text-gray-600'>
                  <span>⋯</span>
                </button>
              </div>
            </div>
          </div>
          <div className='p-6'>
            <div className='flex items-end space-x-2 h-40'>
              {[75, 85, 65, 95, 80, 70, 90].map((height, index) => (
                <div key={index} className='flex-1 flex flex-col items-center'>
                  <div
                    className={`w-full rounded-t ${
                      index % 2 === 0 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className='text-xs text-gray-500 mt-2'>
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-4 flex items-center space-x-4 text-sm'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded'></div>
                <span className='text-gray-600'>Citas completadas</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-blue-500 rounded'></div>
                <span className='text-gray-600'>Llamadas atendidas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
