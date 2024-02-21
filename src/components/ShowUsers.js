import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowUsers = () => {
    const url = 'http://localhost:4000/api/usuarios/';
    const [users, setUsers] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get(url);
            setUsers(response.data.body);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const openModal = (op, id, name, username, email, phone, website) => {
        setId('');
        setName('');
        setUsername('');
        setEmail('');
        setPhone('');
        setWebsite('');
        setOperation(op);
        if (op === 1) {
            setTitle('Registrar Usuario');
        } else if (op === 2) {
            setTitle('Editar Usuario');
            setId(id);
            setName(name);
            setUsername(username);
            setEmail(email);
            setPhone(phone);
            setWebsite(website);
        }
        window.setTimeout(function () {
            document.getElementById('nombre').focus();
        }, 500);
    }

    const validar = () => {
        let parametros;
        let metodo;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d+$/;
        const webRegex = /^(ftp|http|https):\/\/[^ "]+$/;

        if (name.trim() === '') {
            show_alerta('Escribe el nombre del usuario', 'warning');
        } else if (username.trim() === '') {
            show_alerta('Escribe el nombre de usuario', 'warning');
        } else if (!emailRegex.test(email.trim())) {
            show_alerta('Escribe un correo electrónico válido', 'warning');
        } else if (!phoneRegex.test(phone.trim())) {
            show_alerta('Escribe un número de teléfono válido', 'warning');
        } else if (!webRegex.test(website.trim())) {
            show_alerta('Escribe un sitio web válido', 'warning');
        } else {
            if (operation === 1) {
                id = 0;
                parametros = { id, name, username, email, phone, website };
                metodo = 'POST';
            } else {
                parametros = { id, name, username, email, phone, website };
                metodo = 'POST';
            }
            sendRequest(metodo, parametros);
        }
    }

    const deleteUser = async (id, name) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el usuario ' + name + '?',
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(url, { id });
                    show_alerta('Usuario eliminado satisfactoriamente', 'success');
                    getUsers();
                } catch (error) {
                    show_alerta('Error al eliminar el usuario', 'error');
                    console.error('Error:', error);
                }
            } else {
                show_alerta('El usuario no fue eliminado', 'info');
            }
        });
    }

    const sendRequest = async (method, data) => {
        try {
            const response = await axios({ method, url, data });
            const tipo = response.data.error ? 'error' : 'success';
            const msj = response.data.error ? 'Error en la solicitud' : 'Solicitud realizada con éxito';
            show_alerta(msj, tipo);
            if (tipo === 'success') {
                document.getElementById('btnCerrar').click();
                getUsers();
            }
        } catch (error) {
            show_alerta('Error en la solicitud', 'error');
            console.error('Error:', error);
        }
    }

    return (
        <div className='app'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalUsers'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-12'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Usuario</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Sitio Web</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {users.map((user, i) => (
                                        <tr key={user.id}>
                                            <td>{i + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.website}</td>
                                            <td>
                                                <button onClick={() => openModal(2, user.id, user.name, user.username, user.email, user.phone, user.website)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalUsers'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteUser(user.id, user.name)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalUsers' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>{title}</h5>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                                <input type='text' id='usuario' className='form-control' placeholder='Usuario' value={username} onChange={(e) => setUsername(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-envelope'></i></span>
                                <input type='email' id='email' className='form-control' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-phone'></i></span>
                                <input type='text' id='telefono' className='form-control' placeholder='Teléfono' value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-globe'></i></span>
                                <input type='text' id='website' className='form-control' placeholder='Sitio Web' value={website} onChange={(e) => setWebsite(e.target.value)}></input>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                            <button onClick={() => validar()} className='btn btn-success'><i className='fa-solid fa-save'></i> Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowUsers;
