// This is a mock implementation that uses localStorage instead of actual Supabase
// All functions will work with localStorage to avoid connection errors

export const getSupabaseClient = () => {
  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          maybeSingle: async () => {
            try {
              const items = JSON.parse(localStorage.getItem(table) || "[]")
              const item = items.find((item: any) => item[column] === value)
              return { data: item || null, error: null }
            } catch (error) {
              return { data: null, error }
            }
          },
          single: async () => {
            try {
              const items = JSON.parse(localStorage.getItem(table) || "[]")
              const item = items.find((item: any) => item[column] === value)
              return { data: item || null, error: null }
            } catch (error) {
              return { data: null, error }
            }
          },
        }),
      }),
      insert: (data: any) => ({
        select: (columns: string) => ({
          single: async () => {
            try {
              const items = JSON.parse(localStorage.getItem(table) || "[]")
              const newItem = { id: `id-${Date.now()}`, ...data }
              items.push(newItem)
              localStorage.setItem(table, JSON.stringify(items))
              return { data: newItem, error: null }
            } catch (error) {
              return { data: null, error }
            }
          },
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            try {
              const items = JSON.parse(localStorage.getItem(table) || "[]")
              const index = items.findIndex((item: any) => item[column] === value)
              if (index !== -1) {
                items[index] = { ...items[index], ...data }
                localStorage.setItem(table, JSON.stringify(items))
              }
              return { data: items[index], error: null }
            } catch (error) {
              return { data: null, error }
            }
          },
        }),
      }),
    }),
  }
}

export const createServerClient = () => {
  return getSupabaseClient()
}

export const supabase = getSupabaseClient()
