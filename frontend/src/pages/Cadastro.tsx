import { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const SectionLabel = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <div className="d-flex align-items-center gap-2 mb-3 mt-1">
    <i className={`bi ${icon}`} style={{ color: 'var(--hl-pine-700)' }} />
    <h3 className="mb-0" style={{ fontSize: '1rem', fontFamily: 'var(--hl-font-body)', fontWeight: 700, color: 'var(--hl-pine-800)' }}>
      {children}
    </h3>
  </div>
);

export const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', cpf: '', telefone: '', tipo: 'CLIENTE',
    latitude: 0, longitude: 0, endereco_texto: '', cidade: '', bairro: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getLocalizacao = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }));
        setLocLoading(false);
      },
      () => {
        setError('Permissão de geolocalização negada.');
        setLocLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const res = await api.post('/auth/register', formData);
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Row className="justify-content-center hl-fade-in">
      <Col lg={9} xl={8}>
        <div className="text-center mb-4">
          <span className="hl-eyebrow">Comece agora</span>
          <h1 style={{ fontSize: '2rem' }} className="mt-1 mb-1">Crie sua conta no HubLocal</h1>
          <p className="text-muted mb-0">Leva menos de dois minutos.</p>
        </div>

        <div className="bg-white p-4 p-md-5" style={{ borderRadius: 'var(--hl-radius-lg)', boxShadow: 'var(--hl-shadow-sm)', border: '1px solid var(--hl-border-soft)' }}>
          {error && <Alert variant="danger" className="hl-alert py-2">{error}</Alert>}
          {success && <Alert variant="success" className="hl-alert py-2">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <SectionLabel icon="bi-person-badge">Que tipo de conta você quer criar?</SectionLabel>
            <Row className="g-3 mb-4">
              {[
                { value: 'CLIENTE', label: 'Cliente', desc: 'Quero contratar serviços', icon: 'bi-search' },
                { value: 'TRABALHADOR', label: 'Trabalhador', desc: 'Quero oferecer serviços', icon: 'bi-tools' },
              ].map((opt) => (
                <Col sm={6} key={opt.value}>
                  <label
                    className="d-flex align-items-center gap-3 p-3 w-100"
                    style={{
                      border: `1.5px solid ${formData.tipo === opt.value ? 'var(--hl-pine-700)' : 'var(--hl-border)'}`,
                      borderRadius: 'var(--hl-radius-sm)',
                      background: formData.tipo === opt.value ? 'var(--hl-pine-100)' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="radio"
                      name="tipo"
                      className="d-none"
                      checked={formData.tipo === opt.value}
                      onChange={() => setFormData({ ...formData, tipo: opt.value })}
                    />
                    <i className={`bi ${opt.icon}`} style={{ fontSize: '1.3rem', color: 'var(--hl-pine-700)' }} />
                    <div>
                      <div className="fw-semibold" style={{ color: 'var(--hl-pine-900)' }}>{opt.label}</div>
                      <div className="small text-muted">{opt.desc}</div>
                    </div>
                  </label>
                </Col>
              ))}
            </Row>

            <SectionLabel icon="bi-card-text">Dados pessoais</SectionLabel>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Senha (mín. 8 caracteres)</Form.Label>
                  <Form.Control type="password" required minLength={8} value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control required minLength={11} maxLength={11} value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} placeholder="(00) 00000-0000" />
                </Form.Group>
              </Col>
            </Row>

            <SectionLabel icon="bi-geo-alt">Sua localização</SectionLabel>
            <div
              className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 mb-3"
              style={{ background: 'var(--hl-surface-alt)', borderRadius: 'var(--hl-radius-sm)' }}
            >
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-crosshair" style={{ color: 'var(--hl-pine-700)', fontSize: '1.1rem' }} />
                <span className="small text-muted">
                  Usamos sua posição para calcular distância até clientes e profissionais.
                </span>
              </div>
              <Button variant={formData.latitude !== 0 ? 'success' : 'outline-primary'} size="sm" onClick={getLocalizacao} disabled={locLoading}>
                {locLoading ? (
                  <>Buscando...</>
                ) : formData.latitude !== 0 ? (
                  <><i className="bi bi-check-lg me-1" />Localização capturada</>
                ) : (
                  <><i className="bi bi-geo-alt me-1" />Usar minha localização</>
                )}
              </Button>
            </div>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" size="lg" type="submit" className="w-100 mt-3" disabled={submitting}>
              {submitting ? 'Criando conta...' : 'Cadastrar'}
            </Button>

            <p className="small text-muted text-center mt-3 mb-0">
              Já tem uma conta? <Link to="/login">Entrar</Link>
            </p>
          </Form>
        </div>
      </Col>
    </Row>
  );
};
