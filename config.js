// Conexión a Supabase para el modo en línea (solicitudes compartidas entre varios usuarios).
// La llave "publishable" es pública por diseño: la protección de los datos la dan el inicio de sesión
// y las reglas de seguridad (RLS) de la base. NUNCA poner aquí la llave service_role.
//
// Mientras `url` y `key` estén vacías, la app trabaja en MODO LOCAL (como hasta ahora, sin iniciar sesión).
// Para activar el modo en línea: pega aquí la URL del proyecto y la llave publishable
// (Supabase → Project Settings → API) y publica de nuevo los archivos.
window.AC_CONFIG = {
  url: 'https://qcsguejhhtzcoklwzlst.supabase.co',
  key: 'sb_publishable_OcNHxC-beL2UUtrFEs1S8A_GlTBRAQi',
  dominioCorreo: 'ac-ixhuatlan.local'   // permite entrar escribiendo solo «recepcion», «analista», «obras»…
};
