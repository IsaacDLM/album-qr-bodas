import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Comprobamos si el usuario intenta acceder a /admin o cualquier subruta (como /admin/nuevo)
  if (req.nextUrl.pathname.startsWith('/admin')) {
    
    // Obtenemos la cabecera de autorización que envía el navegador
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      // Decodificamos el formato base64 que usa el navegador (usuario:contraseña)
      const [user, pwd] = atob(authValue).split(':');

      // Validamos si la contraseña coincide con nuestra variable de entorno
      // (El usuario puede ser cualquiera, solo nos importa la contraseña)
      if (pwd === process.env.ADMIN_PASSWORD) {
        return NextResponse.next(); // Contraseña correcta, le dejamos pasar
      }
    }

    // Si no hay contraseña o es incorrecta, forzamos al navegador a mostrar la ventana de login
    return new NextResponse('Autenticación requerida', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Panel de Administración"',
      },
    });
  }

  // Para las rutas públicas (como /e/[token]), dejamos pasar sin preguntar nada
  return NextResponse.next();
}

// Configuración opcional para optimizar: el middleware solo se ejecutará en las rutas de admin
export const config = {
  matcher: ['/admin/:path*'],
};