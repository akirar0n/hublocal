import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export const MeusServicos = () => {
  const { user } = useAuth();
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({ titulo: '', descricao: '', categoria: '', orcamento_base: '', aceita_permuta: false });

  useEffect(() => {
    carregarServicos();
  }, [user]);

  const carregarServicos = async () => {
    setLoading(true);
    const res = await api.get('/servicos');
    const meus = res.data.data.filter((s: any) => s.trabalhador.id === user?.id);
    setServicos(meus);
    setLoading(false);
  };

  const salvar = async () => {
    setSalvando(true);
    try {
      await api.post('/servicos', {
        ...form,
        orcamento_base: Number(form.orcamento_base)
      });
      alert('Serviço publicado com sucesso!');
      setShow(false);
      setForm({ titulo: '', descricao: '', categoria: '', orcamento_base: '', aceita_permuta: false });
      carregarServicos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro');
    } finally {
      setSalvando(false);
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
    <div className="hl-fade-in">
      <div className="hl-section-title">
        <div>
          <h2>Meus Serviços</h2>
          <p>Seu portfólio de serviços publicados no HubLocal.</p>
        </div>
        <Button variant="primary" onClick={() => setShow(true)}>
          <i className="bi bi-plus-lg me-1" /> Novo Serviço
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">Carregando...</div>
      ) : (
        <Row>
          {servicos.map(s => (
            <Col md={4} key={s.id} className="mb-4">
              <Card className="border-0 h-100 hl-card-hover">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0" style={{ fontSize: '1.05rem' }}>{s.titulo}</h5>
                    <span className={`hl-pill ${s.status === 'ATIVO' ? 'hl-pill--success' : 'hl-pill--secondary'}`}>
                      {s.status === 'ATIVO' ? 'Ativo' : 'Pausado'}
                    </span>
                  </div>
                  <p className="text-muted small mb-2">{s.categoria}</p>
                  <p className="small flex-grow-1">{s.descricao}</p>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="hl-pill hl-pill--primary">R$ {s.orcamentoBase}</span>
                    {s.aceita_permuta && <span className="hl-pill hl-pill--warning">Permuta</span>}
                  </div>
                  <div className="d-flex gap-2 mt-auto">
                    <Button variant={s.status === 'ATIVO' ? 'outline-secondary' : 'outline-primary'} size="sm" className="flex-grow-1" onClick={() => alternarStatus(s)}>
                      {s.status === 'ATIVO' ? 'Pausar' : 'Ativar'}
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => excluir(s.id)}>
                      <i className="bi bi-trash3" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {servicos.length === 0 && (
            <Col xs={12}>
              <div className="hl-empty-state">
                <i className="bi bi-briefcase d-block" />
                <h5 className="mb-1">Nenhum serviço publicado ainda</h5>
                <p className="mb-3 small">Publique seu primeiro serviço para começar a receber propostas.</p>
                <Button variant="primary" size="sm" onClick={() => setShow(true)}>
                  <i className="bi bi-plus-lg me-1" /> Novo Serviço
                </Button>
              </div>
            </Col>
          )}
        </Row>
      )}

      <Modal show={show} onHide={() => setShow(false)} centered className="hl-modal">
        <Modal.Header closeButton><Modal.Title>Novo Serviço</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} placeholder="Ex: Instalação elétrica residencial" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Control value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} placeholder="Ex: Eletricista" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Orçamento Base (R$)</Form.Label>
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
          <Button variant="outline-secondary" onClick={() => setShow(false)}>Cancelar</Button>
          <Button variant="primary" onClick={salvar} disabled={salvando}>
            {salvando ? 'Publicando...' : 'Publicar Serviço'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
