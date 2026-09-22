import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 font-sans text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Álbum QR</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Plataforma privada para capturar y compartir los recuerdos de tu evento.
      </p>
      <Link 
        href="/admin" 
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
      >
        Acceder al Panel
      </Link>
    </main>
  );
}