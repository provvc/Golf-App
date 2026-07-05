using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GolfAppAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    courseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    latitude = table.Column<float>(type: "real", nullable: false),
                    longitude = table.Column<float>(type: "real", nullable: false),
                    city = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    state = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    country = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.courseId);
                });

            migrationBuilder.CreateTable(
                name: "CourseHoles",
                columns: table => new
                {
                    courseHoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    courseHoleNumber = table.Column<int>(type: "int", nullable: false),
                    par = table.Column<int>(type: "int", nullable: false),
                    teeLatitude = table.Column<float>(type: "real", nullable: false),
                    teeLongitude = table.Column<float>(type: "real", nullable: false),
                    greenLatitude = table.Column<float>(type: "real", nullable: false),
                    greenLongitude = table.Column<float>(type: "real", nullable: false),
                    courseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseHoles", x => x.courseHoleId);
                    table.ForeignKey(
                        name: "FK_CourseHoles_Courses_courseId",
                        column: x => x.courseId,
                        principalTable: "Courses",
                        principalColumn: "courseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseHoles_courseId",
                table: "CourseHoles",
                column: "courseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseHoles");

            migrationBuilder.DropTable(
                name: "Courses");
        }
    }
}
