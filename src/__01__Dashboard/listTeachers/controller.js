const dashboardQueries = require('./queries');

// Get the list of teachers with their names and department
const getTeachers = async (req, res) => {
  try {
    const teachers = await dashboardQueries.getTeachers();
    res.json(teachers); // Send the response as JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

module.exports = {
  getTeachers,
};
