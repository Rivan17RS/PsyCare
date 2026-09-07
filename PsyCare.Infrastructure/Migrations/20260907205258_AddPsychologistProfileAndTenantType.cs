using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PsyCare.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPsychologistProfileAndTenantType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Tenants",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "PsychologistProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    LegalIdentityNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ProfessionalLicense = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Specialty = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Biography = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    Sex = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    ProfileImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PsychologistProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PsychologistProfiles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PsychologistProfiles_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PsychologistProfiles_TenantId",
                table: "PsychologistProfiles",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_PsychologistProfiles_UserId",
                table: "PsychologistProfiles",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PsychologistProfiles");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Tenants");
        }
    }
}
