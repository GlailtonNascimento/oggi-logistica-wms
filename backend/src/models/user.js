import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

// Modelo de Usuário
const User = sequelize.define("User", {
    login: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },

    name: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },

    perfil: { type: DataTypes.STRING, allowNull: true },

    pode_ajustar_saldo: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    timestamps: true,
    tableName: "users"     // 🔥 FIXA O NOME DA TABELA
});

// 🔥 Hash da senha antes de criar
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

// 🔥 Hash da senha antes de atualizar
User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

// 🔥 Função para comparar senhas
User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default User;


