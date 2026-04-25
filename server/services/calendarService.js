export function buildCalendarEvent(appointment, doctorName) {
  const [hours, minutes] = appointment.time.split(":").map((part) => Number(part));
  const start = new Date(appointment.date);
  start.setHours(hours, minutes, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 45);

  return {
    id: String(appointment._id),
    title: `${appointment.name} - ${doctorName}`,
    start,
    end,
    extendedProps: {
      status: appointment.status,
      service: appointment.service,
      phone: appointment.phone,
      email: appointment.email,
    },
  };
}
