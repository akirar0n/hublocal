import { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { api } from '../services/api';

interface AvaliacoesModalProps {
  trabalhadorId: number | null;
  show: boolean;
  onHide: () => void;
}

export const AvaliacoesModal = ({ trabalhadorId, show, onHide }: AvaliacoesModalProps) => {
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [media, setMedia] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && trabalhadorId) {
      carregarAvaliacoes(trabalhadorId);
    } else {
      setAvaliacoes([]);
      setMedia(null);
    }
  }, [show, trabalhadorId]);

  const carregarAvaliacoes = async (id: number) => {
    setLoading(true);
    try {
      const [resMedia, resAvaliacoes] = await Promise.all([
        api.get(`/avaliacoes/trabalhador/${id}/media`),
        api.get(`/avaliacoes/trabalhador/${id}`)
      ]);
      
      setMedia(resMedia.data.data?.media || null);
      setAvaliacoes(resAvaliacoes.data.data || []);
    } catch (err) {
      console.error('Erro ao buscar avaliações:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (nota: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i 
        key={i} 
        className={`bi ${i < nota ? 'bi-star-fill' : 'bi-star'} me-1`} 
        style={{ color: 'var(--hl-marigold-600)' }} 
      />
    ));
  };

  return (
    <Modal show={show} onHide={onHide} centered className="hl-modal" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Avaliações do Profissional</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted small">Carregando avaliações...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-4 p-3" style={{ background: 'var(--hl-surface-alt)', borderRadius: 'var(--hl-radius-sm)' }}>
              <h1 className="display-4 mb-0 fw-bold" style={{ color: 'var(--hl-pine-900)' }}>
                {media !== null ? media.toFixed(1) : '-'}
              </h1>
              <div className="mb-1">
                {renderStars(media ? Math.round(media) : 0)}
              </div>
              <p className="text-muted small mb-0">
                {avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'}
              </p>
            </div>

            {avaliacoes.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-chat-square-text d-block fs-3 mb-2" />
                Nenhuma avaliação recebida ainda.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {avaliacoes.map((av) => (
                  <div key={av.id} className="p-3 bg-white" style={{ border: '1px solid var(--hl-border-soft)', borderRadius: 'var(--hl-radius-sm)' }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <strong style={{ color: 'var(--hl-pine-900)' }}>{av.proposta.cliente.nome}</strong>
                      <div className="small">
                        {renderStars(av.nota)}
                      </div>
                    </div>
                    <p className="mb-1 small">{av.comentario}</p>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {new Date(av.data_avaliacao).toLocaleDateString('pt-BR')}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
