import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar({ role }) {
  const links = {
    PATIENT: [
      { name: "Dashboard", href: "/paciente/dashboard" },
      { name: "Citas", href: "/paciente/citas" },
      { name: "Posts", href: "/paciente/posts" },
      { name: "Tests", href: "/paciente/tests" },
      { name: "Buscar", href: "/paciente/busqueda" },
    ],
    PROFESSIONAL: [
      { name: "Dashboard", href: "/profesional/dashboard" },
      { name: "Citas", href: "/profesional/citas" },
      { name: "Perfil", href: "/profesional/perfil" },
    ],
    ADMIN: [
      { name: "Dashboard", href: "/administrador/dashboard" },
      { name: "Posts", href: "/administrador/posts" },
      { name: "Citas", href: "/administrador/citas" },
      { name: "Ingresos", href: "/administrador/ingresos" },
    ],
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        {links[role].map((link) => (
          <li key={link.name}>
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
      <Link href="/">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Cerrar Sesión
        </button>
      </Link>
    </nav>
  );
}

