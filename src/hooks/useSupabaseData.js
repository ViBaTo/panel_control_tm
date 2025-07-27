import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export const useSupabaseData = (tableName, options = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  const { 
    select = '*',
    limit = null,
    orderBy = null,
    fallbackData = [],
    realtime = false
  } = options

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        let query = supabase
          .from(tableName)
          .select(select)

        if (limit) {
          query = query.limit(limit)
        }

        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending })
        }

        const { data: result, error } = await query

        if (error) {
          console.error(`Error fetching ${tableName}:`, error)
          setData(fallbackData)
          setError(error.message)
          setIsUsingFallback(true)
        } else {
          if (result && result.length > 0) {
            setData(result)
            setIsUsingFallback(false)
          } else {
            setData(fallbackData)
            setIsUsingFallback(true)
          }
        }
      } catch (err) {
        console.error(`Unexpected error fetching ${tableName}:`, err)
        setData(fallbackData)
        setError(err.message)
        setIsUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Configurar realtime si está habilitado
    let subscription
    if (realtime) {
      subscription = supabase
        .channel(`${tableName}_changes`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: tableName }, 
          () => {
            fetchData()
          }
        )
        .subscribe()
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [tableName, select, limit, orderBy, fallbackData, realtime])

  return { data, loading, error, isUsingFallback }
}