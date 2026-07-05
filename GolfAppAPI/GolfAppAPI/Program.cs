using Scalar.AspNetCore;
using GolfAppAPI.Models;
using Microsoft.EntityFrameworkCore;
using GolfAppAPI.DAL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient();
builder.Services.AddDbContext<GolfAppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection"))
);

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<ICourseHoleRepository, CourseHoleRepository>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
