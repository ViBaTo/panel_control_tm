import { supabase } from './supabase.js'

export const getPacientes = async () => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select(
        `
        id,
        numero_historia,
        dni_nie,
        nombre,
        apellidos,
        fecha_nacimiento,
        genero,
        telefono,
        telefono_secundario,
        email,
        direccion,
        ciudad,
        provincia,
        codigo_postal,
        activo,
        created_at,
        updated_at,
        clinica_id,
        origen_registro,
        preferencia_contacto,
        acepta_recordatorios,
        acepta_marketing,
        idioma_preferido,
        etiquetas,
        notas_internas
      `
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching patients:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    return {
      success: true,
      data: data || [],
      error: null
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error.message,
      data: []
    }
  }
}

export const getPacienteById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching patient:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    return {
      success: true,
      data: data,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

export const searchPacientes = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('pacientes')
      .select(
        `
        id,
        numero_historia,
        dni_nie,
        nombre,
        apellidos,
        telefono,
        email,
        activo,
        created_at
      `
      )
      .or(
        `nombre.ilike.%${searchTerm}%,apellidos.ilike.%${searchTerm}%,telefono.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,numero_historia.ilike.%${searchTerm}%`
      )
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error searching patients:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    return {
      success: true,
      data: data || [],
      error: null
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error.message,
      data: []
    }
  }
}

export const createPaciente = async (pacienteData) => {
  try {
    // Validar datos requeridos
    if (!pacienteData.nombre || !pacienteData.telefono) {
      return {
        success: false,
        error: 'Nombre y teléfono son campos obligatorios',
        data: null
      }
    }

    const { data, error } = await supabase
      .from('pacientes')
      .insert([pacienteData])
      .select()

    if (error) {
      console.error('Error creating patient:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    return {
      success: true,
      data: data?.[0] || null,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

export const updatePaciente = async (id, pacienteData) => {
  try {
    const { data, error } = await supabase
      .from('pacientes')
      .update({
        ...pacienteData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating patient:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    return {
      success: true,
      data: data?.[0] || null,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

export const deletePaciente = async (id) => {
  try {
    const { error } = await supabase.from('pacientes').delete().eq('id', id)

    if (error) {
      console.error('Error deleting patient:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export const togglePacienteStatus = async (id, activo) => {
  try {
    const { data, error } = await supabase
      .from('pacientes')
      .update({
        activo: activo,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error toggling patient status:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    return {
      success: true,
      data: data?.[0] || null,
      error: null
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

// Datos de fallback cuando no hay conexión a Supabase o la tabla está vacía
export const fallbackPacientes = []
