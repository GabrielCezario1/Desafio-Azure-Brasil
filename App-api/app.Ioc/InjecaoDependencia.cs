using app.Aplicacao.Usuarios.Mapeamentos;
using app.Aplicacao.Usuarios.Servicos;
using app.Aplicacao.Usuarios.Servicos.Interfaces;
using app.Dominio.Usuarios.Interfaces;
using app.Dominio.Usuarios.Servicos;
using app.Infra.Data;
using app.Infra.Repositorios;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace app.Ioc
{
    public static class InjecaoDependencia
    {
        public static IServiceCollection AddInfraestrutura(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            services.AddScoped<IUsuariosRepositorio, UsuariosRepositorio>();
            services.AddScoped<IUsuariosServico, UsuariosServico>();
            services.AddScoped<IUsuariosAppServico, UsuariosAppServico>();

            services.AddAutoMapper(typeof(UsuariosPerfilMapeamento));

            return services;
        }
    }
}
