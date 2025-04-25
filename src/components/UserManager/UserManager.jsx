import React, { useEffect, useState } from 'react';
import './UserManager.css';

const API_URL = 'http://localhost:8081/identity/users';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        dob: ''
    });
    const [editingId, setEditingId] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            if (data.code === 0 && Array.isArray(data.result)) {
                setUsers(data.result);
            } else {
                alert('Lỗi khi tải danh sách người dùng.');
            }
        } catch (error) {
            console.error("Lỗi khi fetch người dùng:", error);
            alert('Không thể kết nối đến máy chủ.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;

        const body = editingId
            ? {
                username: form.username,
                firstName: form.firstName,
                lastName: form.lastName,
                dob: form.dob
            }
            : {
                username: form.username,
                password: form.password,
                firstName: form.firstName,
                lastName: form.lastName,
                dob: form.dob
            };

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            fetchUsers();
            resetForm();
        } else {
            alert('Đã xảy ra lỗi khi lưu dữ liệu.');
        }
    };

    const handleEdit = (user) => {
        setForm({
            username: user.username,
            password: '',
            firstName: user.firstName,
            lastName: user.lastName,
            dob: user.dob
        });
        setEditingId(user.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) fetchUsers();
        else alert('Xóa không thành công!');
    };

    const resetForm = () => {
        setForm({
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            dob: ''
        });
        setEditingId(null);
    };

    return (
        <div className="user-manager">
            <h2>Quản lý người dùng</h2>
            <div className="form">
                <input name="username" placeholder="Tên đăng nhập" value={form.username} onChange={handleChange} />
                {!editingId && (
                    <input
                        name="password"
                        placeholder="Mật khẩu"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                    />
                )}
                <input name="firstName" placeholder="Họ" value={form.firstName} onChange={handleChange} />
                <input name="lastName" placeholder="Tên" value={form.lastName} onChange={handleChange} />
                <input name="dob" placeholder="Ngày sinh (YYYY-MM-DD)" value={form.dob} onChange={handleChange} />
                <button onClick={handleSubmit}>{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
                {editingId && <button onClick={resetForm}>Hủy</button>}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên đăng nhập</th>
                        <th>Họ</th>
                        <th>Tên</th>
                        <th>Ngày sinh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>Chưa có người dùng nào.</td>
                        </tr>
                    )}
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.firstName}</td>
                            <td>{u.lastName}</td>
                            <td>{u.dob ? new Date(u.dob).toISOString().split('T')[0] : ''}</td>
                            <td>
                                <button onClick={() => handleEdit(u)}>Sửa</button>
                                <button onClick={() => handleDelete(u.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManager;
