import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export const MeusServicos = () => {
  const { user } = useAuth();
  const [servicos, setServicos] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ titulo: '', descricao: '', categoria: '', orcamento_base: '', aceita_permuta: false });

  useEffect(() => {
    carregarServicos();
  }, [user]);

  const carregarServicos = async () => {
    // Busca na vdd no endpoint /servicos filtrando pelo usuario, 
    // mas a API retorna todos na listagem com parametro, ou podemos pegar do array se necessario
    // Por simplicidade, vamos usar o endpoint /servicos e filtrar os meus no frontend, 
    // embora no mundo ideal teriamos um /servicos/meus
    const res = await api.get('/servicos');
    const meus = res.data.data.filter((s: any) => s.trabalhador.id === user?.id);
    setServicos(meus);
  };

  const salvar = async () => {
    try {
      await api.post('/servicos', {
        ...form,
        orcamento_base: Number(form.orcamento_base)
      });
      alert('Serviço publicado com sucesso!');
      setShow(false);
      carregarServicos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro');
    }
  };

  const alternarStatus = async (s: any) => {
    const novo = s.status === 'ATIVO' ? 'PAUSADO' : 'ATIVO';
    await api.patch(`/servicos/${s.id}/status`, { status: novo });
    carregarServicos();
  };

  const excluir = async (id: number) => {
    if (confirm('Deseja excluir?')) {
      await api.delete(`/servicos/${id}`);
      carregarServicos();
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Meus Serviços (Portfólio)</h2>
        <Button variant="primary" onClick={() => setShow(true)}>+ Novo Serviço</Button>
      </div>

      <Row>
        {servicos.map(s => (
          <Col md={4} key={s.id} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <h5>{s.titulo}</h5>
                  <Badge bg={s.status === 'ATIVO' ? 'success' : 'secondary'}>{s.status}</Badge>
                </div>
                <p className="text-muted small">{s.categoria}</p>
                <p>{s.descricao}</p>
                <p><strong>Base:</strong> R$ {s.orcamentoBase}</p>
                <div className="d-flex gap-2 mt-3">
                  <Button variant={s.status === 'ATIVO' ? 'warning' : 'success'} size="sm" onClick={() => alternarStatus(s)}>
                    {s.status === 'ATIVO' ? 'Pausar' : 'Ativar'}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => excluir(s.id)}>Excluir</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Novo Serviço</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Control value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Orçamento Base</Form.Label>
              <Form.Control type="number" value={form.orcamento_base} onChange={e => setForm({...form, orcamento_base: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
            </Form.Group>
            <Form.Check type="checkbox" label="Aceita Permuta?" checked={form.aceita_permuta} onChange={e => setForm({...form, aceita_permuta: e.target.checked})} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={salvar}>Publicar Serviço</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
