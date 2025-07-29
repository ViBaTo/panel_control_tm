import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: verificar si las variables están disponibles
console.log(
  'VITE_SUPABASE_URL:',
  supabaseUrl ? 'Configurada' : 'NO CONFIGURADA'
)
console.log(
  'VITE_SUPABASE_ANON_KEY:',
  supabaseAnonKey ? 'Configurada' : 'NO CONFIGURADA'
)

// Debug: mostrar las primeras letras de las variables (sin mostrar todo por seguridad)
if (supabaseUrl) {
  console.log('URL starts with:', supabaseUrl.substring(0, 20) + '...')
}
if (supabaseAnonKey) {
  console.log('Key starts with:', supabaseAnonKey.substring(0, 10) + '...')
}

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL no está configurada. Por favor, configura esta variable de entorno.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_ANON_KEY no está configurada. Por favor, configura esta variable de entorno.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
