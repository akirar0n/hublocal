import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export const EsqueciSenha = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setDevResetUrl('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccessMessage(
        response.data?.message ||
          'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.'
      );
      if (response.data?.devResetUrl) {
        setDevResetUrl(response.data.devResetUrl);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Ocorreu um erro ao processar a solicitação. Tente novamente.'
      );
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
        {/* Painel decorativo lateral */}
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
              <i className="bi bi-shield-lock-fill" style={{ color: 'var(--hl-pine-900)', fontSize: '1.4rem' }} />
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.6rem' }}>Recuperação de acesso</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)' }} className="small">
              Esqueceu sua senha? Não se preocupe! Informe seu e-mail cadastrado e enviaremos um link seguro para você redefini-la.
            </p>
          </div>
          <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Lembrou da senha?{' '}
            <Link to="/login" style={{ color: 'var(--hl-marigold-400)', fontWeight: 600 }}>
              Voltar ao login
            </Link>
          </p>
        </div>

        {/* Formulário */}
        <div className="p-4 p-md-5 bg-white flex-grow-1">
          <div className="mb-4">
            <Link
              to="/login"
              className="text-decoration-none small d-inline-flex align-items-center gap-1 mb-2"
              style={{ color: 'var(--hl-pine-700)', fontWeight: 500 }}
            >
              <i className="bi bi-arrow-left" /> Voltar ao login
            </Link>
            <h3 className="mb-1" style={{ fontSize: '1.4rem' }}>Esqueci minha senha</h3>
            <p className="text-muted small mb-0">
              Digite o e-mail associado à sua conta do HubLocal.
            </p>
          </div>

          {error && (
            <Alert variant="danger" className="hl-alert py-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill me-2" />
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert variant="success" className="hl-alert py-3 mb-3">
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-check-circle-fill text-success fs-5 mt-1" />
                <div>
                  <div className="fw-semibold mb-1">Solicitação enviada!</div>
                  <div className="small">{successMessage}</div>
                </div>
              </div>
            </Alert>
          )}

          {devResetUrl && (
            <div className="mb-3">
              <Button
                as={Link as any}
                to={devResetUrl.replace(/^https?:\/\/[^/]+/, '')}
                variant="primary"
                className="w-100 fw-semibold"
              >
                <i className="bi bi-key-fill me-1" /> Redefinir senha agora
              </Button>
            </div>
          )}

          {!successMessage ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>E-mail cadastrado</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <Form.Text className="text-muted small">
                  Enviaremos as instruções de redefinição para este endereço.
                </Form.Text>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Enviando instruções...
                  </>
                ) : (
                  'Enviar instruções'
                )}
              </Button>
            </Form>
          ) : (
            <div className="text-center mt-3">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setSuccessMessage('');
                  setDevResetUrl('');
                  setEmail('');
                }}
              >
                Tentar outro e-mail
              </Button>
            </div>
          )}

          <p className="small text-muted text-center mt-4 mb-0 d-md-none">
            Lembrou a senha? <Link to="/login">Voltar ao login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
