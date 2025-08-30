// ================================================================
// DESAFIO AZURE BRASIL - CONFIGURAÇÃO PRINCIPAL DA WEB API
// REQUISITO VAGA: Implementa autenticação com Azure Entra ID
// ================================================================

using Microsoft.AspNetCore.Authentication.JwtBearer;
using app.Ioc;
using Microsoft.OpenApi.Models;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

// ================================================================
// CONFIGURAÇÃO DE LOGGING
// ================================================================
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

// ================================================================
// REQUISITO VAGA: AUTENTICAÇÃO AZURE ENTRA ID
// Configura JWT Bearer authentication usando Microsoft Identity Web
// ================================================================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

// ================================================================
// CONFIGURAÇÃO AVANÇADA DE JWT - EVENTOS DE DIAGNÓSTICO
// Monitora autenticação para debug e troubleshooting
// ================================================================
builder.Services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.Events = new JwtBearerEvents
    {
        // Evento disparado quando autenticação falha
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"❌ JWT Authentication Failed: {context.Exception?.Message}");
            Console.WriteLine($"❌ JWT Exception Details: {context.Exception}");
            return Task.CompletedTask;
        },
        // Evento disparado quando token é validado com sucesso
        OnTokenValidated = context =>
        {
            Console.WriteLine("✅ JWT Token Validated Successfully");
            Console.WriteLine($"✅ User: {context.Principal?.Identity?.Name}");
            Console.WriteLine($"✅ Claims Count: {context.Principal?.Claims?.Count()}");
            return Task.CompletedTask;
        },
        // Evento disparado quando mensagem com token é recebida
        OnMessageReceived = context =>
        {
            Console.WriteLine($"🔍 JWT Message Received: Token present = {!string.IsNullOrEmpty(context.Request.Headers["Authorization"])}");
            return Task.CompletedTask;
        }
    };
});

// ================================================================
// CONFIGURAÇÃO DE SERVIÇOS DA APLICAÇÃO
// ================================================================
var azureAdConfig = builder.Configuration.GetSection("AzureAd");
builder.Services.AddInfraestrutura(builder.Configuration);  // Injeção de dependências customizada
builder.Services.AddControllers();                           // Controllers da Web API
builder.Services.AddEndpointsApiExplorer();                  // Para Swagger/OpenAPI

// ================================================================
// CONFIGURAÇÃO SWAGGER COM AUTENTICAÇÃO BEARER
// Permite testar endpoints autenticados via interface Swagger
// ================================================================
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Desafio Azure Brasil API", Version = "v1" });

    // Configura autenticação Bearer Token no Swagger
    c.AddSecurityDefinition("Bearer", new()
    {
        Description = "Informe o token JWT no formato: Bearer {seu token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // Aplica autenticação a todos os endpoints
    c.AddSecurityRequirement(new()
    {
        {
            new() { Reference = new() { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            new List<string>()
        }
    });
});

// ================================================================
// CONFIGURAÇÃO CORS - PERMITE ACESSO DO FRONTEND ANGULAR
// Necessário para comunicação entre SPA (Angular) e Web API
// ================================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// ================================================================
// BUILD DA APLICAÇÃO
// ================================================================
var app = builder.Build();

// ================================================================
// CONFIGURAÇÃO DO PIPELINE DE MIDDLEWARE
// ORDEM É IMPORTANTE: Swagger → CORS → HTTPS → Auth → Authorization → Controllers
// ================================================================

// Habilita Swagger apenas em desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");        // CORS deve vir antes de autenticação
app.UseHttpsRedirection();      // Força HTTPS  
app.UseAuthentication();        // REQUISITO VAGA: Middleware de autenticação Azure AD
app.UseAuthorization();         // Middleware de autorização (após autenticação)
app.MapControllers();           // Mapeia controllers da API

app.Run();

