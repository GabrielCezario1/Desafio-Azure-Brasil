using app.Dominio.Usuarios.Comandos;
using app.Dominio.Usuarios.Entidades;

namespace app.Dominio.Usuarios.Interfaces
{
    public interface IUsuariosServico
    {
        Task<Usuario> Inserir(UsuariosInserirComando comando);
        Task<Usuario> Editar(UsuariosEditarComando Comando);
        Task Excluir(int id);
        Task<Usuario> Validar(int id);
    }
}
