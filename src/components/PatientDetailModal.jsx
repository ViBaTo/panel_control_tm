import { useState, useEffect } from 'react'
import { getPacienteById } from '../utils/pacientesService'

const PatientDetailModal = ({ patientId, isOpen, onClose }) => {
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientDetails()
    }
  }, [isOpen, patientId])

  const fetchPatientDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getPacienteById(patientId)
      if (result.success) {
        setPatient(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getFullName = (patient) => {
    if (patient?.nombre && patient?.apellidos) {
      return `${patient.nombre} ${patient.apellidos}`
    }
    return patient?.nombre || patient?.nombre_completo || 'Sin nombre'
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Detalles del Paciente
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <span className='text-2xl'>×</span>
            </button>
          </div>
        </div>

        <div className='p-6'>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              <span className='ml-3 text-gray-600'>Cargando detalles...</span>
            </div>
          ) : error ? (
            <div className='text-center py-8'>
              <div className='text-red-600 mb-2'>
                Error al cargar los detalles
              </div>
              <div className='text-sm text-gray-500'>{error}</div>
            </div>
          ) : patient ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Información Personal */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
                  Información Personal
                </h3>

                <div className='space-y-3'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Nombre Completo
                    </label>
                    <p className='text-gray-900'>{getFullName(patient)}</p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      DNI/NIE
                    </label>
                    <p className='text-gray-900'>
                      {patient.dni_nie || 'No especificado'}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Número de Historia
                    </label>
                    <p className='text-gray-900'>
                      {patient.numero_historia || 'No especificado'}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Fecha de Nacimiento
                    </label>
                    <p className='text-gray-900'>
                      {formatDate(patient.fecha_nacimiento)}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Género
                    </label>
                    <p className='text-gray-900 capitalize'>
                      {patient.genero || 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
                  Información de Contacto
                </h3>

                <div className='space-y-3'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Teléfono Principal
                    </label>
                    <p className='text-gray-900'>
                      {patient.telefono || 'No especificado'}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Teléfono Secundario
                    </label>
                    <p className='text-gray-900'>
                      {patient.telefono_secundario || 'No especificado'}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Email
                    </label>
                    <p className='text-gray-900'>
                      {patient.email || 'No especificado'}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Dirección
                    </label>
                    <p className='text-gray-900'>
                      {patient.direccion ? (
                        <>
                          {patient.direccion}
                          <br />
                          {patient.codigo_postal} {patient.ciudad}
                          <br />
                          {patient.provincia}
                        </>
                      ) : (
                        'No especificada'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información del Sistema */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
                  Información del Sistema
                </h3>

                <div className='space-y-3'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Estado
                    </label>
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
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Origen del Registro
                    </label>
                    <p className='text-gray-900 capitalize'>
                      {patient.origen_registro || 'No especificado'}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Preferencia de Contacto
                    </label>
                    <p className='text-gray-900 capitalize'>
                      {patient.preferencia_contacto || 'No especificada'}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Idioma Preferido
                    </label>
                    <p className='text-gray-900 capitalize'>
                      {patient.idioma_preferido || 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preferencias y Configuración */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
                  Preferencias y Configuración
                </h3>

                <div className='space-y-3'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Acepta Recordatorios
                    </label>
                    <p className='text-gray-900'>
                      {patient.acepta_recordatorios ? 'Sí' : 'No'}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Acepta Marketing
                    </label>
                    <p className='text-gray-900'>
                      {patient.acepta_marketing ? 'Sí' : 'No'}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Etiquetas
                    </label>
                    <p className='text-gray-900'>
                      {patient.etiquetas || 'Sin etiquetas'}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Fecha de Registro
                    </label>
                    <p className='text-gray-900'>
                      {formatDateTime(patient.created_at)}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Última Actualización
                    </label>
                    <p className='text-gray-900'>
                      {formatDateTime(patient.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notas Internas */}
              {patient.notas_internas && (
                <div className='md:col-span-2 space-y-4'>
                  <h3 className='text-lg font-medium text-gray-900 border-b border-gray-200 pb-2'>
                    Notas Internas
                  </h3>
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-gray-900 whitespace-pre-wrap'>
                      {patient.notas_internas}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='text-center py-8'>
              <div className='text-gray-500'>
                No se encontró información del paciente
              </div>
            </div>
          )}
        </div>

        <div className='p-6 border-t border-gray-200 flex justify-end space-x-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              // Aquí se podría implementar la funcionalidad de editar
              console.log('Editar paciente:', patient?.id)
            }}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Editar Paciente
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientDetailModal
