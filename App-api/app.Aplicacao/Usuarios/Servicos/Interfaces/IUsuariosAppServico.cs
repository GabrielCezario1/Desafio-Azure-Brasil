using app.DataTransfer.Usuarios.Requests;
using app.DataTransfer.Usuarios.Responses;
using app.Dominio.Usuarios.Entidades;

namespace app.Aplicacao.Usuarios.Servicos.Interfaces;

public interface IUsuariosAppServico
{
    Task<UsuariosResponse> Inserir(UsuariosInserirRequest request);
    Task<UsuariosResponse> Editar(UsuariosEditarRequest request);
    Task Excluir(int id);
    Task<UsuariosResponse> Recuperar(int id);
    Task<IEnumerable<UsuariosResponse>> Listar();
}
