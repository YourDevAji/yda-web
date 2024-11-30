
const { createClient } = supabase;
const supabaseUrl = 'https://gjauthxqkiyimuqmmpxt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqYXV0aHhxa2l5aW11cW1tcHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTMzNjIsImV4cCI6MjA0ODI4OTM2Mn0.NKcj8p6AqhV2qpnUaa0dsP96Zh9ZUimC3s9Qa2zl3oc';

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

//console.log("Created");

export default supabaseClient;
