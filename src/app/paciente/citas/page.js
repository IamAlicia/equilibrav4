"use client";

import Navbar from "@/app/componentes/Navbar";
import { useState, useEffect } from "react";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    professionalId: "",
    date: "",
    time: "",
  });
  const [price, setPrice] = useState(null);

  // Cargar citas y profesionales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsRes = await fetch("/api/paciente/citas");
        const professionalsRes = await fetch("/api/profesionales");

        if (appointmentsRes.ok && professionalsRes.ok) {
          setAppointments(await appointmentsRes.json());
          setProfessionals(await professionalsRes.json());
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateAppointment = async () => {
    try {
      const { professionalId, date, time } = newAppointment;
      const appointmentDate = new Date(`${date}T${time}`);
      const res = await fetch("/api/paciente/citas", {
        method: "POST",
        body: JSON.stringify({
          professionalId,
          date: appointmentDate,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Cita agregada con éxito");
        setIsModalOpen(false);
        setAppointments(async (prev) => [...prev, await res.json()]);
      } else {
        alert("Error al agregar la cita");
      }
    } catch (error) {
      console.error("Error al crear cita:", error);
    }
  };

  const handleProfessionalChange = (e) => {
    const selectedProfessional = professionals.find(
      (p) => p.id === e.target.value
    );
    setPrice(selectedProfessional ? selectedProfessional.price : null);
    setNewAppointment({ ...newAppointment, professionalId: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando citas...
      </div>
    );
  }

  return (
    <>
      <Navbar role="PATIENT" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Mis Citas</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={() => setIsModalOpen(true)}
        >
          Agregar Cita
        </button>
        <ul className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <li key={appointment.id} className="border p-4 rounded">
                <p>
                  <strong>Profesional:</strong> {appointment.professionalName}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(appointment.date).toLocaleString()}
                </p>
                <p>
                  <strong>Estado:</strong> {appointment.status}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No tienes citas programadas.</p>
          )}
        </ul>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h2 className="text-xl font-bold mb-4">Nueva Cita</h2>
              <select
                className="border p-2 w-full rounded mb-4"
                onChange={handleProfessionalChange}
                value={newAppointment.professionalId}
              >
                <option value="">Selecciona un Profesional</option>
                {professionals.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name} - ${prof.price.toFixed(2)}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="border p-2 w-full rounded mb-4"
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, date: e.target.value })
                }
                value={newAppointment.date}
              />
              <input
                type="time"
                className="border p-2 w-full rounded mb-4"
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, time: e.target.value })
                }
                value={newAppointment.time}
              />
              {price && (
                <p className="mb-4">
                  <strong>Precio:</strong> ${price.toFixed(2)}
                </p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleCreateAppointment}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
