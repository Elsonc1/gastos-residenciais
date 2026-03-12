using GastosResidenciais.API.Data;
using GastosResidenciais.API.Middlewares;
using GastosResidenciais.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers ───────────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Serializa enums como strings legíveis em vez de inteiros
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// ── Swagger / OpenAPI ─────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Gastos Residenciais API",
        Version = "v1",
        Description = "API de controle de gastos residenciais: pessoas, categorias, transações e relatórios."
    });
});

// ── Banco de Dados (SQLite) ───────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=gastos_residenciais.db"
    ));

// ── Serviços de Domínio (Injeção de Dependência) ──────────────────────────────
builder.Services.AddScoped<IPessoaService, PessoaService>();
builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<ITransacaoService, TransacaoService>();
builder.Services.AddScoped<IRelatorioService, RelatorioService>();

// ── CORS ─────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// ── Criação automática do banco de dados ─────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// ── Pipeline HTTP ─────────────────────────────────────────────────────────────
// Middleware de exceções deve ser o primeiro para capturar erros de qualquer camada
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Gastos Residenciais API v1");
    });
}

app.UseCors("FrontendPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
