import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    rol: 'recepcionista'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    if (!formData.nombre.trim() || !formData.apellidos.trim()) {
      setError('El nombre y apellidos son obligatorios')
      return false
    }
    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      // Registrar usuario en Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            telefono: formData.telefono,
            rol: formData.rol
          }
        }
      })

      if (authError) {
        setError(authError.message)
      } else {
        // Crear perfil en la tabla perfiles
        const { error: profileError } = await supabase.from('perfiles').insert([
          {
            id: data.user.id,
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            email: formData.email,
            telefono: formData.telefono,
            rol: formData.rol,
            activo: true
          }
        ])

        if (profileError) {
          console.error('Error creating profile:', profileError)
          setError(
            'Usuario creado pero error al crear perfil. Contacta al administrador.'
          )
        } else {
          // Redirigir al dashboard
          navigate('/dashboard')
        }
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('Error al registrarse con Google.')
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
          Crear Cuenta
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Únete a TamaDental
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow-sm border border-gray-200 rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={handleRegister}>
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

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div>
                <label
                  htmlFor='nombre'
                  className='block text-sm font-medium text-gray-700'
                >
                  Nombre
                </label>
                <div className='mt-1'>
                  <input
                    id='nombre'
                    name='nombre'
                    type='text'
                    autoComplete='given-name'
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm'
                    placeholder='Tu nombre'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='apellidos'
                  className='block text-sm font-medium text-gray-700'
                >
                  Apellidos
                </label>
                <div className='mt-1'>
                  <input
                    id='apellidos'
                    name='apellidos'
                    type='text'
                    autoComplete='family-name'
                    required
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm'
                    placeholder='Tus apellidos'
                  />
                </div>
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleInputChange}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm'
                  placeholder='tu@email.com'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='telefono'
                className='block text-sm font-medium text-gray-700'
              >
                Teléfono
              </label>
              <div className='mt-1'>
                <input
                  id='telefono'
                  name='telefono'
                  type='tel'
                  autoComplete='tel'
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm'
                  placeholder='+34 612 345 678'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='rol'
                className='block text-sm font-medium text-gray-700'
              >
                Rol
              </label>
              <div className='mt-1'>
                <select
                  id='rol'
                  name='rol'
                  value={formData.rol}
                  onChange={handleInputChange}
                  className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm'
                >
                  <option value='recepcionista'>Recepcionista</option>
                  <option value='administrativo'>Administrativo</option>
                  <option value='dentista'>Dentista</option>
                  <option value='medico'>Médico</option>
                  <option value='admin_clinica'>
                    Administrador de Clínica
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Contraseña
              </label>
              <div className='mt-1 relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className='appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm'
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className='text-gray-400 hover:text-gray-600'>
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700'
              >
                Confirmar Contraseña
              </label>
              <div className='mt-1 relative'>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className='appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm'
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className='text-gray-400 hover:text-gray-600'>
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </span>
                </button>
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
                    Creando cuenta...
                  </div>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </div>

            <div className='mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white text-gray-500'>
                    O regístrate con
                  </span>
                </div>
              </div>

              <div className='mt-6'>
                <button
                  type='button'
                  onClick={handleGoogleRegister}
                  disabled={loading}
                  className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  <span className='mr-2'>🔍</span>
                  Google
                </button>
              </div>
            </div>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              ¿Ya tienes una cuenta?{' '}
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

export default Register
