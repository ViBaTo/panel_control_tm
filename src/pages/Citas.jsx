import { useState, useEffect } from 'react'
import {
  getLlamadasCitas,
  updateAppointmentStatus
} from '../utils/llamadasService'

const Citas = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  const fallbackAppointments = [
    {
      id: 1,
      patient: 'María García',
      phone: '612-345-678',
      service: 'Limpieza dental',
      date: '2024-01-20',
      time: '09:00',
      status: 'Confirmada'
    },
    {
      id: 2,
      patient: 'Carlos López',
      phone: '623-456-789',
      service: 'Ortodoncia',
      date: '2024-01-21',
      time: '10:30',
      status: 'Pendiente'
    },
    {
      id: 3,
      patient: 'Ana Martín',
      phone: '634-567-890',
      service: 'Blanqueamiento',
      date: '2024-01-22',
      time: '11:00',
      status: 'Confirmada'
    },
    {
      id: 4,
      patient: 'Luis Rodríguez',
      phone: '645-678-901',
      service: 'Implantes',
      date: '2024-01-23',
      time: '14:00',
      status: 'Reagendada'
    },
    {
      id: 5,
      patient: 'Elena Sánchez',
      phone: '656-789-012',
      service: 'Revisión',
      date: '2024-01-24',
      time: '16:30',
      status: 'Confirmada'
    },
    {
      id: 6,
      patient: 'Pedro Jiménez',
      phone: '667-890-123',
      service: 'Endodoncia',
      date: '2024-01-25',
      time: '12:00',
      status: 'Pendiente'
    }
  ]

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const result = await getLlamadasCitas()

        if (result.success && result.data.length > 0) {
          // Transform call data to appointment format
          const transformedData = result.data.map((call) => {
            const status = call.procesado ? 'Procesado' : 'Pendiente'
            return {
              id: call.call_id || call.id,
              patient: call.nombre_completo || 'Sin nombre',
              phone: call.telefono || 'Sin teléfono',
              service: call.tratamiento_de_interes || 'Sin servicio',
              date: call.fecha_registro
                ? new Date(call.fecha_registro).toLocaleDateString('es-ES')
                : new Date().toLocaleDateString('es-ES'),
              time: call.fecha_registro
                ? new Date(call.fecha_registro).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Sin hora',
              status: status
            }
          })
          setAppointments(transformedData)
        } else {
          setAppointments(fallbackAppointments)
          setIsUsingFallback(true)
        }

        if (result.error) {
          setError(result.error)
        }
      } catch (err) {
        setError(err.message)
        setAppointments(fallbackAppointments)
        setIsUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?'
    return name.charAt(0).toUpperCase()
  }

  const handleStatusChange = async (appointmentId, currentStatus) => {
    if (currentStatus !== 'Pendiente' && currentStatus !== 'Procesado') return

    const newStatus = currentStatus === 'Pendiente' ? 'Procesado' : 'Pendiente'
    const actionText = currentStatus === 'Pendiente' ? 'procesada' : 'pendiente'

    // Confirmar la acción
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres marcar esta cita como ${actionText}?`
    )
    if (!confirmed) return

    try {
      setUpdatingStatus(appointmentId) // Mostrar estado de carga

      const result = await updateAppointmentStatus(appointmentId, newStatus)

      if (result.success) {
        // Actualizar el estado local
        setAppointments((prevAppointments) =>
          prevAppointments.map((apt) =>
            apt.id === appointmentId ? { ...apt, status: newStatus } : apt
          )
        )
        // Mostrar mensaje de éxito
        alert(`✅ Cita marcada como ${actionText} correctamente`)
      } else {
        console.error('Error updating status:', result.error)
        alert('❌ Error al actualizar el estado: ' + result.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error al actualizar el estado: ' + error.message)
    } finally {
      setUpdatingStatus(null) // Ocultar estado de carga
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmada':
        return 'bg-green-100 text-green-800'
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'Procesado':
        return 'bg-blue-100 text-blue-800'
      case 'Reagendada':
        return 'bg-purple-100 text-purple-800'
      case 'Cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando citas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Citas</h1>
          {isUsingFallback && (
            <p className='text-sm text-amber-600 mt-1'>
              ⚠️ Mostrando datos de ejemplo -{' '}
              {error ? `Error: ${error}` : 'Conectando con la base de datos...'}
            </p>
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
            <span className='mr-2'>➕</span>
            Nueva Cita
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>
                Total Citas
              </h3>
              <div className='flex items-center'>
                <span className='text-2xl font-bold text-gray-900'>
                  {appointments.length}
                </span>
                <span className='ml-2 text-sm text-green-600 font-medium'>
                  +12% ↗
                </span>
              </div>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <span className='text-2xl'>📅</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>
                Confirmadas
              </h3>
              <div className='flex items-center'>
                <span className='text-2xl font-bold text-green-600'>
                  {
                    appointments.filter((apt) => apt.status === 'Confirmada')
                      .length
                  }
                </span>
                <span className='ml-2 text-sm text-green-600 font-medium'>
                  +8% ↗
                </span>
              </div>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              <span className='text-2xl'>✅</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>
                Pendientes
              </h3>
              <div className='flex items-center'>
                <span className='text-2xl font-bold text-yellow-600'>
                  {
                    appointments.filter((apt) => apt.status === 'Pendiente')
                      .length
                  }
                </span>
                <span className='ml-2 text-sm text-red-600 font-medium'>
                  -2% ↘
                </span>
              </div>
            </div>
            <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
              <span className='text-2xl'>⏳</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>
                Procesadas
              </h3>
              <div className='flex items-center'>
                <span className='text-2xl font-bold text-blue-600'>
                  {
                    appointments.filter((apt) => apt.status === 'Procesado')
                      .length
                  }
                </span>
                <span className='ml-2 text-sm text-blue-600 font-medium'>
                  +15% ↗
                </span>
              </div>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <span className='text-2xl'>✅</span>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium text-gray-500 mb-2'>
                Reagendadas
              </h3>
              <div className='flex items-center'>
                <span className='text-2xl font-bold text-purple-600'>
                  {
                    appointments.filter((apt) => apt.status === 'Reagendada')
                      .length
                  }
                </span>
                <span className='ml-2 text-sm text-purple-600 font-medium'>
                  +5% ↗
                </span>
              </div>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
              <span className='text-2xl'>🔄</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Lista de Citas
            </h2>
            <div className='flex items-center space-x-2'>
              <button className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50'>
                Filtrar
              </button>
              <button className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50'>
                Exportar
              </button>
            </div>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Paciente
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Servicio
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Fecha
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
              {appointments.map((appointment) => (
                <tr key={appointment.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                        <span className='text-sm font-medium text-blue-600'>
                          {getInitials(appointment.patient)}
                        </span>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {appointment.patient}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {appointment.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {appointment.service}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {new Date(appointment.date).toLocaleDateString('es-ES')}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {appointment.time}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div className='flex items-center space-x-2'>
                      <button className='text-blue-600 hover:text-blue-800'>
                        <span className='sr-only'>Editar</span>
                        ✏️
                      </button>

                      {/* Botón para citas Pendientes */}
                      {appointment.status === 'Pendiente' && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              appointment.id,
                              appointment.status
                            )
                          }
                          disabled={updatingStatus === appointment.id}
                          className='px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
                          title='Marcar como Procesado'
                        >
                          {updatingStatus === appointment.id
                            ? '⏳'
                            : '✅ Procesar'}
                        </button>
                      )}

                      {/* Botón para citas Procesadas */}
                      {appointment.status === 'Procesado' && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              appointment.id,
                              appointment.status
                            )
                          }
                          disabled={updatingStatus === appointment.id}
                          className='px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
                          title='Marcar como Pendiente'
                        >
                          {updatingStatus === appointment.id
                            ? '⏳'
                            : '🔄 Revertir'}
                        </button>
                      )}

                      <button className='text-red-600 hover:text-red-800'>
                        <span className='sr-only'>Cancelar</span>❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='px-6 py-3 bg-gray-50 text-sm text-gray-500'>
          Mostrando {appointments.length} citas
        </div>
      </div>
    </div>
  )
}

export default Citas
