import { supabase } from '../supabase/client.js'; // Importa o cliente Supabase configurado
import argon2 from 'argon2';

class User {
    constructor({ email, tokens, senha, nome, telefone, niveldeconcientizacao, ismonitor, fotoUsuario, endereco }) {
        this.email = email;
        this.tokens = tokens;
        this.senha = senha;
        this.nome = nome;
        this.telefone = telefone;
        this.niveldeconcientizacao = niveldeconcientizacao;
        this.ismonitor = ismonitor;
        this.fotoUsuario = fotoUsuario;
        this.endereco = endereco;
    }

    validate() {
        const errors = [];

        if (!this.nome || this.nome.length < 3 || this.nome.length > 51) {
            errors.push('Nome deve ter entre 3 e 51 caracteres.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            errors.push('Email inválido.');
        }

        if (typeof this.tokens !== 'string') {
            errors.push('Token inválido.');
        }

        const telefoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!this.telefone || !telefoneRegex.test(this.telefone)) {
            errors.push('Número de telefone inválido.');
        }

        if (!this.senha || this.senha.length < 6 || this.senha.length > 255) {
            errors.push('A senha precisa ter entre 6 e 255 caracteres.'); // Corrigido para 255
        }

        if (this.niveldeconcientizacao < 0 || this.niveldeconcientizacao > 5) {
            errors.push('Nível de conscientização deve ser um número entre 0 e 5.');
        }

        if (errors.length > 0) {
            return { valid: false, errors };
        }

        return { valid: true };
    }

    async save() {
        const password_hash = await argon2.hash(this.senha);

        const { data, error } = await supabase
            .from('usuarios')
            .insert([
                {
                    email: this.email,
                    tokens: this.tokens,
                    senha: password_hash,
                    nome: this.nome,
                    telefone: this.telefone,
                    niveldeconcientizacao: this.niveldeconcientizacao,
                    ismonitor: this.ismonitor,
                    fotoUsuario: this.fotoUsuario, // Novo campo
                    endereco: this.endereco // Novo campo
                },
            ])
            .select();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async passwordIsValid(password) {
        const { data: user, error } = await supabase
            .from('usuarios') // Mudança para 'usuarios' em vez de 'users'
            .select('senha')
            .eq('email', this.email)
            .single();

        if (error || !user) {
            throw new Error('Usuário não encontrado ou erro ao buscar.');
        }

        return argon2.verify(user.senha, password); // Mudança para 'senha'
    }
}

export default User;
