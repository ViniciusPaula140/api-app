class FotoReceita {
    constructor(fotoReceita) {
        this.idFoto = fotoReceita.idFoto;
        this.id = fotoReceita.id; // id da receita
        this.url = fotoReceita.url;
        this.createdAt = fotoReceita.createdAt || new Date().toISOString();
    }

    validate() {
        const errors = [];

        if (!this.id) {
            errors.push("ID da receita é obrigatório.");
        }

        if (!this.url) {
            errors.push("URL da foto é obrigatória.");
        } else if (typeof this.url !== 'string') {
            errors.push("URL deve ser uma string válida.");
        } else if (!this.isValidUrl(this.url)) {
            errors.push("URL fornecida não é válida.");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Método auxiliar para validar URLs
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default FotoReceita;