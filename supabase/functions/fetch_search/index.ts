
import { corsHeaders } from '../fetch_search/cors.ts'

 import { createClient } from '@supabase/supabase-js'
 const supabaseUrl = 'https://vnqdicxxneesaxrttein.supabase.co'
 const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucWRpY3h4bmVlc2F4cnR0ZWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0ODk5NjQsImV4cCI6MjAzMzA2NTk2NH0.V8YzqJbs03FQibnel_khVmGFsyfRA9rzbU-5UB2TRvo'
 const supabase = createClient(supabaseUrl, supabaseKey)


// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

console.log("Hello from Functions!")

Deno.serve(async (req) => {

 if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!, Api for search`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

