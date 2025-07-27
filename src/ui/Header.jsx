import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const Header = () => {
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const getUserInitials = () => {
    if (!user) return 'U'
    const email = user.email || ''
    return email.charAt(0).toUpperCase()
  }

  const getUserName = () => {
    if (!user) return 'Usuario'
    return user.email || 'Usuario'
  }

  return (
    <header className='bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
      <div className='flex items-center flex-1 max-w-2xl'>
        <div className='relative w-full'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg
              className='h-5 w-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          <input
            type='text'
            placeholder='Buscar...'
            className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
          />
        </div>
      </div>

      <div className='flex items-center space-x-4'>
        <button className='p-2 text-gray-400 hover:text-gray-600 relative'>
          <svg
            className='h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 17h5l-5-5-5 5h5zm0 0v-5'
            />
          </svg>
        </button>

        <button className='p-2 text-gray-400 hover:text-gray-600 relative'>
          <svg
            className='h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
            />
          </svg>
        </button>

        <button className='p-2 text-gray-400 hover:text-gray-600 relative'>
          <svg
            className='h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 17h5l-5-5-5 5h5zm0 0v-5'
            />
          </svg>
        </button>

        <button className='p-2 text-gray-400 hover:text-gray-600'>
          <svg
            className='h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
            />
          </svg>
        </button>

        <div className='relative'>
          <div className='flex items-center space-x-3'>
            <div
              className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors'
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className='text-sm font-medium text-blue-600'>
                {getUserInitials()}
              </span>
            </div>
            <span className='text-sm font-medium text-gray-700'>
              {getUserName()}
            </span>
            <svg
              className={`h-4 w-4 text-gray-400 transition-transform ${
                showDropdown ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </div>

          {showDropdown && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50'>
              <div className='px-4 py-2 border-b border-gray-100'>
                <p className='text-sm font-medium text-gray-900'>
                  {getUserName()}
                </p>
                <p className='text-xs text-gray-500'>{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  // Aquí se podría agregar navegación al perfil
                  setShowDropdown(false)
                }}
                className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
              >
                👤 Mi Perfil
              </button>
              <button
                onClick={() => {
                  // Aquí se podría agregar navegación a configuraciones
                  setShowDropdown(false)
                }}
                className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
              >
                ⚙️ Configuración
              </button>
              <div className='border-t border-gray-100'>
                <button
                  onClick={handleLogout}
                  className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para cerrar dropdown */}
      {showDropdown && (
        <div
          className='fixed inset-0 z-40'
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  )
}

export default Header
