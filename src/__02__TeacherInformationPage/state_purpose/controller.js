
const db = require('./../../db'); // Import the database connection
const queries = require('./queries');

module.exports.updateReason = async (req, res) => {
    const { appointment_id } = req.params;
    const { reason } = req.body;
  
    console.log("Request Params:", req.params);
    console.log("Request Body:", req.body);
  
    if (!reason) {
      return res.status(400).json({ error: "Reason is required." });
    }
  
    try {
      const result = await db.query(queries.updateReason, [reason, appointment_id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Appointment not found." });
      }
  
      res.json({
        message: "Reason updated successfully.",
        appointment: result.rows[0],
      });
    } catch (err) {
      console.error("Error updating reason:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  