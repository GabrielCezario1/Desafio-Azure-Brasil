
using System;
using System.Linq;

namespace app.Dominio.Usuarios.Entidades
{
    public class Usuario
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Email { get; set; }
        public string? Senha { get; set; }
        public DateTime DataCriacao { get; private set; }
        public Usuario(string? nome, string? email, string? senha)
        {
            SetNome(nome);
            SetEmail(email);
            SetSenha(senha);
            DataCriacao = DateTime.Now;
        }
        public Usuario() {}

        public virtual void SetNome(string? nome)
        {
            if (string.IsNullOrWhiteSpace(nome) || nome.Length < 3)
            {
                throw new ArgumentException("Nome inválido. Deve ter pelo menos 3 caracteres.");
            }
            Nome = nome;
        }


        public virtual void SetEmail(string? email)
        {
            if (email == null || !email.Contains("@"))
            {
                throw new ArgumentException("Email inválido.");
            }
            Email = email;
        }


        public virtual void SetSenha(string? senha)
        {
            if (string.IsNullOrWhiteSpace(senha) || senha.Length < 6)
            {
                throw new ArgumentException("Senha inválida. Deve ter pelo menos 6 caracteres.");
            }
            Senha = senha;
        }
    }
}
