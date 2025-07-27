import { supabase } from './supabase.js'

export const analyzeTable = async (tableName) => {
  try {
    // 1. Get sample data first to understand structure
    const { data: sampleData, error: sampleError } = await supabase
      .from(tableName)
      .select('*')
      .limit(10)

    if (sampleError) {
      console.error('Sample data error:', sampleError)
    }

    // 2. Get row count
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Count error:', countError)
    }

    // 3. Extract column information from sample data
    let columnInfo = []
    if (sampleData && sampleData.length > 0) {
      columnInfo = Object.keys(sampleData[0]).map(key => {
        const sampleValue = sampleData[0][key]
        let dataType = 'unknown'
        
        if (sampleValue === null) {
          dataType = 'null'
        } else if (typeof sampleValue === 'string') {
          // Check if it's a date string
          if (sampleValue.match(/^\d{4}-\d{2}-\d{2}/) || sampleValue.includes('T')) {
            dataType = 'datetime/text'
          } else {
            dataType = 'text'
          }
        } else if (typeof sampleValue === 'number') {
          dataType = Number.isInteger(sampleValue) ? 'integer' : 'numeric'
        } else if (typeof sampleValue === 'boolean') {
          dataType = 'boolean'
        } else if (sampleValue instanceof Date) {
          dataType = 'timestamp'
        }

        return {
          column_name: key,
          data_type: dataType,
          sample_value: sampleValue
        }
      })
    }

    return {
      schema: columnInfo,
      sampleData,
      rowCount: count,
      errors: {
        sampleError,
        countError
      }
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return { error }
  }
}

export const getTableColumns = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0)

    if (error) {
      console.error('Error getting columns:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Get columns error:', error)
    return null
  }
}