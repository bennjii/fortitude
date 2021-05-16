import { createClient } from '@supabase/supabase-js'

const supabase = createClient("https://sqhegzswatflhwibycub.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDk3MTQyMywiZXhwIjoxOTM2NTQ3NDIzfQ.t8fg-7qVZDKbUK2ML93XOZWPlyMridksN1PfGz49_4o")

export { supabase };