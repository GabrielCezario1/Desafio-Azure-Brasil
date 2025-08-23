using System.ComponentModel.DataAnnotations;
using app.Dominio.Usuarios.Comandos;
using app.Dominio.Usuarios.Entidades;
using app.Dominio.Usuarios.Interfaces;

namespace app.Dominio.Usuarios.Servicos;

public class UsuariosServico : IUsuariosServico
{
    private readonly IUsuariosRepositorio usuariosRepositorio;

    public UsuariosServico(IUsuariosRepositorio usuariosRepositorio)
    {
        this.usuariosRepositorio = usuariosRepositorio;
    }

    public async Task<Usuario> Editar(UsuariosEditarComando comando)
    {
        var usuario = await Validar(comando.Id);
        usuario.SetNome(comando.Nome);
        usuario.SetEmail(comando.Email);
        return await usuariosRepositorio.Editar(usuario);
    }

    public async Task Excluir(int id)
    {
        await Validar(id);

        await usuariosRepositorio.Excluir(id);
    }
    
    public async Task<Usuario> Validar(int id)
    {
        return await usuariosRepositorio.Recuperar(id) ??
        throw new ValidationException("Usuário não encontrado.");
    }

    public async Task<Usuario> Inserir(UsuariosInserirComando comando)
    {
        Usuario usuario = new(comando.Nome, comando.Email, comando.Senha);

        return await usuariosRepositorio.Inserir(usuario);
    }
}
