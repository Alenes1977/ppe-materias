/** Estructura compartida por los planes publicados y el editor. */
export interface CreditModule {
  name: string;
  ects: number;
  subjects: { courses: { name: string; type: string; ects: number }[] }[];
}

export function getCreditSummary(modules: CreditModule[]) {
  let ectsBasicas = 0;
  let ectsObligatorias = 0;
  let ectsOptativas = 0;
  let ectsTrabajoFinGrado = 0;
  let ectsOtros = 0;
  const electiveChoices: {
    name: string;
    required: number;
    offered: number;
    options: string[];
  }[] = [];

  for (const module of modules) {
    const courses = module.subjects.flatMap((subject) => subject.courses);
    const offered = courses.reduce((sum, course) => sum + course.ects, 0);

    // En módulos íntegramente optativos, los ECTS del módulo son la carga
    // a cursar; la oferta puede incluir varias alternativas para completarla.
    if (
      module.ects > 0 &&
      offered > module.ects &&
      courses.every((course) => course.type === 'Optativa')
    ) {
      ectsOptativas += module.ects;
      electiveChoices.push({
        name: module.name,
        required: module.ects,
        offered,
        options: courses.map((course) => course.name),
      });
      continue;
    }

    for (const course of courses) {
      switch (course.type) {
        case 'Básica':
          ectsBasicas += course.ects;
          break;
        case 'Obligatoria':
          ectsObligatorias += course.ects;
          break;
        case 'Optativa':
          ectsOptativas += course.ects;
          break;
        case 'Trabajo Fin de Grado':
        case 'Trabajo Fin de Grado / Máster':
          ectsTrabajoFinGrado += course.ects;
          break;
        default:
          ectsOtros += course.ects;
      }
    }
  }

  return {
    ectsBasicas,
    ectsObligatorias,
    ectsOptativas,
    ectsTrabajoFinGrado,
    ectsOtros,
    ectsTotal:
      ectsBasicas +
      ectsObligatorias +
      ectsOptativas +
      ectsTrabajoFinGrado +
      ectsOtros,
    electiveChoices,
  };
}
