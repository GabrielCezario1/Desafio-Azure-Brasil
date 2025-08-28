using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace app.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Validação simples: substitua por consulta ao banco de dados
            if (request.Username == "admin" && request.Password == "senha123")
            {
                var token = GerarToken(request.Username);
                return Ok(new { token });
            }
            return Unauthorized();
        }

        /// <summary>
        /// Endpoint público para teste de conectividade
        /// Não requer autenticação
        /// </summary>
        [HttpGet("public")]
        [AllowAnonymous]
        public IActionResult PublicEndpoint()
        {
            return Ok(new
            {
                message = "API está funcionando! Endpoint público acessível.",
                timestamp = DateTime.UtcNow,
                status = "healthy",
                version = "1.0.0"
            });
        }

        /// <summary>
        /// Endpoint para obter informações do usuário autenticado
        /// Requer autenticação (token JWT ou Azure AD)
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetUserInfo()
        {
            try
            {
                // Obter informações do usuário autenticado dos claims
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                
                if (identity == null || !identity.IsAuthenticated)
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                // Extrair claims relevantes
                var claims = identity.Claims.ToDictionary(c => c.Type, c => c.Value);
                
                var userInfo = new
                {
                    isAuthenticated = true,
                    username = identity.Name,
                    authType = identity.AuthenticationType,
                    claims = claims,
                    roles = identity.Claims
                        .Where(c => c.Type == ClaimTypes.Role)
                        .Select(c => c.Value)
                        .ToArray(),
                    timestamp = DateTime.UtcNow,
                    tokenInfo = new
                    {
                        issuer = claims.ContainsKey("iss") ? claims["iss"] : "N/A",
                        audience = claims.ContainsKey("aud") ? claims["aud"] : "N/A",
                        expiration = claims.ContainsKey("exp") ? claims["exp"] : "N/A"
                    }
                };

                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new 
                { 
                    message = "Erro interno do servidor", 
                    error = ex.Message,
                    timestamp = DateTime.UtcNow 
                });
            }
        }

        private string GerarToken(string username)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username)
            };

            var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key não configurado");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
