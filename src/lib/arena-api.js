import { base44 } from "@/api/base44Client";
import { MODALIDADES, modalidadeInfo } from "@/lib/categorias";

const items = (page) => (Array.isArray(page) ? page : page?.items ?? []);

export async function listModalidades() {
  return items(await base44.entities.Modalidade.list({ sort: "ordem", limit: 20 }));
}

// As quatro modalidades oficiais, com a imagem cadastrada no banco quando existir.
export async function listModalidadesOficiais() {
  let registros = [];
  try {
    registros = await listModalidades();
  } catch {
    registros = [];
  }

  return MODALIDADES.map((oficial) => {
    const registro = registros.find((item) => modalidadeInfo(item.nome)?.slug === oficial.slug);
    return {
      ...oficial,
      id: registro?.id,
      imagem_url: registro?.imagem_url || "",
      descricao: registro?.descricao || oficial.descricao,
    };
  });
}