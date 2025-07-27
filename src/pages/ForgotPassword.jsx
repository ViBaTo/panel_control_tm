import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex justify-center'>
          <div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center'>
            <span className='text-white text-xl font-bold'>T</span>
          </div>
        </div>
        <h2 className='mt-6 text-center text-3xl font-bold text-gray-900'>
          Recuperar Contraseña
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow-sm border border-gray-200 rounded-lg sm:px-10'>
          {success ? (
            <div className='text-center'>
              <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
                <span className='text-green-600 text-xl'>✅</span>
              </div>
              <h3 className='mt-4 text-lg font-medium text-gray-900'>
                Email enviado
              </h3>
              <p className='mt-2 text-sm text-gray-600'>
                Hemos enviado un enlace de recuperación a{' '}
                <strong>{email}</strong>
              </p>
              <p className='mt-2 text-sm text-gray-500'>
                Revisa tu bandeja de entrada y sigue las instrucciones del
                email.
              </p>
              <div className='mt-6'>
                <Link
                  to='/login'
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
                >
                  ← Volver al login
                </Link>
              </div>
            </div>
          ) : (
            <form className='space-y-6' onSubmit={handleResetPassword}>
              {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                  <div className='flex'>
                    <div className='flex-shrink-0'>
                      <span className='text-red-400'>⚠️</span>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm text-red-800'>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Correo Electrónico
                </label>
                <div className='mt-1'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm'
                    placeholder='tu@email.com'
                  />
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  disabled={loading}
                  className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  {loading ? (
                    <div className='flex items-center'>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                      Enviando...
                    </div>
                  ) : (
                    'Enviar Email de Recuperación'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              ¿Recordaste tu contraseña?{' '}
              <Link
                to='/login'
                className='font-medium text-blue-600 hover:text-blue-500'
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
