const TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
export const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export function availableDates(doctor, count = 10) {
  const out = [];
  const now = new Date();
  for (let i = 0; out.length < count && i < 30; i++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    if (doctor.days.includes(day.getDay())) out.push(iso(day));
  }
  return out;
}

// Simulated taken slots + slots booked in this app + times already past today.
export function slotsFor(doctor, date, appointments = [], ignoreId = null) {
  const now = new Date();
  const booked = new Set(
    appointments.filter((a) => a.doctorId === doctor.id && a.date === date && a.status === 'Upcoming' && a.id !== ignoreId).map((a) => a.time)
  );
  return TIMES.map((time) => ({
    time,
    available: hash(doctor.id + date + time) % 4 !== 0 && !booked.has(time) && new Date(`${date}T${time}:00`) > now,
  }));
}

export const nextSlot = (doctor, appointments) => {
  for (const date of availableDates(doctor, 5)) {
    const s = slotsFor(doctor, date, appointments).find((x) => x.available);
    if (s) return { date, time: s.time };
  }
  return null;
};

export const fmtDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
export const fmtTime = (t) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
export const money = (n) => `₹${n.toLocaleString('en-IN')}`;
export const isPast = (a) => new Date(`${a.date}T${a.time}:00`) <= new Date();
