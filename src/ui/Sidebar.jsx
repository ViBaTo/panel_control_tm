import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { name: 'Citas', path: '/citas', icon: '📅' },
    { name: 'Pacientes', path: '/pacientes', icon: '👥' }
  ]

  return (
    <div className='w-64 bg-white border-r border-gray-200 flex flex-col'>
      <div className='p-6 border-b border-gray-200'>
        <h1 className='text-2xl font-bold text-blue-600'>DASHB⚙ARD</h1>
      </div>

      <nav className='flex-1 py-4'>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className='mr-3 text-lg'>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className='p-6 border-t border-gray-200'>
        <button className='flex items-center text-sm font-medium text-gray-700 hover:text-gray-900'>
          <span className='mr-3 text-lg'>➕</span>
          New
        </button>
      </div>
    </div>
  )
}

export default Sidebar
