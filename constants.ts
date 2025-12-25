
import { BookPage } from './types';

export const BOOK_DATA: BookPage[] = [
  {
    id: 0,
    title: "A Aquarela de Davi",
    content: "O Menino Segundo o Coração de Deus",
    lesson: "Início da Jornada",
    bibleReference: "1 Samuel 16:7",
    illustrationPrompt: "Soft watercolor illustration of a young shepherd boy named David in the green hills of Bethlehem, colorful sky, fluffy white sheep around him, gentle and artistic style, pastel colors.",
    pageNumber: "1"
  },
  {
    id: 1,
    title: "O Pastor de Coração Luminoso",
    content: "Nas colinas verde-esmeralda de Belém, vivia um jovem pastor chamado Davi. Seus cabelos brilhavam como cobre ao sol, e sua túnica simples tinha a cor da terra. Mas o mais bonito em Davi eram seus olhos, azuis e cheios de sonhos.\n\nEnquanto cuidava de ovelhas brancas como nuvens, Davi conversava com Deus em silêncio. Dentro dele, ardia uma chama dourada de coragem e fé.",
    lesson: "Deus vê o coração, não a aparência.",
    bibleReference: "1 Samuel 16:11-12",
    illustrationPrompt: "Soft watercolor painting of young David looking at the stars at night, copper-colored hair, holding a shepherd's staff, gentle blue eyes, dreamlike atmosphere, watercolor textures.",
    pageNumber: "2–3"
  },
  {
    id: 2,
    title: "A Visita do Anjo",
    content: "Certa noite, uma luz branca e brilhante cortou o céu. Davi seguiu o brilho até uma clareira e ali encontrou o anjo Gabriel, com asas que mudavam de cor como um arco-íris.\n\n— “Você será rei de Israel”, disse o anjo. — “Mas antes, aprenderá a confiar em Deus em todos os desafios.”\n\nDavi guardou aquelas palavras em seu coração.",
    lesson: "Deus tem um plano especial para cada criança.",
    bibleReference: "1 Samuel 16:1-13",
    illustrationPrompt: "Ethereal watercolor illustration of the angel Gabriel with rainbow-colored wings appearing to young David in a clearing, soft divine light, mystical and peaceful children's book style.",
    pageNumber: "4–5"
  },
  {
    id: 3,
    title: "O Gigante Golias",
    content: "No campo de batalha, tudo parecia cinza e sem esperança. Um gigante chamado Golias, com armadura de bronze e capa vermelha, assustava todos. Mas Davi não teve medo.\n\nCom sua funda e cinco pedrinhas brancas, ele disse: — “Eu luto com a força de Deus!”\n\nA pedra voou como um raio de luz e Golias caiu. O medo virou alegria, e o campo se encheu de cores.",
    lesson: "Com Deus, somos mais fortes que nossos medos.",
    bibleReference: "1 Samuel 17:45-50",
    illustrationPrompt: "Watercolor scene of small young David standing brave before the giant Goliath, Goliath wears bronze armor and a red cape, David has a sling, no violence, artistic and symbolic, vibrant colors returning to the battlefield.",
    pageNumber: "6–7"
  },
  {
    id: 4,
    title: "Davi no Palácio",
    content: "Davi foi levado ao palácio do rei Saul. Com sua harpa, ele tocava músicas que acalmavam o coração do rei.\n\nMas Saul ficou com ciúmes do brilho de Davi. E assim, Davi precisou fugir.",
    lesson: "Mesmo quando outros não nos entendem, Deus cuida de nós.",
    bibleReference: "1 Samuel 16:23",
    illustrationPrompt: "Watercolor illustration of David playing a golden harp in a royal palace, colorful musical notes floating in the air, king Saul in the background, warm light, artistic brushstrokes.",
    pageNumber: "8–9"
  },
  {
    id: 5,
    title: "Amizade e Esperança",
    content: "Nas cavernas, Davi encontrou um amigo fiel chamado Jônatas. Eles cuidavam um do outro como irmãos.\n\nDavi ajudou pessoas tristes e esquecidas, devolvendo cor e esperança a seus corações.",
    lesson: "A amizade verdadeira é um presente de Deus.",
    bibleReference: "1 Samuel 18:1-3",
    illustrationPrompt: "Soft watercolor of David and his friend Jonathan together in a cave sanctuary, surrounded by diverse people, atmosphere of kindness and hope, pastel tones.",
    pageNumber: "10–11"
  },
  {
    id: 6,
    title: "Davi, o Rei",
    content: "Depois de muitos desafios, Davi foi coroado rei. Mesmo usando roupas reais, ele nunca esqueceu que era um pastor. Seu reinado foi cheio de justiça, amor e sabedoria. A luz que começou em Belém tornou-se esperança para todo o povo.",
    lesson: "Um coração fiel agrada a Deus.",
    bibleReference: "2 Samuel 5:4",
    illustrationPrompt: "Majestic watercolor portrait of King David with a golden crown, but still with the heart of a shepherd, surrounded by happy children, golden light everywhere, triumphant and peaceful ending.",
    pageNumber: "12–13"
  }
];

export const MODEL_IMAGE = 'gemini-2.5-flash-image';
export const MODEL_TEXT = 'gemini-3-flash-preview';
export const MODEL_TTS = 'gemini-2.5-flash-preview-tts';
