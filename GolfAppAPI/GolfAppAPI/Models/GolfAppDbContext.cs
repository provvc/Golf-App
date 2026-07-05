using Microsoft.EntityFrameworkCore;

namespace GolfAppAPI.Models {
    public class GolfAppDbContext : DbContext {
        public GolfAppDbContext(DbContextOptions<GolfAppDbContext> options) : base(options) { }

        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseHole> CourseHoles { get; set; }
        public DbSet<CourseHoleCoordinate> CourseHoleCoordinate { get; set; }
        public DbSet<CoordinateType> CoordinateType { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {

            modelBuilder.Entity<CoordinateType>().HasData(
                new CoordinateType { coordinateTypeId = 1, description = "Tee" },
                new CoordinateType { coordinateTypeId = 2, description = "Green" },
                new CoordinateType { coordinateTypeId = 3, description = "Line" }
            );

        }
    }
}
