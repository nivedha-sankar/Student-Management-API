// Backend API URL
const API_URL = "/api/students";

// Get HTML elements
const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const studentId = document.getElementById("studentId");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const courseInput = document.getElementById("course");
const emailInput = document.getElementById("email");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const statusMessage = document.getElementById("statusMessage");


// Display messages
function showMessage(message) {
    statusMessage.textContent = message;
}


// GET - Display all students
async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Failed to fetch students");
        }

        studentList.innerHTML = "";

        data.students.forEach(student => {

            const row = document.createElement("tr");

            // Student details
            const values = [
                student.id,
                student.name,
                student.age,
                student.course,
                student.email
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            // Action buttons
            const actionCell = document.createElement("td");

            // Edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";

            editButton.addEventListener("click", () => {
                editStudent(student);
            });

            // Delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";

            deleteButton.addEventListener("click", () => {
                deleteStudent(student.id);
            });

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);

            studentList.appendChild(row);
        });

        showMessage(`Total Students: ${data.count}`);

    } catch (error) {
        console.error("GET Error:", error);
        showMessage(error.message);
    }
}


// POST - Add new student
// PUT - Update existing student
studentForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const student = {
        name: nameInput.value.trim(),
        age: Number(ageInput.value),
        course: courseInput.value.trim(),
        email: emailInput.value.trim()
    };

    const id = studentId.value;

    try {

        let response;

        if (id) {

            // PUT - Update student
            response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            });

        } else {

            // POST - Add student
            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            });

        }

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Operation failed");
        }

        showMessage(data.message);

        resetForm();

        await loadStudents();

    } catch (error) {

        console.error("POST/PUT Error:", error);
        showMessage(error.message);

    }

});


// EDIT - Fill form with existing student details
function editStudent(student) {

    studentId.value = student.id;

    nameInput.value = student.name;
    ageInput.value = student.age;
    courseInput.value = student.course;
    emailInput.value = student.email;

    formTitle.textContent = "Update Student";

    submitBtn.textContent = "Update Student";

    cancelBtn.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Cancel edit
cancelBtn.addEventListener("click", function() {

    resetForm();

});


// Reset form
function resetForm() {

    studentForm.reset();

    studentId.value = "";

    formTitle.textContent = "Add New Student";

    submitBtn.textContent = "Add Student";

    cancelBtn.hidden = true;

}


// DELETE - Remove student
async function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
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

        showMessage(data.message);

        await loadStudents();

    } catch (error) {

        console.error("DELETE Error:", error);
        showMessage(error.message);

    }

}


// Load students when webpage opens
loadStudents();