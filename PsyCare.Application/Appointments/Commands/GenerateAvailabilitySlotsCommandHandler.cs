using MediatR;
using PsyCare.Application.Abstractions.Persistence;
using PsyCare.Domain.Entities;
using PsyCare.Application.Common.Interfaces;

namespace PsyCare.Application.Appointments.Commands;

public class GenerateAvailabilitySlotsCommandHandler 
    : IRequestHandler<GenerateAvailabilitySlotsCommand>
{
    private readonly IAvailabilityRepository _repository;

    private readonly ITenantProvider _tenantProvider;

    public GenerateAvailabilitySlotsCommandHandler(IAvailabilityRepository repository, ITenantProvider tenantProvider)
    {
        _repository = repository;
        _tenantProvider = tenantProvider;
    }

    public async Task Handle(
        GenerateAvailabilitySlotsCommand request,
        CancellationToken cancellationToken)
    {
        var start = request.Date.Date.AddHours(request.StartHour);
        var end = request.Date.Date.AddHours(request.EndHour);

        var current = start;

        var tenantId = _tenantProvider.GetTenantId();

        var slots = new List<AvailabilitySlot>();

        while (current < end)
        {
            var slotEnd = current.AddMinutes(request.SlotMinutes);

            slots.Add(new AvailabilitySlot(
                tenantId,
                request.PsychologistId,
                current,
                slotEnd));

            current = slotEnd;
        }

        await _repository.AddSlotsAsync(slots, cancellationToken);
    }
}
