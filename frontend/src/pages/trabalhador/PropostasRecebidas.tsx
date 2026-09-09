import { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { api } from '../../services/api';

const STATUS_META: Record<string, { label: string; pill: string }> = {
  PENDENTE: { label: 'Pendente', pill: 'hl-pill--warning' },
  ACEITA: { label: 'Aceita', pill: 'hl-pill--info' },
  RECUSADA: { label: 'Recusada', pill: 'hl-pill--danger' },
  EM_ANDAMENTO: { label: 'Em andamento', pill: 'hl-pill--primary' },
  CONCLUIDA: { label: 'Concluída', pill: 'hl-pill--success' },
  CANCELADA: { label: 'Cancelada', pill: 'hl-pill--secondary' },
};

export const PropostasRecebidas = () => {
  const [propostas, setPropostas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPropostas();
  }, []);

  const carregarPropostas = async () => {
    setLoading(true);
    const res = await api.get('/propostas');
    setPropostas(res.data.data);
    setLoading(false);
  };

  const alterarStatus = async (id: number, acao: string) => {
    try {
      await api.patch(`/propostas/${id}/${acao}`);
      carregarPropostas();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar');
    }
  };

  return (
    <div className="hl-fade-in">
      <div className="hl-section-title">
        <div>
          <h2>Propostas Recebidas</h2>
          <p>Solicitações de clientes para os seus serviços publicados.</p>
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
                <Card
                  className="border-0 h-100"
                  style={{ borderLeft: '4px solid var(--hl-pine-700)', borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
                >
                  <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom" style={{ borderColor: 'var(--hl-border-soft)' }}>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-person-circle text-muted" />
                      <strong style={{ color: 'var(--hl-pine-900)' }}>{p.cliente?.nome}</strong>
                    </div>
                    <span className={`hl-pill ${meta.pill}`}>{meta.label}</span>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-2 small"><strong>Serviço:</strong> {p.servico.titulo}</p>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="hl-pill hl-pill--primary">{p.tipo_proposta === 'PERMUTA' ? 'Permuta' : 'Padrão'}</span>
                      {p.valor_oferecido && <span className="hl-pill hl-pill--success">R$ {p.valor_oferecido}</span>}
                    </div>
                    {p.descricao_permuta && (
                      <p className="small p-2 mb-2" style={{ background: 'var(--hl-surface-alt)', borderRadius: 8 }}>
                        <em>"{p.descricao_permuta}"</em>
                      </p>
                    )}

                    {p.cliente?.telefone && (
                      <div className="d-flex align-items-center gap-2 p-2 mt-2 mb-2" style={{ background: '#e2f3e9', borderRadius: 8, color: '#1f6b41' }}>
                        <i className="bi bi-telephone-fill" />
                        <span className="small fw-semibold">{p.cliente.telefone}</span>
                      </div>
                    )}

                    <div className="mt-3 d-flex flex-wrap gap-2">
                      {p.status === 'PENDENTE' && (
                        <>
                          <Button variant="primary" size="sm" onClick={() => alterarStatus(p.id, 'aceitar')}>
                            <i className="bi bi-check-lg me-1" />Aceitar
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => alterarStatus(p.id, 'recusar')}>Recusar</Button>
                        </>
                      )}
                      {p.status === 'ACEITA' && (
                        <Button variant="primary" size="sm" onClick={() => alterarStatus(p.id, 'iniciar')}>
                          <i className="bi bi-play-fill me-1" />Iniciar Serviço
                        </Button>
                      )}
                      {p.status === 'EM_ANDAMENTO' && (
                        <Button variant="primary" size="sm" onClick={() => alterarStatus(p.id, 'concluir')}>
                          <i className="bi bi-check2-circle me-1" />Marcar como Concluído
                        </Button>
                      )}
                      {(p.status === 'ACEITA' || p.status === 'EM_ANDAMENTO') && (
                        <Button variant="outline-danger" size="sm" onClick={() => alterarStatus(p.id, 'cancelar')}>Cancelar</Button>
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
                <i className="bi bi-inbox d-block" />
                <h5 className="mb-1">Nenhuma proposta recebida ainda</h5>
                <p className="mb-0 small">Publique serviços no seu portfólio para começar a receber solicitações.</p>
              </div>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};
