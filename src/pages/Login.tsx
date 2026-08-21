import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn({ email, senha });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center hl-fade-in">
      <div
        className="d-flex w-100 overflow-hidden"
        style={{ maxWidth: 880, borderRadius: 'var(--hl-radius-lg)', boxShadow: 'var(--hl-shadow)' }}
      >
        <div
          className="d-none d-md-flex flex-column justify-content-between p-5"
          style={{
            width: '42%',
            background: 'linear-gradient(160deg, var(--hl-pine-700), var(--hl-pine-900))',
            color: '#fff',
          }}
        >
          <div>
            <div
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--hl-marigold-500)' }}
            >
              <i className="bi bi-geo-alt-fill" style={{ color: 'var(--hl-pine-900)', fontSize: '1.4rem' }} />
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.6rem' }}>Bem-vindo de volta</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)' }} className="small">
              Entre para acompanhar suas propostas e continuar conectado aos profissionais e clientes do seu bairro.
            </p>
          </div>
          <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Novo por aqui?{' '}
            <Link to="/cadastro" style={{ color: 'var(--hl-marigold-400)', fontWeight: 600 }}>
              Crie sua conta
            </Link>
          </p>
        </div>

        <div className="p-4 p-md-5 bg-white flex-grow-1">
          <h3 className="mb-1" style={{ fontSize: '1.4rem' }}>Acessar conta</h3>
          <p className="text-muted small mb-4">Informe seu e-mail e senha para continuar.</p>

          {error && <Alert variant="danger" className="hl-alert py-2">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>

          <p className="small text-muted text-center mt-4 mb-0 d-md-none">
            Novo por aqui? <Link to="/cadastro">Crie sua conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
