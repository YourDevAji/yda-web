
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnqdicxxneesaxrttein.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucWRpY3h4bmVlc2F4cnR0ZWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0ODk5NjQsImV4cCI6MjAzMzA2NTk2NH0.V8YzqJbs03FQibnel_khVmGFsyfRA9rzbU-5UB2TRvo'
export const supabase = createClient(supabaseUrl, supabaseKey)