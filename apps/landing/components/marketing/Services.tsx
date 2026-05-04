export default function Services() {
  const items = [
    "Ansiedad",
    "Estrés",
    "Relaciones",
    "Burnout",
    "Autoestima",
    "Crecimiento personal",
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-3xl font-semibold mb-10">
          No tienes que enfrentar esto solo
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item}
              className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition"
            >
              <p className="font-medium">{item}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}