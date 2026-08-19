import { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', cpf: '', telefone: '', tipo: 'CLIENTE',
    latitude: 0, longitude: 0, endereco_texto: '', cidade: '', bairro: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locLoading, setLocLoading] = useState(false);

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
    try {
      const res = await api.post('/auth/register', formData);
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro');
    }
  };

  return (
    <Row className="justify-content-center mt-4">
      <Col md={8}>
        <Card className="shadow-sm">
          <Card.Body>
            <h3 className="text-center mb-4">Criar Conta</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
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
                    <Form.Control value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Perfil</Form.Label>
                    <Form.Select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                      <option value="CLIENTE">Cliente</option>
                      <option value="TRABALHADOR">Trabalhador</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <hr />
              <h5 className="mb-3">Localização Atual</h5>
              <div className="mb-3">
                <Button variant="outline-info" onClick={getLocalizacao} disabled={locLoading}>
                  {locLoading ? 'Buscando...' : 'Obter Localização via GPS'}
                </Button>
                {formData.latitude !== 0 && <span className="ms-3 text-success">✔ Coordenadas capturadas</span>}
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

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Cadastrar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
