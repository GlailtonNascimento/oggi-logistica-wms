import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/db.js';

const AuditoriaBloqueio = sequelize.define(
    'AuditoriaBloqueio',
    {
        palletId: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Identificador único do pallet'
        },

        // 📍 Onde a regra se aplica
        localOperacao: {
            type: DataTypes.ENUM('FABRICA', 'FILIAL'),
            allowNull: false,
            comment: 'Define se o bloqueio ocorre na fábrica ou filial'
        },

        // 🔗 Módulo que originou o bloqueio / alerta
        moduloOrigem: {
            type: DataTypes.ENUM(
                'RECEBIMENTO',
                'ARMAZENAGEM',
                'FRIOZEM',
                'EXPEDICAO',
                'QUALIDADE'
            ),
            allowNull: false
        },

        // 🚫 Tipo do bloqueio ou alerta
        tipoBloqueio: {
            type: DataTypes.ENUM(
                'MATURACAO_AUTOMATICA',   // Apenas FÁBRICA
                'BLOQUEIO_QUALIDADE',    // Qualidade manual
                'ALERTA_LOTE',           // Filial (não trava, apenas alerta)
                'AVARIA',
                'AMOSTRAGEM'
            ),
            allowNull: false
        },

        // 🔒 Status do bloqueio
        status: {
            type: DataTypes.ENUM('ATIVO', 'LIBERADO'),
            defaultValue: 'ATIVO'
        },

        // 🕒 Datas de controle
        dataInicio: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

        dataFimPrevista: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Usado para maturação automática (ex: +48h)'
        },

        dataLiberacao: {
            type: DataTypes.DATE,
            allowNull: true
        },

        // 👤 Responsáveis
        criadoPor: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Sistema ou usuário que criou o bloqueio'
        },

        liberadoPor: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Analista / Qualidade que liberou'
        },

        // 📄 Documentação obrigatória quando manual
        documentoLiberacao: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Laudo, e-mail, número de autorização'
        },

        // 📝 Justificativas
        motivo: {
            type: DataTypes.STRING,
            allowNull: true
        },

        observacoes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: 'auditoria_bloqueios',
        timestamps: true
    }
);

export default AuditoriaBloqueio;

