using Microsoft.AspNetCore.Authentication.JwtBearer;
using app.Ioc;
using Microsoft.OpenApi.Models;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);


builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

builder.Services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"❌ JWT Authentication Failed: {context.Exception?.Message}");
            Console.WriteLine($"❌ JWT Exception Details: {context.Exception}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("✅ JWT Token Validated Successfully");
            Console.WriteLine($"✅ User: {context.Principal?.Identity?.Name}");
            Console.WriteLine($"✅ Claims Count: {context.Principal?.Claims?.Count()}");
            return Task.CompletedTask;
        },
        OnMessageReceived = context =>
        {
            Console.WriteLine($"🔍 JWT Message Received: Token present = {!string.IsNullOrEmpty(context.Request.Headers["Authorization"])}");
            return Task.CompletedTask;
        }
    };
});

var azureAdConfig = builder.Configuration.GetSection("AzureAd");
builder.Services.AddInfraestrutura(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Sua API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new()
    {
        Description = "Informe o token JWT no formato: Bearer {seu token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new()
    {
        {
            new() { Reference = new() { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            new List<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();  
app.UseAuthentication();    
app.UseAuthorization();     
app.MapControllers();

app.Run();

