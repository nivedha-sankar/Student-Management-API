const API_URL = "/api/students";

const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");

let editingId = null;

// GET - Display all students
async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Failed to load students");
        }

        studentTableBody.innerHTML = "";

        data.students.forEach(student => {
            const row = document.createElement("tr");

            [student.id, student.name, student.age,
             student.course, student.email].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";
            editButton.onclick = () => editStudent(student);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            deleteButton.onclick = () => deleteStudent(student.id);

            actionCell.append(editButton, deleteButton);
            row.appendChild(actionCell);

            studentTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Loading error:", error);
        alert(error.message);
    }
}

// POST - Add student
// PUT - Update student
studentForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),
        age: Number(document.getElementById("age").value),
        course: document.getElementById("course").value.trim(),
        email: document.getElementById("email").value.trim()
    };

    try {
        const url = editingId
            ? `${API_URL}/${editingId}`
            : API_URL;

        const response = await fetch(url, {
            method: editingId ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Operation failed");
        }

        alert(data.message);

        studentForm.reset();
        editingId = null;

        document.getElementById("submitBtn").textContent = "Add Student";

        await loadStudents();

    } catch (error) {
        console.error("Save error:", error);
        alert(error.message);
    }
});

// Edit student
function editStudent(student) {
    editingId = student.id;

    document.getElementById("name").value = student.name;
    document.getElementById("age").value = student.age;
    document.getElementById("course").value = student.course;
    document.getElementById("email").value = student.email;

    document.getElementById("submitBtn").textContent = "Update Student";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// DELETE - Delete student
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Delete failed");
        }

        alert(data.message);
        await loadStudents();

    } catch (error) {
        console.error("Delete error:", error);
        alert(error.message);
    }
}

// Initial loading
loadStudents();