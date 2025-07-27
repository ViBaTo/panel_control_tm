import { useState, useEffect } from 'react'
import { analyzeTable } from '../utils/dbAnalysis.js'

const DatabaseAnalyzer = () => {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        setLoading(true)
        const result = await analyzeTable('appointment_calls')
        setAnalysis(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    performAnalysis()
  }, [])

  if (loading)
    return <div className='p-8'>Analizando tabla appointment_calls...</div>
  if (error) return <div className='p-8 text-red-500'>Error: {error}</div>

  return (
    <div className='p-8 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>
        Análisis de Tabla: appointment_calls
      </h1>

      {analysis && (
        <div className='space-y-6'>
          {/* Row Count */}
          <div className='bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold mb-4'>
              Estadísticas Generales
            </h2>
            <p className='text-lg'>
              <span className='font-medium'>Total de registros:</span>{' '}
              {analysis.rowCount || 'No disponible'}
            </p>
          </div>

          {/* Sample Data */}
          {analysis.sampleData && analysis.sampleData.length > 0 && (
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-semibold mb-4'>Datos de Muestra</h2>
              <div className='overflow-x-auto'>
                <table className='min-w-full table-auto'>
                  <thead>
                    <tr className='bg-gray-50'>
                      {Object.keys(analysis.sampleData[0]).map((key) => (
                        <th
                          key={key}
                          className='px-4 py-2 text-left text-sm font-medium text-gray-900'
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.sampleData.slice(0, 5).map((row, index) => (
                      <tr key={index} className='border-t'>
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className='px-4 py-2 text-sm text-gray-700'
                          >
                            {value !== null ? String(value) : 'NULL'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Schema Information */}
          {analysis.schema && (
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-semibold mb-4'>
                Esquema de la Tabla
              </h2>
              <div className='overflow-x-auto'>
                <table className='min-w-full table-auto'>
                  <thead>
                    <tr className='bg-gray-50'>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-900'>
                        Columna
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-900'>
                        Tipo
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-900'>
                        Valor de Muestra
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.schema.map((column, index) => (
                      <tr key={index} className='border-t'>
                        <td className='px-4 py-2 text-sm font-medium text-gray-900'>
                          {column.column_name}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-700'>
                          {column.data_type}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-700'>
                          {column.sample_value !== null
                            ? String(column.sample_value)
                            : 'NULL'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Errors */}
          {(analysis.errors.sampleError || analysis.errors.countError) && (
            <div className='bg-red-50 p-6 rounded-lg'>
              <h2 className='text-xl font-semibold mb-4 text-red-800'>
                Errores Encontrados
              </h2>
              {analysis.errors.sampleError && (
                <p className='text-red-700 mb-2'>
                  Error de datos: {analysis.errors.sampleError.message}
                </p>
              )}
              {analysis.errors.countError && (
                <p className='text-red-700 mb-2'>
                  Error de conteo: {analysis.errors.countError.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DatabaseAnalyzer
