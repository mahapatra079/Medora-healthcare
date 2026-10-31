import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'appointments',
  initialState: { items: [] },
  reducers: {
    bookAppointment: {
      reducer(state, { payload }) { state.items.push(payload); },
      prepare(data) { return { payload: { id: `APT${Date.now().toString().slice(-6)}`, status: 'Upcoming', ...data } }; },
    },
    rescheduleAppointment(state, { payload: { id, date, time } }) {
      const a = state.items.find((x) => x.id === id);
      if (a) { a.date = date; a.time = time; a.status = 'Upcoming'; }
    },
    cancelAppointment(state, { payload: id }) {
      const a = state.items.find((x) => x.id === id);
      if (a) a.status = 'Cancelled';
    },
  },
});
export const { bookAppointment, rescheduleAppointment, cancelAppointment } = slice.actions;
export default slice.reducer;
