using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GolfAppAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddHoleCoordinatesSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "greenLatitude",
                table: "CourseHoles");

            migrationBuilder.DropColumn(
                name: "greenLongitude",
                table: "CourseHoles");

            migrationBuilder.DropColumn(
                name: "teeLatitude",
                table: "CourseHoles");

            migrationBuilder.DropColumn(
                name: "teeLongitude",
                table: "CourseHoles");

            migrationBuilder.CreateTable(
                name: "CoordinateType",
                columns: table => new
                {
                    coordinateTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoordinateType", x => x.coordinateTypeId);
                });

            migrationBuilder.CreateTable(
                name: "CourseHoleCoordinate",
                columns: table => new
                {
                    courseHoleCoordinateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    latitude = table.Column<float>(type: "real", nullable: false),
                    longitude = table.Column<float>(type: "real", nullable: false),
                    courseHoleId = table.Column<int>(type: "int", nullable: false),
                    coordinateTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseHoleCoordinate", x => x.courseHoleCoordinateId);
                    table.ForeignKey(
                        name: "FK_CourseHoleCoordinate_CoordinateType_coordinateTypeId",
                        column: x => x.coordinateTypeId,
                        principalTable: "CoordinateType",
                        principalColumn: "coordinateTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseHoleCoordinate_CourseHoles_courseHoleId",
                        column: x => x.courseHoleId,
                        principalTable: "CourseHoles",
                        principalColumn: "courseHoleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "CoordinateType",
                columns: new[] { "coordinateTypeId", "description" },
                values: new object[,]
                {
                    { 1, "Tee" },
                    { 2, "Green" },
                    { 3, "Line" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseHoleCoordinate_coordinateTypeId",
                table: "CourseHoleCoordinate",
                column: "coordinateTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseHoleCoordinate_courseHoleId",
                table: "CourseHoleCoordinate",
                column: "courseHoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseHoleCoordinate");

            migrationBuilder.DropTable(
                name: "CoordinateType");

            migrationBuilder.AddColumn<float>(
                name: "greenLatitude",
                table: "CourseHoles",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "greenLongitude",
                table: "CourseHoles",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "teeLatitude",
                table: "CourseHoles",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "teeLongitude",
                table: "CourseHoles",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }
    }
}
