import { createClient } from '@supabase/supabase-js'

// URL ini saya ambil dari gambar yang Anda bagikan
const supabaseUrl = 'https://bcfymbzzjlahybizzrdw.supabase.co' 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZnltYnp6amxhaHliaXp6cmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MDE0NDcsImV4cCI6MjEwMDQ3NzQ0N30.gR6uw5UfiPPyajaT8Bqnk-c5WEBKNhO1tpI3sKKs9W0'

export const supabase = createClient(supabaseUrl, supabaseKey)