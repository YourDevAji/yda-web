//
//import express from 'express';
//import { createClient } from '@supabase/supabase-js';
//import cors from 'cors';
//
//const app = express();
//app.use(cors());
//app.use(express.json());
//
//const supabase = createClient('https://vnqdicxxneesaxrttein.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucWRpY3h4bmVlc2F4cnR0ZWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0ODk5NjQsImV4cCI6MjAzMzA2NTk2NH0.V8YzqJbs03FQibnel_khVmGFsyfRA9rzbU-5UB2TRvo')
//
//console.log(supabase);
//
//// Example route to fetch data from Supabase
//app.get('/data', async (req, res) => {
//    return res.status(200).json(supabase);
//});
//
//
//// Example route to insert data into Supabase
//app.post('/data', async (req, res) => {
//    const { newData } = req.body;
//    const { data, error } = await supabase.from('your_table').insert(newData);
//
//    if (error) {
//        return res.status(500).json({ error: error.message });
//    }
//    res.json(data);
//});
//
//const PORT = 3000;
//app.listen(PORT, () => {
//    console.log(`Server running on http://localhost:${PORT}`);
//});
