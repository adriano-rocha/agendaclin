interface ModalConfirmacaoProps {
  titulo: string;
  mensagem: string;
  erro?: string | null;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ModalConfirmacao({
  titulo,
  mensagem,
  erro,
  onConfirmar,
  onCancelar,
}: ModalConfirmacaoProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
        <p className="mt-2 text-sm text-gray-600">{mensagem}</p>

        {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Voltar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}