import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');

  const { register } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validaciones
    if (!email || !password || !confirmPassword) {
      setMessage('Todos los campos son obligatorios.');
      setVariant('danger');
      return;
    }
  
    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      setVariant('danger');
      return;
    }
  
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      setVariant('danger');
      return;
    }

    try {
      await register(email, password);
      setMessage('Registro exitoso.');
      setVariant('success');
      
    } catch (error) {
      setMessage('Error en el registro.');
      setVariant('danger');
    }
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Form onSubmit={handleSubmit} style={{ width: '300px' }}>
        <h2 className="text-center mb-4">Registro</h2>
        {message && <Alert variant={variant}>{message}</Alert>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Label>Confirmar contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Enviar
        </Button>
      </Form>
    </div>
  );
};

export default Register;