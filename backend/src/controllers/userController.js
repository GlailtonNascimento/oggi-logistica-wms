import User from "../models/User.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta";

export const createUser = async (req, res) => {
    try {
        const { login, password, perfil, pode_ajustar_saldo } = req.body;

        const newUser = await User.create({
            login,
            password,
            perfil,
            pode_ajustar_saldo
        });

        return res.status(201).json({
            message: "Usuário criado com sucesso!",
            user: { id: newUser.id, login: newUser.login, perfil: newUser.perfil }
        });

    } catch (error) {
        console.error("Erro ao criar usuário:", error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: "Login já existe." });
        }

        return res.status(500).json({ error: "Erro interno ao criar usuário." });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { login, password } = req.body;

        const user = await User.findOne({ where: { login } });

        if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        const token = jwt.sign(
            { id: user.id, perfil: user.perfil },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login bem-sucedido!",
            token,
            perfil: user.perfil
        });

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ error: "Erro interno no login." });
    }
};
