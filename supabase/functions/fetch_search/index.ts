
import { corsHeaders } from '../_shared/cors.ts'


// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

console.log("Hello from Functions!")

Deno.serve(async (req) => {

console.log("Serving")

 if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!, Api for search`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})

