using app.DataTransfer.Usuarios.Requests;
using app.DataTransfer.Usuarios.Responses;
using app.Dominio.Usuarios.Comandos;
using app.Dominio.Usuarios.Entidades;
using AutoMapper;

namespace app.Aplicacao.Usuarios.Mapeamentos
{
    public class UsuariosPerfilMapeamento : Profile
    {
        public UsuariosPerfilMapeamento()
        {
            CreateMap<UsuariosInserirRequest, UsuariosInserirComando>();
            CreateMap<UsuariosEditarRequest, UsuariosEditarComando>();
            CreateMap<Usuario, UsuariosResponse>();
        }
    }
}
