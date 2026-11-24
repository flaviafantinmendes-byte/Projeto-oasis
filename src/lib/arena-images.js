const BASE = "https://media.base44.com/images/public/6aff5985e1118435ff63bdc2/";

export const BRAND_LOGO =
  "https://base44.app/api/apps/6aff5985e1118435ff63bdc2/files/mp/public/6aff5985e1118435ff63bdc2/c71c1e6cb1d1a198e6f6fbdde01d7abf_oasis-logo-eventos.png";

export const ARENA_IMAGES = {
  hero: BASE + "9cde516cd_generated_4cf4b3db.png",
  modalidadeJiujitsu: BASE + "60466883d_generated_859e11c0.png",
  modalidadeTaekwondo: BASE + "e451090d1_generated_4b40f554.png",
  modalidadeMusica: BASE + "9fcbf54d7_generated_image.png",
  modalidadeDanca: BASE + "4ec6a0191_generated_image.png",
};

export const MODALITY_IMAGES = {
  "jiu-jitsu": ARENA_IMAGES.modalidadeJiujitsu,
  taekwondo: ARENA_IMAGES.modalidadeTaekwondo,
  musica: ARENA_IMAGES.modalidadeMusica,
  danca: ARENA_IMAGES.modalidadeDanca,
};

export function modalityImage(value = "") {
  const key = String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
  return MODALITY_IMAGES[key] || ARENA_IMAGES.modalidadeJiujitsu;
}