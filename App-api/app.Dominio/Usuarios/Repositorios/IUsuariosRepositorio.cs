
using app.Dominio.Usuarios.Entidades;

namespace app.Dominio.Usuarios.Interfaces
{
    public interface IUsuariosRepositorio
    {
        Task<Usuario> Inserir(Usuario usuario);
        Task<Usuario> Editar(Usuario usuario);
        Task Excluir(int id);
        Task<Usuario> Recuperar(int id);
        Task<IEnumerable<Usuario>> Listar();
    }
}
