import { useState, useEffect } from 'react'
import { getPacientes, fallbackPacientes } from '../utils/pacientesService'
import PatientDetailModal from '../components/PatientDetailModal'

const Pacientes = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPatients, setFilteredPatients] = useState([])
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        setLoading(true)
        const result = await getPacientes()

        if (result.success) {
          if (result.data.length === 0) {
            // Si no hay datos en Supabase, usar datos de fallback
            setPatients(fallbackPacientes)
            setIsUsingFallback(true)
          } else {
            setPatients(result.data)
            setIsUsingFallback(false)
          }
        } else {
          // Si hay error de conexión, usar datos de fallback
          setPatients(fallbackPacientes)
          setError(result.error)
          setIsUsingFallback(true)
        }
      } catch (err) {
        setError(err.message)
        setPatients(fallbackPacientes)
        setIsUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPacientes()
  }, [])

  // Filtrar pacientes basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(patients)
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.telefono?.includes(searchTerm) ||
          patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.numero_historia?.includes(searchTerm)
      )
      setFilteredPatients(filtered)
    }
  }, [searchTerm, patients])

  // Calcular métricas
  const calculateMetrics = () => {
    const totalPatients = patients.length
    const activePatients = patients.filter((p) => p.activo === true).length
    const inactivePatients = patients.filter((p) => p.activo === false).length
    const patientsWithEmail = patients.filter(
      (p) => p.email && p.email.trim() !== ''
    ).length
    const patientsWithPhone = patients.filter(
      (p) => p.telefono && p.telefono.trim() !== ''
    ).length

    // Calcular pacientes registrados este mes
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const thisMonthPatients = patients.filter((p) => {
      if (!p.created_at) return false
      const createdDate = new Date(p.created_at)
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      )
    }).length

    return {
      totalPatients,
      activePatients,
      inactivePatients,
      patientsWithEmail,
      patientsWithPhone,
      thisMonthPatients,
      activePercentage:
        totalPatients > 0
          ? Math.round((activePatients / totalPatients) * 100)
          : 0,
      contactPercentage:
        totalPatients > 0
          ? Math.round(
              ((patientsWithEmail + patientsWithPhone) / (totalPatients * 2)) *
                100
            )
          : 0
    }
  }

  const metrics = calculateMetrics()

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('es-ES')
    } catch {
      return dateString
    }
  }

  // Función para obtener el nombre completo
  const getFullName = (patient) => {
    if (patient.nombre && patient.apellidos) {
      return `${patient.nombre} ${patient.apellidos}`
    }
    return patient.nombre || patient.nombre_completo || 'Sin nombre'
  }

  // Función para obtener las iniciales
  const getInitials = (patient) => {
    const fullName = getFullName(patient)
    return fullName
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Función para abrir el modal de detalles
  const openDetailModal = (patientId) => {
    setSelectedPatientId(patientId)
    setIsDetailModalOpen(true)
  }

  // Función para cerrar el modal de detalles
  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedPatientId(null)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando pacientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Gestión de Pacientes
          </h1>
          {isUsingFallback && (
            <p className='text-sm text-amber-600 mt-1'>
              ⚠️ Mostrando datos de ejemplo -{' '}
              {error ? `Error: ${error}` : 'No hay datos en la base de datos'}
            </p>
          )}
        </div>
        <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
          <span className='mr-2'>➕</span>
          Nuevo Paciente
        </button>
      </div>

      {/* KPIs Section - Estilo Apple */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Total de Pacientes */}
        <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200/50 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-blue-600 mb-1'>
                Total de Pacientes
              </p>
              <p className='text-3xl font-bold text-blue-900'>
                {metrics.totalPatients.toLocaleString()}
              </p>
              <p className='text-xs text-blue-600 mt-1'>Registrados en total</p>
            </div>
            <div className='w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>👥</span>
            </div>
          </div>
        </div>

        {/* Pacientes Activos */}
        <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200/50 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-green-600 mb-1'>
                Pacientes Activos
              </p>
              <p className='text-3xl font-bold text-green-900'>
                {metrics.activePatients.toLocaleString()}
              </p>
              <p className='text-xs text-green-600 mt-1'>
                {metrics.activePercentage}% del total
              </p>
            </div>
            <div className='w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>✅</span>
            </div>
          </div>
        </div>

        {/* Pacientes Inactivos */}
        <div className='bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200/50 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-orange-600 mb-1'>
                Pacientes Inactivos
              </p>
              <p className='text-3xl font-bold text-orange-900'>
                {metrics.inactivePatients.toLocaleString()}
              </p>
              <p className='text-xs text-orange-600 mt-1'>Requieren atención</p>
            </div>
            <div className='w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>⏸️</span>
            </div>
          </div>
        </div>

        {/* Nuevos este Mes */}
        <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200/50 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-purple-600 mb-1'>
                Nuevos este Mes
              </p>
              <p className='text-3xl font-bold text-purple-900'>
                {metrics.thisMonthPatients.toLocaleString()}
              </p>
              <p className='text-xs text-purple-600 mt-1'>
                Crecimiento mensual
              </p>
            </div>
            <div className='w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>📈</span>
            </div>
          </div>
        </div>
      </div>


      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='p-4 md:p-6 border-b border-gray-200'>
          <div className='flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Lista de Pacientes
            </h2>
            <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
              <input
                type='text'
                placeholder='Buscar por nombre, teléfono, email...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-64'
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className='px-3 py-2 text-sm text-gray-500 hover:text-gray-700'
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Paciente
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Contacto
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Historia
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estado
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Registro
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan='6'
                    className='px-4 py-6 text-center text-gray-500'
                  >
                    {searchTerm
                      ? 'No se encontraron pacientes con ese criterio de búsqueda'
                      : 'No hay pacientes registrados'}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className='hover:bg-gray-50'>
                    <td className='px-4 py-3 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                          <span className='text-sm font-medium text-blue-600'>
                            {getInitials(patient)}
                          </span>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {getFullName(patient)}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {patient.dni_nie
                              ? `DNI: ${patient.dni_nie}`
                              : 'Sin DNI'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {patient.telefono || 'Sin teléfono'}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {patient.email || 'Sin email'}
                      </div>
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {patient.numero_historia || 'Sin historia'}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {patient.fecha_nacimiento
                          ? `Nac: ${formatDate(patient.fecha_nacimiento)}`
                          : 'Sin fecha nac.'}
                      </div>
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.activo === false
                            ? 'bg-red-100 text-red-800'
                            : patient.activo === true
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {patient.activo === false
                          ? 'Inactivo'
                          : patient.activo === true
                          ? 'Activo'
                          : 'Sin estado'}
                      </span>
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {formatDate(patient.created_at)}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => openDetailModal(patient.id)}
                          className='text-blue-600 hover:text-blue-800 transition-colors'
                          title='Ver detalles'
                        >
                          👁️
                        </button>
                        <button
                          className='text-green-600 hover:text-green-800 transition-colors'
                          title='Editar'
                        >
                          ✏️
                        </button>
                        <button
                          className='text-purple-600 hover:text-purple-800 transition-colors'
                          title='Llamar'
                        >
                          📞
                        </button>
                        <button
                          className='text-red-600 hover:text-red-800 transition-colors'
                          title='Eliminar'
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='px-4 py-2 bg-gray-50 text-sm text-gray-500 flex justify-between items-center'>
          <span>
            Mostrando {filteredPatients.length} de {patients.length} pacientes
          </span>
          <div className='flex space-x-2'>
            <button className='px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm'>
              Anterior
            </button>
            <button className='px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm'>
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalles del paciente */}
      <PatientDetailModal
        patientId={selectedPatientId}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />
    </div>
  )
}

export default Pacientes
