const teacherQueries = require("./../db/queries/teacher");

const getTeachers = async (req, res) => {
  try {
    const teachers = await teacherQueries.getTeachers();
    res.json(teachers); // Send the response as JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

const searchTeacher = async (req, res) => {
  try {
    // Retrieve query string from the request
    const query = req.query.q;

    // If no query is provided, return an empty array
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query string cannot be empty" });
    }

    // Call the query function to get results
    const results = await teacherQueries.searchTeacher(query.trim());
    res.json(results);
  } catch (error) {
    // Handle errors and send a response
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTeachers,
  searchTeacher,
};
