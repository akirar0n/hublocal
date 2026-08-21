import { useState, useEffect } from 'react';
import { Row, Col, Card, Modal, Form, Button } from 'react-bootstrap';
import { api } from '../../services/api';

const STATUS_META: Record<string, { label: string; pill: string }> = {
  PENDENTE: { label: 'Pendente', pill: 'hl-pill--warning' },
  ACEITA: { label: 'Aceita', pill: 'hl-pill--info' },
  RECUSADA: { label: 'Recusada', pill: 'hl-pill--danger' },
  EM_ANDAMENTO: { label: 'Em andamento', pill: 'hl-pill--primary' },
  CONCLUIDA: { label: 'Concluída', pill: 'hl-pill--success' },
  CANCELADA: { label: 'Cancelada', pill: 'hl-pill--secondary' },
};

export const MinhasPropostas = () => {
  const [propostas, setPropostas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAvaliacao, setShowAvaliacao] = useState(false);
  const [propostaAvaliada, setPropostaAvaliada] = useState<any>(null);
  const [estrelas, setEstrelas] = useState(5);
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    carregarPropostas();
  }, []);

  const carregarPropostas = async () => {
    setLoading(true);
    const res = await api.get('/propostas');
    setPropostas(res.data.data);
    setLoading(false);
  };

  const cancelar = async (id: number) => {
    if (confirm('Deseja realmente cancelar?')) {
      await api.patch(`/propostas/${id}/cancelar`);
      carregarPropostas();
    }
  };

  const abrirAvaliacao = (p: any) => {
    setPropostaAvaliada(p);
    setShowAvaliacao(true);
  };

  const salvarAvaliacao = async () => {
    try {
      await api.post('/avaliacoes', {
        proposta_id: propostaAvaliada.id,
        estrelas,
        comentario
      });
      alert('Avaliação registrada com sucesso!');
      setShowAvaliacao(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro');
    }
  };

  return (
    <div className="hl-fade-in">
      <div className="hl-section-title">
        <div>
          <h2>Minhas Solicitações</h2>
          <p>Acompanhe o status das propostas enviadas aos profissionais.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">Carregando...</div>
      ) : (
        <Row>
          {propostas.map(p => {
            const meta = STATUS_META[p.status] || { label: p.status, pill: 'hl-pill--secondary' };
            return (
              <Col md={6} key={p.id} className="mb-4">
                <Card className="border-0 h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom" style={{ borderColor: 'var(--hl-border-soft)' }}>
                    <strong style={{ color: 'var(--hl-pine-900)' }}>{p.servico.titulo}</strong>
                    <span className={`hl-pill ${meta.pill}`}>{meta.label}</span>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-person text-muted" />
                      <span className="small">{p.trabalhador?.nome || 'N/A'}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-tag text-muted" />
                      <span className="small">{p.tipo_proposta === 'PERMUTA' ? 'Permuta' : 'Orçamento padrão'}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-cash-coin text-muted" />
                      <span className="small">R$ {p.valor_oferecido}</span>
                    </div>
                    {p.descricao_permuta && (
                      <p className="small p-2 mb-2" style={{ background: 'var(--hl-surface-alt)', borderRadius: 8 }}>
                        <em>"{p.descricao_permuta}"</em>
                      </p>
                    )}

                    {p.trabalhador?.telefone && (
                      <div className="d-flex align-items-center gap-2 p-2 mt-2" style={{ background: '#e2f3e9', borderRadius: 8, color: '#1f6b41' }}>
                        <i className="bi bi-telephone-fill" />
                        <span className="small fw-semibold">{p.trabalhador.telefone}</span>
                      </div>
                    )}

                    <div className="mt-3 d-flex gap-2">
                      {(p.status === 'PENDENTE' || p.status === 'ACEITA' || p.status === 'EM_ANDAMENTO') && (
                        <Button variant="outline-danger" size="sm" onClick={() => cancelar(p.id)}>Cancelar</Button>
                      )}
                      {p.status === 'CONCLUIDA' && (
                        <Button variant="warning" size="sm" onClick={() => abrirAvaliacao(p)}>
                          <i className="bi bi-star-fill me-1" /> Avaliar Serviço
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
          {propostas.length === 0 && (
            <Col xs={12}>
              <div className="hl-empty-state">
                <i className="bi bi-clipboard d-block" />
                <h5 className="mb-1">Você ainda não enviou propostas</h5>
                <p className="mb-0 small">Busque um serviço perto de você para começar.</p>
              </div>
            </Col>
          )}
        </Row>
      )}

      <Modal show={showAvaliacao} onHide={() => setShowAvaliacao(false)} centered className="hl-modal">
        <Modal.Header closeButton><Modal.Title>Avaliar Profissional</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Estrelas (1 a 5)</Form.Label>
            <Form.Select value={estrelas} onChange={e => setEstrelas(Number(e.target.value))}>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐⭐</option>
              <option value="3">3 ⭐⭐⭐</option>
              <option value="4">4 ⭐⭐⭐⭐</option>
              <option value="5">5 ⭐⭐⭐⭐⭐</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Deixe um comentário</Form.Label>
            <Form.Control as="textarea" rows={3} value={comentario} onChange={e => setComentario(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAvaliacao(false)}>Cancelar</Button>
          <Button variant="primary" onClick={salvarAvaliacao}>Salvar Avaliação</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
