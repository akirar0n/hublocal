import { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn({ email, senha });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar login');
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: '400px' }} className="shadow-sm">
        <Card.Body>
          <h3 className="text-center mb-4">Acesso</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Senha</Form.Label>
              <Form.Control 
                type="password" 
                value={senha} 
                onChange={e => setSenha(e.target.value)} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Entrar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
