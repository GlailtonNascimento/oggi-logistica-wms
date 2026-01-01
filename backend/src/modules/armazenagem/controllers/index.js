// Este arquivo serve como um index ou unificador para todos os controllers do módulo Armazenagem.

import alocacaoController from './alocacaoController.js';

// Re-exporta o controller usando o nome padronizado.
export {
    alocacaoController
};

// Exportação padrão para maior compatibilidade
export default alocacaoController;