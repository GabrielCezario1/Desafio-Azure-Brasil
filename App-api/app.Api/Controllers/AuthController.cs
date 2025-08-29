using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace app.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        public AuthController() {}
        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
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
        /// Endpoint de diagnóstico para verificar o que está chegando na API
        /// NÃO requer autenticação para diagnóstico
        /// </summary>
        [HttpGet("debug/headers")]
        [AllowAnonymous]
        public IActionResult DebugHeaders()
        {
            try
            {
                var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
                var allHeaders = HttpContext.Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());
                
                var userClaims = HttpContext.User?.Claims?.Select(c => new { c.Type, c.Value }).ToList();
                
                return Ok(new
                {
                    hasAuthorizationHeader = !string.IsNullOrEmpty(authHeader),
                    authorizationHeader = authHeader?.Substring(0, Math.Min(50, authHeader?.Length ?? 0)) + "...",
                    allHeaders = allHeaders,
                    userIsAuthenticated = HttpContext.User?.Identity?.IsAuthenticated ?? false,
                    userClaims = userClaims,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new 
                { 
                    message = "Erro no diagnóstico", 
                    error = ex.Message,
                    timestamp = DateTime.UtcNow 
                });
            }
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
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                
                if (identity == null || !identity.IsAuthenticated)
                {
                    return Unauthorized(new { message = "Usuário não autenticado" });
                }

                var claims = identity.Claims.ToDictionary(c => c.Type, c => c.Value);
                
                var userInfo = new
                {
                    isAuthenticated = true,
                    username = identity.Name,
                    authType = identity.AuthenticationType,
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

        /// <summary>
        /// Endpoint de diagnóstico avançado que tenta autorização e captura erros
        /// </summary>
        [HttpGet("debug/auth-test")]
        public IActionResult DebugAuthTest()
        {
            try
            {
                var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
                var allHeaders = HttpContext.Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());
                
                var userIdentity = HttpContext.User?.Identity;
                var userClaims = HttpContext.User?.Claims?.Select(c => new { c.Type, c.Value }).ToList();
                
                var response = new
                {
                    hasAuthorizationHeader = !string.IsNullOrEmpty(authHeader),
                    authorizationHeader = authHeader?.Substring(0, Math.Min(50, authHeader?.Length ?? 0)) + "...",
                    userIsAuthenticated = userIdentity?.IsAuthenticated ?? false,
                    userAuthenticationType = userIdentity?.AuthenticationType,
                    userName = userIdentity?.Name,
                    userClaims = userClaims,
                    claimsCount = userClaims?.Count ?? 0,
                    timestamp = DateTime.UtcNow,
                    
                    tokenDiagnostics = new
                    {
                        audience = userClaims?.FirstOrDefault(c => c.Type == "aud")?.Value,
                        issuer = userClaims?.FirstOrDefault(c => c.Type == "iss")?.Value,
                        scope = userClaims?.FirstOrDefault(c => c.Type == "scp")?.Value,
                        clientId = userClaims?.FirstOrDefault(c => c.Type == "azp")?.Value,
                        hasRequiredScope = userClaims?.Any(c => c.Type == "scp" && c.Value.Contains("access_as_user")) ?? false
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new 
                { 
                    message = "Erro no diagnóstico avançado", 
                    error = ex.Message,
                    timestamp = DateTime.UtcNow 
                });
            }
        }
    }
}
