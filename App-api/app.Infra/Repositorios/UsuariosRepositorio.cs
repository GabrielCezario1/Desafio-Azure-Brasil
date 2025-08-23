
using app.Dominio.Usuarios.Entidades;
using app.Dominio.Usuarios.Interfaces;
using app.Infra.Data;
using Microsoft.EntityFrameworkCore;

namespace app.Infra.Repositorios
{
    public class UsuariosRepositorio : IUsuariosRepositorio
    {
        private readonly AppDbContext _context;

        public UsuariosRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario> Inserir(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<Usuario> Editar(Usuario usuario)
        {
            _context.Entry(usuario).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task Excluir(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario != null)
            {
                _context.Usuarios.Remove(usuario);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Usuario> Recuperar(int id)
        {
            return await _context.Usuarios.FindAsync(id);
        }

        public async Task<IEnumerable<Usuario>> Listar()
        {
            return await _context.Usuarios.ToListAsync();
        }
    }
}
