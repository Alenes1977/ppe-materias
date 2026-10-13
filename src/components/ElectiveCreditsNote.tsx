import { getCreditSummary, type CreditModule } from '../lib/creditSummary';

export function ElectiveCreditsNote({ modules }: { modules: CreditModule[] }) {
  const { electiveChoices } = getCreditSummary(modules);

  if (electiveChoices.length === 0) return null;

  return (
    <aside className="my-4 space-y-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
      {electiveChoices.map((choice) => (
        <p key={choice.name}>
          <strong>{choice.name}:</strong> se cursan {choice.required} ECTS entre
          las opciones disponibles: {choice.options.join(' / ')}. La oferta suma{' '}
          {choice.offered} ECTS; al total del grado se incorporan{' '}
          {choice.required} ECTS.
        </p>
      ))}
    </aside>
  );
}
