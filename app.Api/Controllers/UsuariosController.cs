using app.Aplicacao.Usuarios.Servicos.Interfaces;
using app.DataTransfer.Usuarios.Requests;
using app.DataTransfer.Usuarios.Responses;
using Microsoft.AspNetCore.Mvc;

namespace app.Api.Controllers;

[Route("api/usuarios")]
[ApiController]
public class UsuariosController : ControllerBase
{
    private readonly IUsuariosAppServico usuariosAppServico;

    public UsuariosController(IUsuariosAppServico usuariosAppServico)
    {
        this.usuariosAppServico = usuariosAppServico;
    }

    /// <summary>
    /// Adiciona um novo usuário ao sistema.
    /// </summary>
    /// <param name="request">Dados do usuário a ser inserido.</param>
    /// <returns>Dados do usuário criado.</returns>
    [HttpPost]
    public async Task<ActionResult<UsuariosResponse>> Inserir([FromBody] UsuariosInserirRequest request)
    {
        UsuariosResponse usuario = await usuariosAppServico.Inserir(request);

        return Ok(usuario);
    }

    /// <summary>
    /// Listar usuarios
    /// </summary>
    /// <returns>Dados dos usuários listados.</returns>
    [HttpGet]
    public async Task<ActionResult<IList<UsuariosResponse>>> Listar()
    {
        var usuario = await usuariosAppServico.Listar();

        return Ok(usuario);
    }

    /// <summary>
    /// Listar usuarios
    /// </summary>
    /// <param name="id">Id do usuario a ser recuperado </param>
    /// <returns>Dados dos usuários listados.</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<UsuariosResponse>> Recuperar(int id)
    {
        var usuario = await usuariosAppServico.Recuperar(id);

        return Ok(usuario);
    }

    /// <summary>
    /// Editar usuario
    /// </summary>
    /// <param name="request">Edita propriedades do usuário</param>
    /// <returns>Dados do usuário atualizado.</returns>
    [HttpPut]
    public async Task<ActionResult<UsuariosResponse>> Editar([FromQuery] UsuariosEditarRequest request)
    {
        UsuariosResponse usuario = await usuariosAppServico.Editar(request);

        return Ok(usuario);
    }

    /// <summary>
    /// Editar usuario
    /// </summary>
    /// <param name="id">Id do usuario a ser excluido </param>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        await usuariosAppServico.Excluir(id);
        return NoContent();
    }
}