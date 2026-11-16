import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const emptyForm = { name: '', email: '', department: '', salary: '' };

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadEmployees() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/employees`);
      if (!response.ok) throw new Error('Could not load employees. Check that the backend is running.');
      setEmployees(await response.json());
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEmployees(); }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, salary: Number(form.salary) };
    try {
      const response = await fetch(
        editingId ? `${API_URL}/employees/${editingId}` : `${API_URL}/employees`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || Object.values(body).join(', ') || 'Unable to save employee.');
      }
      resetForm();
      await loadEmployees();
    } catch (err) {
      setError(err.message || 'Unable to save employee.');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(employee) {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: String(employee.salary)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteEmployee(id) {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setError('');
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Unable to delete employee.');
      await loadEmployees();
    } catch (err) {
      setError(err.message || 'Unable to delete employee.');
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">PEOPLE OPERATIONS</p>
          <h1>Employee Management</h1>
          <p className="subtitle">Manage your team details in one place.</p>
        </div>
        <div className="count-card">
          <span>Total employees</span>
          <strong>{employees.length}</strong>
        </div>
      </header>

      {error && <div className="alert" role="alert">{error}</div>}

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{editingId ? 'UPDATE RECORD' : 'NEW RECORD'}</p>
            <h2>{editingId ? 'Edit employee' : 'Add an employee'}</h2>
          </div>
          {editingId && <button className="button secondary" type="button" onClick={resetForm}>Cancel edit</button>}
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          <label>Full name
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Aarav Sharma" required />
          </label>
          <label>Email address
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@company.com" required />
          </label>
          <label>Department
            <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" required />
          </label>
          <label>Salary
            <input name="salary" type="number" min="0" step="0.01" value={form.salary} onChange={handleChange} placeholder="e.g. 65000" required />
          </label>
          <div className="form-actions">
            <button className="button primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update employee' : 'Add employee'}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TEAM DIRECTORY</p>
            <h2>Employees</h2>
          </div>
          <button className="button secondary" onClick={loadEmployees} type="button">Refresh</button>
        </div>

        {loading ? <p className="muted">Loading employees...</p> :
          employees.length === 0 ? <div className="empty"><strong>No employees yet</strong><span>Add the first employee using the form above.</span></div> :
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Salary</th><th>Actions</th></tr></thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.id}>
                    <td className="name-cell">{employee.name}</td>
                    <td>{employee.email}</td>
                    <td><span className="department">{employee.department}</span></td>
                    <td>{Number(employee.salary).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="actions">
                      <button className="text-button" onClick={() => startEdit(employee)}>Edit</button>
                      <button className="text-button danger" onClick={() => deleteEmployee(employee.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </section>
      <footer>Employee Management System · React · Spring Boot · PostgreSQL</footer>
    </main>
  );
}

export default App;
