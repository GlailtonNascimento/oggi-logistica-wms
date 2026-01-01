// Este arquivo serve como um index para re-exportar todos os Models do módulo recebimento.

import Recebimento from './recebimentoModel.js';
import RegistroTurno from './RegistroTurno.js';
import PalletRegistro from './PalletRegistro.js';
import FotoRegistro from './FotoRegistro.js';

// Re-exporta todos os models para fácil acesso.
export {
    Recebimento,
    RegistroTurno,
    PalletRegistro,
    FotoRegistro
};