import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export const Perfil = () => {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'danger', texto: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    try {
      const res = await api.put('/usuarios/me', formData);
      updateUser(res.data.data);
      setMensagem({ tipo: 'success', texto: 'Perfil atualizado com sucesso!' });
    } catch (error: any) {
      setMensagem({ 
        tipo: 'danger', 
        texto: error.response?.data?.message || 'Erro ao atualizar o perfil. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="hl-fade-in py-4">
      <Container style={{ maxWidth: '800px' }}>
        <div className="d-flex align-items-center mb-4">
          <i className="bi bi-person-circle fs-1 me-3 text-secondary"></i>
          <div>
            <h2 className="mb-0" style={{ color: 'var(--hl-pine-900)' }}>Meu Perfil</h2>
            <p className="text-muted mb-0">Atualize suas informações pessoais</p>
          </div>
        </div>

        {mensagem && (
          <Alert variant={mensagem.tipo} dismissible onClose={() => setMensagem(null)}>
            {mensagem.texto}
          </Alert>
        )}

        <Card className="border-0 shadow-sm" style={{ borderRadius: 'var(--hl-radius)' }}>
          <Card.Body className="p-4 p-md-5">
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Telefone / WhatsApp</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mt-4">
                <Col className="d-flex justify-content-end">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="px-4"
                  >
                    {loading ? (
                      <><i className="bi bi-arrow-repeat me-2"></i>Salvando...</>
                    ) : (
                      <><i className="bi bi-save me-2"></i>Salvar Alterações</>
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};
