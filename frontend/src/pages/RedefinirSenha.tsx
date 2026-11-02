import { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

export const RedefinirSenha = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token de recuperação não encontrado no link. Por favor, solicite um novo link.');
      return;
    }

    if (novaSenha.length < 8) {
      setError('A senha deve conter pelo menos 8 caracteres.');
      return;
    }

    if (novaSenha !== confirmaSenha) {
      setError('A confirmação de senha não confere com a nova senha.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        novaSenha,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Não foi possível redefinir sua senha. O link pode ter expirado ou já ter sido utilizado.'
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
              <i className="bi bi-key-fill" style={{ color: 'var(--hl-pine-900)', fontSize: '1.4rem' }} />
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.6rem' }}>Nova Senha</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)' }} className="small">
              Defina uma senha segura com no mínimo 8 caracteres para voltar a utilizar o HubLocal com total segurança.
            </p>
          </div>
          <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Lembrou da senha anterior?{' '}
            <Link to="/login" style={{ color: 'var(--hl-marigold-400)', fontWeight: 600 }}>
              Fazer login
            </Link>
          </p>
        </div>

        {/* Formulário / Confirmação */}
        <div className="p-4 p-md-5 bg-white flex-grow-1">
          <h3 className="mb-1" style={{ fontSize: '1.4rem' }}>Criar nova senha</h3>
          <p className="text-muted small mb-4">
            Escolha uma nova senha para acessar sua conta.
          </p>

          {!token && (
            <Alert variant="warning" className="hl-alert mb-4">
              <div className="fw-semibold mb-1">Token não encontrado</div>
              <p className="small mb-2">
                O link acessado não contém um token de recuperação válido.
              </p>
              <Button
                as={Link as any}
                to="/esqueci-senha"
                variant="outline-primary"
                size="sm"
              >
                Solicitar nova recuperação
              </Button>
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="hl-alert py-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill me-2" />
              {error}
            </Alert>
          )}

          {success ? (
            <div className="text-center py-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: 64, height: 64, background: 'var(--hl-pine-100)', color: 'var(--hl-pine-700)' }}
              >
                <i className="bi bi-check-lg fs-1" />
              </div>
              <h4 className="fw-bold mb-2">Senha alterada com sucesso!</h4>
              <p className="text-muted small mb-4">
                Sua credencial foi atualizada. Agora você já pode entrar na sua conta com a nova senha.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
                className="w-100"
              >
                Ir para o Login
              </Button>
            </div>
          ) : (
            token && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nova senha</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo de 8 caracteres"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      required
                      minLength={8}
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted small">
                    Deve conter no mínimo 8 caracteres.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirmar nova senha</Form.Label>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repita a nova senha"
                    value={confirmaSenha}
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                    required
                    minLength={8}
                  />
                  {confirmaSenha && novaSenha !== confirmaSenha && (
                    <Form.Text className="text-danger small">
                      As senhas não coincidem.
                    </Form.Text>
                  )}
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Salvando...
                    </>
                  ) : (
                    'Redefinir senha'
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to="/esqueci-senha"
                    className="small text-decoration-none text-muted"
                  >
                    Não recebeu ou o link expirou? Solicitar novo link
                  </Link>
                </div>
              </Form>
            )
          )}
        </div>
      </div>
    </div>
  );
};
