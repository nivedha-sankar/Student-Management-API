import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const API = 'http://localhost:5000/api/students';

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  // Get all students
  const getStudents = async () => {
    try {
      const response = await axios.get(API);
      setStudents(response.data.students);
    } catch (error) {
      console.log(error);
      alert('Failed to fetch students');
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Clear form
  const clearForm = () => {
    setName('');
    setAge('');
    setEmail('');
    setCourse('');
    setEditId(null);
  };

  // Register or Update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    const student = {
      name,
      age: Number(age),
      email,
      course
    };

    try {
      if (editId !== null) {
        await axios.put(`${API}/${editId}`, student);
        alert('Student updated successfully!');
      } else {
        await axios.post(API, student);
        alert('Student added successfully!');
      }

      clearForm();
      await getStudents();

    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.error || 'Operation failed'
      );
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setEditId(student.id);
    setName(student.name);
    setAge(student.age);
    setEmail(student.email);
    setCourse(student.course);
  };

  // Delete student
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${API}/${id}`);
        alert('Student deleted successfully!');
        await getStudents();

        if (editId === id) {
          clearForm();
        }
      } catch (error) {
        console.log(error);
        alert('Delete failed');
      }
    }
  };

  // Search students
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  // Export students to CSV
  const exportStudents = () => {
    if (students.length === 0) {
      alert('No student records to download');
      return;
    }

    const headers = ['ID', 'Name', 'Age', 'Email', 'Course'];

    const rows = students.map((student) => [
      student.id,
      student.name,
      student.age,
      student.email,
      student.course
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value ?? '').replace(/"/g, '""')}"`
          )
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob(
      ['\uFEFF' + csvContent],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'students.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">

      <h1>Student Management System</h1>

      <h2>
        {editId !== null
          ? 'Edit Student'
          : 'Student Registration'}
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Enter Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Enter Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          min="1"
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />

        <button type="submit">
          {editId !== null
            ? 'Update Student'
            : 'Register Student'}
        </button>

        {editId !== null && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}

      </form>

      <h2>All Students</h2>

      <button onClick={exportStudents}>
        Download Student Details (CSV)
      </button>

      <input
        type="text"
        placeholder="Search student by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>

                <td>
                  <button
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Total Students: {students.length}</h3>

    </div>
  );
}

export default App;