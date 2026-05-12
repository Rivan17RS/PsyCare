using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PsyCare.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAvailabilityUniqueIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AvailabilitySlots_TenantId_PsychologistId_StartTime",
                table: "AvailabilitySlots",
                columns: new[] { "TenantId", "PsychologistId", "StartTime" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AvailabilitySlots_TenantId_PsychologistId_StartTime",
                table: "AvailabilitySlots");
        }
    }
}
