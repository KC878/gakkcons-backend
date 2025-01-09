const teacherQueries = require("./../db/queries/teacher");
const pool = require("./../db/pool");

const getTeachers = async (req, res) => {
  try {
    const { search } = req.query;

    const query = teacherQueries.getTeachersQuery(search);
    const values = search ? [`%${search}%`] : [];

    const { rows: teachers } = await pool.query(query, values);

    res.json(teachers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
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
  searchTeacher
};
