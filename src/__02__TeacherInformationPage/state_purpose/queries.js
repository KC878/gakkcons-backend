// Query to update the reason field of an appointment
const updateReason = `
  UPDATE Appointments
  SET reason = $1
  WHERE appointment_id = $2
  RETURNING *;
`;

module.exports = {
  updateReason,
};
