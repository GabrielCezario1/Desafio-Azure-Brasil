using app.Aplicacao.Usuarios.Servicos.Interfaces;
using app.DataTransfer.Usuarios.Requests;
using app.DataTransfer.Usuarios.Responses;
using app.Dominio.Usuarios.Comandos;
using app.Dominio.Usuarios.Interfaces;
using AutoMapper;

namespace app.Aplicacao.Usuarios.Servicos
{
    public class UsuariosAppServico : IUsuariosAppServico
    {
        private readonly IUsuariosServico usuariosServico;
        private readonly IUsuariosRepositorio usuariosRepositorio;
        private readonly IMapper mapper;
        public UsuariosAppServico(IMapper mapper, IUsuariosServico usuariosServico, IUsuariosRepositorio usuariosRepositorio)
        {
            this.mapper = mapper;
            this.usuariosServico = usuariosServico;
            this.usuariosRepositorio = usuariosRepositorio;

        }

        public async Task<UsuariosResponse> Inserir(UsuariosInserirRequest request)
        {
            var comando = mapper.Map<UsuariosInserirComando>(request);
            var usuario = await usuariosServico.Inserir(comando);

            return mapper.Map<UsuariosResponse>(usuario);
        }

        public async Task<UsuariosResponse> Editar(UsuariosEditarRequest request)
        {
            var comando = mapper.Map<UsuariosEditarComando>(request);
            var usuario = await usuariosServico.Editar(comando);

            return mapper.Map<UsuariosResponse>(usuario);
        }

        public async Task Excluir(int id)
        {
            await usuariosServico.Excluir(id);
        }

        public async Task<UsuariosResponse> Recuperar(int id)
        {
            var usuario = await usuariosServico.Validar(id);
            return mapper.Map<UsuariosResponse>(usuario);
        }

        public async Task<IEnumerable<UsuariosResponse>> Listar()
        {
            var listaUsuarios = await usuariosRepositorio.Listar();
            return mapper.Map<IEnumerable<UsuariosResponse>>(listaUsuarios);
        }
    }
}
