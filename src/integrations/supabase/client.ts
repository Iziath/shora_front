// Ce fichier n'est plus utilisé - MongoDB est utilisé à la place
// Ce fichier est conservé pour éviter les erreurs d'import, mais ne fait rien

// Ancien code Supabase commenté :
// import { createClient } from '@supabase/supabase-js';
// import type { Database } from './types';
// 
// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
// 
// export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
//   auth: {
//     storage: localStorage,
//     persistSession: true,
//     autoRefreshToken: true,
//   }
// });

// Export vide pour éviter les erreurs
export const supabase = null as any;
