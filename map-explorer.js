// ================================================================
//  ARGIRA · MAP EXPLORER · ARRANQUE POR EVENTOS (SIN POLLING)
//  ================================================================
console.log('[ARGIRA] map-explorer.js empezó a ejecutarse');

/**
 * ============================================================
 * ARGIRA AUDIO ARCHITECTURE CONTRACT
 * ============================================================
 *
 * STATE MODEL
 * - _isListening = single source of truth for session state
 * - Only mutated by startListen() / stopListen()
 * - UI derives ONLY from _isListening — never from audio events
 *
 * AUDIO LAYERS
 * 1. WebAudio  (continuous perceptual field + synthesized event)
 *    — started in startListen(), stopped only in stopListen()
 *    — playAnchor() synthesizes audio in real time from CATALOGUE
 *      parameters (freq_base, tempo_bpm, decay, ...) — no static
 *      audio file is ever read or played.
 *    — never controlled by speech
 *
 * 2. Speech    (semantic layer)
 *    — independent of WebAudio
 *    — started in startListen(), stopped in stopListen()
 *
 * OBSERVABILITY
 * - CustomEvents (argira:*) are feedback only
 * - No CustomEvent may trigger state mutation
 *
 * CRITICAL INVARIANT
 * - No audio subsystem may mutate session state or main UI
 * ============================================================
 */
(function() {
  'use strict';

  // Fallback defensivo: si ArgiraSpeech no está definido (carga asíncrona o ausente),
  // se instala un stub no-op para que stopListen() y startListen() no fallen.
  // No introduce dependencia dura — el wrapper real sobreescribirá esto si llega.
  window.ArgiraSpeech ??= {
    speak() { return Promise.resolve(); },
    stop()  {},
  };

  // ------------------------------------------------------------------
  // 1. METADATOS DE OBRAS (OBRA_META + ALIASES)
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // OBRA_META usa directamente los IDs del CATALOGUE (esquema Autor_Titulo,
  // slug ASCII sin acentos) como claves. Lookup O(1) exacto.
  // Generado automáticamente desde CATALOGUE (pipeline 3.5.7): título y
  // artista derivados del id; img/audio tomados literalmente del propio id
  // (ya coinciden con los nombres reales en disco, incluida su ausencia
  // de tildes). Si una obra del catálogo no tiene entrada aquí (no debería
  // ocurrir ya que se generó desde el propio CATALOGUE) → fallback derivado.
  //
  // NOTA HISTÓRICA: la versión anterior de este archivo usaba IMAGE_INDEX
  // (lista de nombres de archivo hardcodeada a mano) e IMAGE_ALIAS_MAP
  // (tabla de alias id→archivo) porque los ids de OBRA_META usaban el
  // formato viejo "Autor · Título" y no coincidían con los archivos reales.
  // Con el nuevo esquema de ids (idéntico al nombre de archivo real, salvo
  // extensión) esa capa de indirección ya no es necesaria: resolveImg()
  // usa meta.img directamente.
  // ------------------------------------------------------------------

    const OBRA_META = {
    'Anonimo_Flores_silvestres_ilustracion_1909': {
      titulo: 'Flores silvestres ilustración 1909',
      artista: 'Anónimo',
      descripcion: 'Obra de Anónimo. Explora su sonificación en el mapa perceptual.',
      img: 'Anonimo_Flores_silvestres_ilustracion_1909.jpg',
    },
    'Botticelli_El_nacimiento_de_Venus': {
      titulo: 'El nacimiento de Venus',
      artista: 'Sandro Botticelli',
      descripcion: 'Obra de Sandro Botticelli. Explora su sonificación en el mapa perceptual.',
      img: 'Botticelli_El_nacimiento_de_Venus.jpg',
    },
    'Caravaggio_Baco': {
      titulo: 'Baco',
      artista: 'Caravaggio',
      descripcion: 'Obra de Caravaggio. Explora su sonificación en el mapa perceptual.',
      img: 'Caravaggio_Baco.jpeg',
    },
    'Caravaggio_Judith_decapitando_a_Holofernes': {
      titulo: 'Judith decapitando a Holofernes',
      artista: 'Caravaggio',
      descripcion: 'Obra de Caravaggio. Explora su sonificación en el mapa perceptual.',
      img: 'Caravaggio_Judith_decapitando_a_Holofernes.jpeg',
    },
    'Caravaggio_La_captura_de_Cristo': {
      titulo: 'La captura de Cristo',
      artista: 'Caravaggio',
      descripcion: 'Obra de Caravaggio. Explora su sonificación en el mapa perceptual.',
      img: 'Caravaggio_La_captura_de_Cristo.jpeg',
    },
    'Caravaggio_La_vocacion_de_San_Mateo': {
      titulo: 'La vocación de San Mateo',
      artista: 'Caravaggio',
      descripcion: 'Obra de Caravaggio. Explora su sonificación en el mapa perceptual.',
      img: 'Caravaggio_La_vocacion_de_San_Mateo.jpeg',
    },
    'Caravaggio_Los_tramposos': {
      titulo: 'Los tramposos',
      artista: 'Caravaggio',
      descripcion: 'Obra de Caravaggio. Explora su sonificación en el mapa perceptual.',
      img: 'Caravaggio_Los_tramposos.jpeg',
    },
    'Caravaggio_Medusa': {
      titulo: 'Medusa',
      artista: 'Caravaggio',
      descripcion: 'Obra de Caravaggio. Explora su sonificación en el mapa perceptual.',
      img: 'Caravaggio_Medusa.jpg',
    },
    'Caravaggio_Narciso': {
      titulo: 'Narciso',
      artista: 'Caravaggio',
      descripcion: 'Obra de Caravaggio. Explora su sonificación en el mapa perceptual.',
      img: 'Caravaggio_Narciso.jpeg',
    },
    'Cezanne_La_cesta_de_manzanas': {
      titulo: 'La cesta de manzanas',
      artista: 'Paul Cézanne',
      descripcion: 'Obra de Paul Cézanne. Explora su sonificación en el mapa perceptual.',
      img: 'Cezanne_La_cesta_de_manzanas.jpg',
    },
    'Cezanne_Madame_Cezanne_en_sillon_amarillo': {
      titulo: 'Madame Cezanne en sillón amarillo',
      artista: 'Paul Cézanne',
      descripcion: 'Obra de Paul Cézanne. Explora su sonificación en el mapa perceptual.',
      img: 'Cezanne_Madame_Cezanne_en_sillon_amarillo.jpg',
    },
    'Cezanne_Montana_Sainte-Victoire': {
      titulo: 'Montana Sainte-Victoire',
      artista: 'Paul Cézanne',
      descripcion: 'Obra de Paul Cézanne. Explora su sonificación en el mapa perceptual.',
      img: 'Cezanne_Montana_Sainte-Victoire.jpg',
    },
    'Cezanne_Tulipanes_en_un_jarron': {
      titulo: 'Tulipanes en un jarrón',
      artista: 'Paul Cézanne',
      descripcion: 'Obra de Paul Cézanne. Explora su sonificación en el mapa perceptual.',
      img: 'Cezanne_Tulipanes_en_un_jarron.jpg',
    },
    'Constable_Catedral_de_Salisbury': {
      titulo: 'Catedral de Salisbury',
      artista: 'John Constable',
      descripcion: 'Obra de John Constable. Explora su sonificación en el mapa perceptual.',
      img: 'Constable_Catedral_de_Salisbury.jpg',
    },
    'Constable_El_carro_de_heno': {
      titulo: 'El carro de heno',
      artista: 'John Constable',
      descripcion: 'Obra de John Constable. Explora su sonificación en el mapa perceptual.',
      img: 'Constable_El_carro_de_heno.jpg',
    },
    'DaVinci_Mona_Lisa': {
      titulo: 'Mona Lisa',
      artista: 'Leonardo da Vinci',
      descripcion: 'Obra de Leonardo da Vinci. Explora su sonificación en el mapa perceptual.',
      img: 'DaVinci_Mona_Lisa.jpg',
    },
    'Dali_Perfil_del_tiempo': {
      titulo: 'Perfil del tiempo',
      artista: 'Salvador Dalí',
      descripcion: 'Obra de Salvador Dalí. Explora su sonificación en el mapa perceptual.',
      img: 'Dali_Perfil_del_tiempo.jpeg',
    },
    'Degas_Bailarinas_azules': {
      titulo: 'Bailarinas azules',
      artista: 'Edgar Degas',
      descripcion: 'Obra de Edgar Degas. Explora su sonificación en el mapa perceptual.',
      img: 'Degas_Bailarinas_azules.jpg',
    },
    'Degas_El_ajenjo': {
      titulo: 'El ajenjo',
      artista: 'Edgar Degas',
      descripcion: 'Obra de Edgar Degas. Explora su sonificación en el mapa perceptual.',
      img: 'Degas_El_ajenjo.jpeg',
    },
    'Degas_Interior': {
      titulo: 'Interior',
      artista: 'Edgar Degas',
      descripcion: 'Obra de Edgar Degas. Explora su sonificación en el mapa perceptual.',
      img: 'Degas_Interior.jpg',
    },
    'Degas_La_clase_de_ballet': {
      titulo: 'La clase de ballet',
      artista: 'Edgar Degas',
      descripcion: 'Obra de Edgar Degas. Explora su sonificación en el mapa perceptual.',
      img: 'Degas_La_clase_de_ballet.jpg',
    },
    'Degas_La_familia_Bellelli': {
      titulo: 'La familia Bellelli',
      artista: 'Edgar Degas',
      descripcion: 'Obra de Edgar Degas. Explora su sonificación en el mapa perceptual.',
      img: 'Degas_La_familia_Bellelli.jpg',
    },
    'Delacroix_La_barca_de_Dante': {
      titulo: 'La barca de Dante',
      artista: 'Eugène Delacroix',
      descripcion: 'Obra de Eugène Delacroix. Explora su sonificación en el mapa perceptual.',
      img: 'Delacroix_La_barca_de_Dante.jpg',
    },
    'Frankenthaler_Mountains_and_Sea': {
      titulo: 'Mountains and Sea',
      artista: 'Helen Frankenthaler',
      descripcion: 'Obra de Helen Frankenthaler. Explora su sonificación en el mapa perceptual.',
      img: 'Frankenthaler_Mountains_and_Sea.jpg',
    },
    'FransHals_El_bebedor_alegre': {
      titulo: 'El bebedor alegre',
      artista: 'Frans Hals',
      descripcion: 'Obra de Frans Hals. Explora su sonificación en el mapa perceptual.',
      img: 'FransHals_El_bebedor_alegre.jpg',
    },
    'FransHals_El_caballero_sonriente': {
      titulo: 'El caballero sonriente',
      artista: 'Frans Hals',
      descripcion: 'Obra de Frans Hals. Explora su sonificación en el mapa perceptual.',
      img: 'FransHals_El_caballero_sonriente.jpg',
    },
    'FransHals_Retrato_de_matrimonio_en_un_jardin': {
      titulo: 'Retrato de matrimonio en un jardin',
      artista: 'Frans Hals',
      descripcion: 'Obra de Frans Hals. Explora su sonificación en el mapa perceptual.',
      img: 'FransHals_Retrato_de_matrimonio_en_un_jardin.jpg',
    },
    'Friedrich_Caminante_sobre_el_mar_de_nubes': {
      titulo: 'Caminante sobre el mar de nubes',
      artista: 'Caspar David Friedrich',
      descripcion: 'Obra de Caspar David Friedrich. Explora su sonificación en el mapa perceptual.',
      img: 'Friedrich_Caminante_sobre_el_mar_de_nubes.jpeg',
    },
    'Friedrich_El_mar_de_hielo': {
      titulo: 'El mar de hielo',
      artista: 'Caspar David Friedrich',
      descripcion: 'Obra de Caspar David Friedrich. Explora su sonificación en el mapa perceptual.',
      img: 'Friedrich_El_mar_de_hielo.jpg',
    },
    'Goya_La_gallina_ciega': {
      titulo: 'La gallina ciega',
      artista: 'Francisco de Goya',
      descripcion: 'Obra de Francisco de Goya. Explora su sonificación en el mapa perceptual.',
      img: 'Goya_La_gallina_ciega.jpg',
    },
    'Goya_La_maja_desnuda': {
      titulo: 'La maja desnuda',
      artista: 'Francisco de Goya',
      descripcion: 'Obra de Francisco de Goya. Explora su sonificación en el mapa perceptual.',
      img: 'Goya_La_maja_desnuda.jpg',
    },
    'Goya_La_vendimia': {
      titulo: 'La vendimia',
      artista: 'Francisco de Goya',
      descripcion: 'Obra de Francisco de Goya. Explora su sonificación en el mapa perceptual.',
      img: 'Goya_La_vendimia.jpeg',
    },
    'Goya_Los_fusilamientos_del_3_de_mayo': {
      titulo: 'Los fusilamientos del 3 de mayo',
      artista: 'Francisco de Goya',
      descripcion: 'Obra de Francisco de Goya. Explora su sonificación en el mapa perceptual.',
      img: 'Goya_Los_fusilamientos_del_3_de_mayo.jpg',
    },
    'Goya_Saturno_devorando_a_su_hijo': {
      titulo: 'Saturno devorando a su hijo',
      artista: 'Francisco de Goya',
      descripcion: 'Obra de Francisco de Goya. Explora su sonificación en el mapa perceptual.',
      img: 'Goya_Saturno_devorando_a_su_hijo.jpg',
    },
    'Hopper_Nighthawks': {
      titulo: 'Nighthawks',
      artista: 'Edward Hopper',
      descripcion: 'Obra de Edward Hopper. Explora su sonificación en el mapa perceptual.',
      img: 'Hopper_Nighthawks.jpg',
    },
    'Kandinsky_Amarillo_Rojo_Azul': {
      titulo: 'Amarillo Rojo Azul',
      artista: 'Wassily Kandinsky',
      descripcion: 'Obra de Wassily Kandinsky. Explora su sonificación en el mapa perceptual.',
      img: 'Kandinsky_Amarillo_Rojo_Azul.jpg',
    },
    'Kandinsky_Composicion_8': {
      titulo: 'Composicion 8',
      artista: 'Wassily Kandinsky',
      descripcion: 'Obra de Wassily Kandinsky. Explora su sonificación en el mapa perceptual.',
      img: 'Kandinsky_Composicion_8.jpg',
    },
    'Kandinsky_Several_Circles': {
      titulo: 'Several Circles',
      artista: 'Wassily Kandinsky',
      descripcion: 'Obra de Wassily Kandinsky. Explora su sonificación en el mapa perceptual.',
      img: 'Kandinsky_Several_Circles.jpg',
    },
    'Klimt_El_ciego': {
      titulo: 'El ciego',
      artista: 'Gustav Klimt',
      descripcion: 'Obra de Gustav Klimt. Explora su sonificación en el mapa perceptual.',
      img: 'Klimt_El_ciego.jpg',
    },
    'Klimt_Estanque_tranquilo_Egelsee': {
      titulo: 'Estanque tranquilo Egelsee',
      artista: 'Gustav Klimt',
      descripcion: 'Obra de Gustav Klimt. Explora su sonificación en el mapa perceptual.',
      img: 'Klimt_Estanque_tranquilo_Egelsee.jpg',
    },
    'Klimt_Filosofia': {
      titulo: 'Filosofía',
      artista: 'Gustav Klimt',
      descripcion: 'Obra de Gustav Klimt. Explora su sonificación en el mapa perceptual.',
      img: 'Klimt_Filosofia.jpg',
    },
    'Klimt_Idylle': {
      titulo: 'Idylle',
      artista: 'Gustav Klimt',
      descripcion: 'Obra de Gustav Klimt. Explora su sonificación en el mapa perceptual.',
      img: 'Klimt_Idylle.jpg',
    },
    'Klimt_Judith_I': {
      titulo: 'Judith I',
      artista: 'Gustav Klimt',
      descripcion: 'Obra de Gustav Klimt. Explora su sonificación en el mapa perceptual.',
      img: 'Klimt_Judith_I.jpg',
    },
    'Klimt_Jurisprudencia': {
      titulo: 'Jurisprudencia',
      artista: 'Gustav Klimt',
      descripcion: 'Obra de Gustav Klimt. Explora su sonificación en el mapa perceptual.',
      img: 'Klimt_Jurisprudencia.jpg',
    },
    'Klimt_La_medicina': {
      titulo: 'La medicina',
      artista: 'Gustav Klimt',
      descripcion: 'Obra de Gustav Klimt. Explora su sonificación en el mapa perceptual.',
      img: 'Klimt_La_medicina.JPG',
    },
    'Klimt_Retrato_de_Adele_Bloch-Bauer_I': {
      titulo: 'Retrato de Adele Bloch-Bauer I',
      artista: 'Gustav Klimt',
      descripcion: 'Obra de Gustav Klimt. Explora su sonificación en el mapa perceptual.',
      img: 'Klimt_Retrato_de_Adele_Bloch-Bauer_I.jpg',
    },
    'LopezPortana_Retrato_de_Goya': {
      titulo: 'Retrato de Goya',
      artista: 'Vicente López Portaña',
      descripcion: 'Obra de Vicente López Portaña. Explora su sonificación en el mapa perceptual.',
      img: 'LopezPortana_Retrato_de_Goya.jpg',
    },
    'Magritte_El_falso_espejo': {
      titulo: 'El falso espejo',
      artista: 'René Magritte',
      descripcion: 'Obra de René Magritte. Explora su sonificación en el mapa perceptual.',
      img: 'Magritte_El_falso_espejo.jpg',
    },
    'Malevich_Blanco_sobre_blanco': {
      titulo: 'Blanco sobre blanco',
      artista: 'Kazimir Malévich',
      descripcion: 'Obra de Kazimir Malévich. Explora su sonificación en el mapa perceptual.',
      img: 'Malevich_Blanco_sobre_blanco.png',
    },
    'Malevich_Cuadrado_negro_suprematista': {
      titulo: 'Cuadrado negro suprematista',
      artista: 'Kazimir Malévich',
      descripcion: 'Obra de Kazimir Malévich. Explora su sonificación en el mapa perceptual.',
      img: 'Malevich_Cuadrado_negro_suprematista.jpg',
    },
    'Matisse_La_danza_II': {
      titulo: 'La danza II',
      artista: 'Henri Matisse',
      descripcion: 'Obra de Henri Matisse. Explora su sonificación en el mapa perceptual.',
      img: 'Matisse_La_danza_II.jpg',
    },
    'Matisse_La_mesa_roja': {
      titulo: 'La mesa roja',
      artista: 'Henri Matisse',
      descripcion: 'Obra de Henri Matisse. Explora su sonificación en el mapa perceptual.',
      img: 'Matisse_La_mesa_roja.jpg',
    },
    'Matisse_Mujer_con_sombrero': {
      titulo: 'Mujer con sombrero',
      artista: 'Henri Matisse',
      descripcion: 'Obra de Henri Matisse. Explora su sonificación en el mapa perceptual.',
      img: 'Matisse_Mujer_con_sombrero.jpg',
    },
    'MiguelAngel_La_creacion_de_Adan': {
      titulo: 'La creación de Adán',
      artista: 'Miguel Ángel',
      descripcion: 'Obra de Miguel Ángel. Explora su sonificación en el mapa perceptual.',
      img: 'MiguelAngel_La_creacion_de_Adan.jpg',
    },
    'Monet_Almiar_efecto_de_nieve': {
      titulo: 'Almiar efecto de nieve',
      artista: 'Claude Monet',
      descripcion: 'Obra de Claude Monet. Explora su sonificación en el mapa perceptual.',
      img: 'Monet_Almiar_efecto_de_nieve.jpg',
    },
    'Monet_Campo_de_amapolas': {
      titulo: 'Campo de amapolas',
      artista: 'Claude Monet',
      descripcion: 'Obra de Claude Monet. Explora su sonificación en el mapa perceptual.',
      img: 'Monet_Campo_de_amapolas.jpg',
    },
    'Monet_Catedral_de_Ruan': {
      titulo: 'Catedral de Ruan',
      artista: 'Claude Monet',
      descripcion: 'Obra de Claude Monet. Explora su sonificación en el mapa perceptual.',
      img: 'Monet_Catedral_de_Ruan.jpg',
    },
    'Monet_Impresion_sol_naciente': {
      titulo: 'Impresión sol naciente',
      artista: 'Claude Monet',
      descripcion: 'Obra de Claude Monet. Explora su sonificación en el mapa perceptual.',
      img: 'Monet_Impresion_sol_naciente.jpg',
    },
    'Monet_Paseo_por_el_acantilado_en_Pourville': {
      titulo: 'Paseo por el acantilado en Pourville',
      artista: 'Claude Monet',
      descripcion: 'Obra de Claude Monet. Explora su sonificación en el mapa perceptual.',
      img: 'Monet_Paseo_por_el_acantilado_en_Pourville.jpg',
    },
    'Munch_El_grito': {
      titulo: 'El grito',
      artista: 'Edvard Munch',
      descripcion: 'Obra de Edvard Munch. Explora su sonificación en el mapa perceptual.',
      img: 'Munch_El_grito.jpg',
    },
    'Picasso_Guernica': {
      titulo: 'Guernica',
      artista: 'Pablo Picasso',
      descripcion: 'Obra de Pablo Picasso. Explora su sonificación en el mapa perceptual.',
      img: 'Picasso_Guernica.jpg',
    },
    'Pollock_Autumn_Rhythm': {
      titulo: 'Autumn Rhythm',
      artista: 'Jackson Pollock',
      descripcion: 'Obra de Jackson Pollock. Explora su sonificación en el mapa perceptual.',
      img: 'Pollock_Autumn_Rhythm.jpg',
    },
    'Rafael_Adan_y_Eva': {
      titulo: 'Adán y Eva',
      artista: 'Rafael Sanzio',
      descripcion: 'Obra de Rafael Sanzio. Explora su sonificación en el mapa perceptual.',
      img: 'Rafael_Adan_y_Eva.jpg',
    },
    'Rafael_La_escuela_de_Atenas': {
      titulo: 'La escuela de Atenas',
      artista: 'Rafael Sanzio',
      descripcion: 'Obra de Rafael Sanzio. Explora su sonificación en el mapa perceptual.',
      img: 'Rafael_La_escuela_de_Atenas.jpg',
    },
    'Rembrandt_Autorretrato': {
      titulo: 'Autorretrato',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Obra de Rembrandt van Rijn. Explora su sonificación en el mapa perceptual.',
      img: 'Rembrandt_Autorretrato.jpg',
    },
    'Rembrandt_El_abanderado': {
      titulo: 'El abanderado',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Obra de Rembrandt van Rijn. Explora su sonificación en el mapa perceptual.',
      img: 'Rembrandt_El_abanderado.jpeg',
    },
    'Rembrandt_El_retorno_del_hijo_prodigo': {
      titulo: 'El retorno del hijo prodigo',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Obra de Rembrandt van Rijn. Explora su sonificación en el mapa perceptual.',
      img: 'Rembrandt_El_retorno_del_hijo_prodigo.jpeg',
    },
    'Rembrandt_La_novia_judia': {
      titulo: 'La novia judía',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Obra de Rembrandt van Rijn. Explora su sonificación en el mapa perceptual.',
      img: 'Rembrandt_La_novia_judia.jpeg',
    },
    'Rembrandt_La_ronda_de_noche': {
      titulo: 'La ronda de noche',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Obra de Rembrandt van Rijn. Explora su sonificación en el mapa perceptual.',
      img: 'Rembrandt_La_ronda_de_noche.jpg',
    },
    'Rembrandt_Leccion_de_anatomia_del_Dr_Tulp': {
      titulo: 'Leccion de anatomía del Dr Tulp',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Obra de Rembrandt van Rijn. Explora su sonificación en el mapa perceptual.',
      img: 'Rembrandt_Leccion_de_anatomia_del_Dr_Tulp.jpeg',
    },
    'Rembrandt_Tormenta_en_el_mar_de_Galilea': {
      titulo: 'Tormenta en el mar de Galilea',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Obra de Rembrandt van Rijn. Explora su sonificación en el mapa perceptual.',
      img: 'Rembrandt_Tormenta_en_el_mar_de_Galilea.jpeg',
    },
    'Renoir_Le_Moulin_de_la_Galette': {
      titulo: 'Le Moulin de la Galette',
      artista: 'Pierre-Auguste Renoir',
      descripcion: 'Obra de Pierre-Auguste Renoir. Explora su sonificación en el mapa perceptual.',
      img: 'Renoir_Le_Moulin_de_la_Galette.jpg',
    },
    'Rothko_Orange_Red_Yellow': {
      titulo: 'Orange Red Yellow',
      artista: 'Mark Rothko',
      descripcion: 'Obra de Mark Rothko. Explora su sonificación en el mapa perceptual.',
      img: 'Rothko_Orange_Red_Yellow.jpg',
    },
    'Rousseau_Sorprendida': {
      titulo: 'Sorprendida',
      artista: 'Henri Rousseau',
      descripcion: 'Obra de Henri Rousseau. Explora su sonificación en el mapa perceptual.',
      img: 'Rousseau_Sorprendida.jpg',
    },
    'Rubens_El_descendimiento_de_la_cruz': {
      titulo: 'El descendimiento de la cruz',
      artista: 'Peter Paul Rubens',
      descripcion: 'Obra de Peter Paul Rubens. Explora su sonificación en el mapa perceptual.',
      img: 'Rubens_El_descendimiento_de_la_cruz.jpg',
    },
    'Seurat_Tarde_de_domingo_en_la_Grande_Jatte': {
      titulo: 'Tarde de domingo en la Grande Jatte',
      artista: 'Georges Seurat',
      descripcion: 'Obra de Georges Seurat. Explora su sonificación en el mapa perceptual.',
      img: 'Seurat_Tarde_de_domingo_en_la_Grande_Jatte.jpg',
    },
    'Signac_Acantilado_Petit_Andely': {
      titulo: 'Acantilado Petit Andely',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_Acantilado_Petit_Andely.jpg',
    },
    'Signac_Barcas_junto_al_rio': {
      titulo: 'Barcas junto al rio',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_Barcas_junto_al_rio.jpg',
    },
    'Signac_Bodegon_naranjas': {
      titulo: 'Bodegon naranjas',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_Bodegon_naranjas.jpg',
    },
    'Signac_El_puerto_de_Saint-Tropez': {
      titulo: 'El puerto de Saint-Tropez',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_El_puerto_de_Saint-Tropez.jpg',
    },
    'Signac_Escena_urbana': {
      titulo: 'Escena urbana',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_Escena_urbana.jpg',
    },
    'Signac_Gran_Canal_Venecia': {
      titulo: 'Gran Canal Venecia',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_Gran_Canal_Venecia.jpg',
    },
    'Signac_La_ventana': {
      titulo: 'La ventana',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_La_ventana.jpg',
    },
    'Signac_Muelle_con_caballete': {
      titulo: 'Muelle con caballete',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_Muelle_con_caballete.jpg',
    },
    'Signac_Paisaje_costero_1': {
      titulo: 'Paisaje costero 1',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_Paisaje_costero_1.jpg',
    },
    'Signac_Paisaje_costero_2': {
      titulo: 'Paisaje costero 2',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_Paisaje_costero_2.jpg',
    },
    'Signac_Puerto_con_barcos': {
      titulo: 'Puerto con barcos',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_Puerto_con_barcos.jpg',
    },
    'Signac_Route_de_Gennevilliers': {
      titulo: 'Route de Gennevilliers',
      artista: 'Paul Signac',
      descripcion: 'Obra de Paul Signac. Explora su sonificación en el mapa perceptual.',
      img: 'Signac_Route_de_Gennevilliers.jpg',
    },
    'Tintoretto_El_origen_de_la_Via_Lactea': {
      titulo: 'El origen de la Via Lactea',
      artista: 'Tintoretto',
      descripcion: 'Obra de Tintoretto. Explora su sonificación en el mapa perceptual.',
      img: 'Tintoretto_El_origen_de_la_Via_Lactea.jpg',
    },
    'Tintoretto_La_ultima_cena': {
      titulo: 'La ultima cena',
      artista: 'Tintoretto',
      descripcion: 'Obra de Tintoretto. Explora su sonificación en el mapa perceptual.',
      img: 'Tintoretto_La_ultima_cena.jpg',
    },
    'Tiziano_Venus_de_Urbino': {
      titulo: 'Venus de Urbino',
      artista: 'Tiziano',
      descripcion: 'Obra de Tiziano. Explora su sonificación en el mapa perceptual.',
      img: 'Tiziano_Venus_de_Urbino.jpg',
    },
    'Turner_Barco_de_esclavos': {
      titulo: 'Barco de esclavos',
      artista: 'J. M. W. Turner',
      descripcion: 'Obra de J. M. W. Turner. Explora su sonificación en el mapa perceptual.',
      img: 'Turner_Barco_de_esclavos.jpg',
    },
    'Turner_Dido_construyendo_Cartago': {
      titulo: 'Dido construyendo Cartago',
      artista: 'J. M. W. Turner',
      descripcion: 'Obra de J. M. W. Turner. Explora su sonificación en el mapa perceptual.',
      img: 'Turner_Dido_construyendo_Cartago.jpg',
    },
    'Turner_El_Temerario_remolcado': {
      titulo: 'El Temerario remolcado',
      artista: 'J. M. W. Turner',
      descripcion: 'Obra de J. M. W. Turner. Explora su sonificación en el mapa perceptual.',
      img: 'Turner_El_Temerario_remolcado.jpg',
    },
    'Turner_Incendio_del_Parlamento': {
      titulo: 'Incendio del Parlamento',
      artista: 'J. M. W. Turner',
      descripcion: 'Obra de J. M. W. Turner. Explora su sonificación en el mapa perceptual.',
      img: 'Turner_Incendio_del_Parlamento.jpg',
    },
    'Turner_Pescadores_en_el_mar': {
      titulo: 'Pescadores en el mar',
      artista: 'J. M. W. Turner',
      descripcion: 'Obra de J. M. W. Turner. Explora su sonificación en el mapa perceptual.',
      img: 'Turner_Pescadores_en_el_mar.jpg',
    },
    'Turner_Tormenta_de_nieve': {
      titulo: 'Tormenta de nieve',
      artista: 'J. M. W. Turner',
      descripcion: 'Obra de J. M. W. Turner. Explora su sonificación en el mapa perceptual.',
      img: 'Turner_Tormenta_de_nieve.jpg',
    },
    'VanGogh_127': {
      titulo: '127',
      artista: 'Vincent van Gogh',
      descripcion: 'Obra de Vincent van Gogh. Explora su sonificación en el mapa perceptual.',
      img: 'VanGogh_127.jpg',
    },
    'VanGogh_La_noche_estrellada': {
      titulo: 'La noche estrellada',
      artista: 'Vincent van Gogh',
      descripcion: 'Obra de Vincent van Gogh. Explora su sonificación en el mapa perceptual.',
      img: 'VanGogh_La_noche_estrellada.jpg',
    },
    'VanGogh_Trigal_con_cuervos': {
      titulo: 'Trigal con cuervos',
      artista: 'Vincent van Gogh',
      descripcion: 'Obra de Vincent van Gogh. Explora su sonificación en el mapa perceptual.',
      img: 'VanGogh_Trigal_con_cuervos.jpg',
    },
    'Velazquez_La_rendicion_de_Breda_Las_lanzas': {
      titulo: 'La rendición de Breda Las lanzas',
      artista: 'Diego Velázquez',
      descripcion: 'Obra de Diego Velázquez. Explora su sonificación en el mapa perceptual.',
      img: 'Velazquez_La_rendicion_de_Breda_Las_lanzas.jpg',
    },
    'Velazquez_Las_meninas': {
      titulo: 'Las meninas',
      artista: 'Diego Velázquez',
      descripcion: 'Obra de Diego Velázquez. Explora su sonificación en el mapa perceptual.',
      img: 'Velazquez_Las_meninas.jpg',
    },
    'Velazquez_Retrato_de_Juan_de_Pareja': {
      titulo: 'Retrato de Juan de Pareja',
      artista: 'Diego Velázquez',
      descripcion: 'Obra de Diego Velázquez. Explora su sonificación en el mapa perceptual.',
      img: 'Velazquez_Retrato_de_Juan_de_Pareja.jpg',
    },
    'Velazquez_Venus_del_espejo': {
      titulo: 'Venus del espejo',
      artista: 'Diego Velázquez',
      descripcion: 'Obra de Diego Velázquez. Explora su sonificación en el mapa perceptual.',
      img: 'Velazquez_Venus_del_espejo.jpg',
    },
    'Velazquez_Vieja_friendo_huevos': {
      titulo: 'Vieja friendo huevos',
      artista: 'Diego Velázquez',
      descripcion: 'Obra de Diego Velázquez. Explora su sonificación en el mapa perceptual.',
      img: 'Velazquez_Vieja_friendo_huevos.jpg',
    },
    'Vermeer_La_joven_de_la_perla': {
      titulo: 'La joven de la perla',
      artista: 'Johannes Vermeer',
      descripcion: 'Obra de Johannes Vermeer. Explora su sonificación en el mapa perceptual.',
      img: 'Vermeer_La_joven_de_la_perla.jpg',
    },
    'Vermeer_La_lechera': {
      titulo: 'La lechera',
      artista: 'Johannes Vermeer',
      descripcion: 'Obra de Johannes Vermeer. Explora su sonificación en el mapa perceptual.',
      img: 'Vermeer_La_lechera.png',
    },
    'WinslowHomer_El_bote_azul': {
      titulo: 'El bote azul',
      artista: 'Winslow Homer',
      descripcion: 'Obra de Winslow Homer. Explora su sonificación en el mapa perceptual.',
      img: 'WinslowHomer_El_bote_azul.jpg',
    },
  };


  // Ya no se valida contra un índice hardcodeado del filesystem: con el
  // esquema de ids nuevo, meta.img contiene el nombre real de archivo tal
  // cual (sin acentos, generado por el pipeline 3.5.7 junto al id). Si algún
  // día el archivo no existe físicamente, el navegador disparará onerror
  // en la propia <img> (gestionado en openModal) — no hace falta duplicar
  // esa comprobación aquí.


  // OBRA_META usa CATALOGUE.id como clave directa → lookup O(1), sin normalización.
  // Construida una vez al arranque para evitar find() en cada frame.
  const _metaIndex = new Map(Object.entries(OBRA_META));

  function findMeta(id) {
    // 1. Lookup exacto O(1)
    const curado = _metaIndex.get(id);

    // 2. Base desde CATALOGUE (para coordenadas sonoras)
    const base = window.CATALOGUE?.find(o => o.id === id);

    // 3. Sin base en catálogo → error controlado
    if (!base) {
      if (curado) return curado;
      console.warn(`[ARGIRA] obra no encontrada en catálogo: "${id}"`);
      return {
        titulo:      id,
        artista:     'ARGIRA',
        descripcion: 'Obra no encontrada en el catálogo ARGIRA.',
        img:         null,
      };
    }

    // 4. Fallback derivado (sin metadatos curados)
    const derived = {
      id:          base.id,
      titulo:      base.id,
      artista:     'ARGIRA',
      descripcion: 'Obra del catálogo ARGIRA. Explora su sonificación en el mapa perceptual.',
      img:         null,
      freq:        base.freq,
      tempo:       base.tempo,
    };

    if (!curado) {
      console.warn(`[ARGIRA] sin metadatos curados para: "${id}"`);
      return derived;
    }

    // 5. Merge: curado gana, base aporta coordenadas sonoras.
    // id siempre fijado al id canónico del catálogo (no sobreescribible por curado).
    return { ...derived, ...curado, id: base.id };
  }

  // Resuelve src de imagen para uso en img.src.
  // meta.img ya es el nombre real de archivo (esquema de ids 3.5.7); solo
  // se antepone la carpeta 'img/'. URLs absolutas pasan tal cual.
  function resolveImg(meta) {
    if (!meta) return '';
    const src = meta.img;
    if (!src) return '';
    if (/^https?:\/\//.test(src)) return src;
    if (/^img\//.test(src)) return src; // ya viene con ruta — no duplicar
    return 'img/' + src;
  }

  // resolveAudio eliminada: la sonificación se sintetiza en tiempo real
  // (playAnchor, en index.html) a partir de los parámetros del CATALOGUE.
  // No existe capa de archivo .wav discreto que resolver.


  // ------------------------------------------------------------------
  // 2. MODAL (TODAS LAS FUNCIONES)
  // ------------------------------------------------------------------
  // State machine: 'CLOSED' | 'OPEN'
  // Única fuente de verdad para inert y aria-hidden.
  // Toda transición pasa por _setModalState() — nunca se toca inert directamente.
  //
  // Ciclo de vida:
  //   openModal  → hardResetModalState → rellena → _setModalState('OPEN')
  //   closeModal → hardResetModalState → restaura DOM overlay → devuelve foco
  //   hardResetModalState → garantiza pizarra en blanco sin importar el estado previo
  // ------------------------------------------------------------------
  let overlay, modal, listenBtn, closeBtn;
  let _currentObra  = null;
  let _lastFocused  = null;
  let _modalState   = 'CLOSED'; // state machine
  let _isListening  = false;    // fuente de verdad JS del pipeline de audio (no el DOM)
  let _audioToken   = 0;        // token de sesión — invalida callbacks async de sesiones anteriores

  // ── BLOQUE 1D — Vista ampliada ("Zoom") ──────────────────────────
  // Estado y referencias propias del Zoom. Completamente separadas del
  // estado del modal principal (_modalState, trapFocus, etc.) para no
  // introducir conflictos entre los dos niveles de foco.
  let zoomOverlay, zoomContent, zoomImg, zoomCloseBtn, zoomBtn;
  let _zoomOpen        = false; // fuente de verdad: ¿está abierto el Zoom?
  let _zoomLastFocused = null;  // elemento al que devolver el foco al cerrar Zoom

  // Guard global: si algo rompe el flujo y deja #app inert fuera del modal,
  // el siguiente foco en window lo detecta y lo libera.
  window.addEventListener('focus', () => {
    if (_modalState === 'CLOSED') {
      const appEl = document.getElementById('app');
      if (appEl && appEl.inert) {
        console.warn('[ARGIRA] inert leak detectado — liberando #app');
        appEl.inert = false;
      }
    }
  }, true); // capture: detecta cualquier foco en el árbol

  // Guard de errores JS no capturados
  window.addEventListener('error', () => {
    if (_modalState === 'CLOSED') {
      const appEl = document.getElementById('app');
      if (appEl && appEl.inert) appEl.inert = false;
    }
  });

  // _resetListenUI — solo UI del botón Escuchar, sin autoridad sobre estado lógico.
  // Único lugar que toca el DOM del botón. No muta _isListening.
  function _resetListenUI() {
    if (!listenBtn) return;
    listenBtn.disabled = false;
    listenBtn.removeAttribute('disabled');
    listenBtn.setAttribute('aria-pressed', 'false');
    listenBtn.classList.remove('speaking');
    listenBtn.innerHTML = '🔊 Escuchar';
  }

  // hardResetModalState — pizarra en blanco.
  // Nunca asume estado previo. Seguro llamar en cualquier momento,
  // incluso si el modal nunca llegó a abrirse completamente.
  // Delega en stopListen() para audio + _isListening: no duplica esa lógica.
  function hardResetModalState() {
    // 1. Audio, speech y _isListening: delegar en la autoridad única
    stopListen();

    // 2. Listeners de teclado: removeEventListener es no-op si no estaba añadido
    document.removeEventListener('keydown', trapFocus);

    // 3. inert siempre desactivado
    const appEl = document.getElementById('app');
    if (appEl) appEl.inert = false;

    // 4. State machine al estado base
    _modalState = 'CLOSED';
  }

  function _setModalState(state) {
    _modalState = state;
    const appEl = document.getElementById('app');
    if (state === 'OPEN') {
      if (appEl) appEl.inert = true;
      overlay?.removeAttribute('aria-hidden');
      overlay?.classList.add('open');
    } else {
      if (appEl) appEl.inert = false;
      overlay?.setAttribute('aria-hidden', 'true');
      overlay?.classList.remove('open');
    }
  }

  function buildModal() {
    const overlayDiv = document.createElement('div');
    overlayDiv.id = 'argira-obra-overlay';
    overlayDiv.setAttribute('aria-hidden', 'true');
    overlayDiv.innerHTML = `
      <div id="argira-obra-modal" role="dialog" aria-modal="true" aria-labelledby="argira-obra-title" aria-describedby="argira-obra-desc" tabindex="-1">
        <div id="argira-obra-img-wrap" aria-hidden="true">
          <span id="argira-obra-img-placeholder">cargando imagen…</span>
          <img id="argira-obra-img" src="" alt="" />
        </div>
        <div id="argira-obra-body">
          <p id="argira-obra-artist"></p>
          <h2 id="argira-obra-title"></h2>
          <p id="argira-obra-desc"></p>
          <p id="argira-obra-nivel" aria-hidden="true"></p>
          <div id="argira-obra-actions">
            <button id="argira-obra-close-btn" class="argira-modal-btn" type="button" aria-label="Cerrar y volver al mapa">Cerrar</button>
            <button id="argira-obra-listen-btn" class="argira-modal-btn" type="button" aria-pressed="false">🔊 Escuchar</button>
            <button id="argira-obra-zoom-btn" class="argira-modal-btn" type="button" hidden>Ver imagen ampliada</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlayDiv);
    return overlayDiv;
  }

  function getFocusables() {
    return Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.disabled && !el.closest('[hidden]'));
  }

  function trapFocus(e) {
    const els = getFocusables();
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (e.key === 'Escape') closeModal();
  }

  // ── BLOQUE 1D — Vista ampliada ("Zoom") ──────────────────────────
  //
  // Diseño: segundo overlay dedicado (no Fullscreen API), construido
  // bajo demanda. Focus trap propio e independiente de trapFocus/
  // getFocusables del modal principal — getFocusables() está acoplado
  // a la variable `modal`, así que aquí se reutiliza el mismo patrón
  // pero sobre `zoomContent`, sin tocar la función original.
  //
  // Ciclo de vida:
  //   openZoom  → construye overlay (1ª vez) → inert en modal → abre Zoom
  //   closeZoom → cierra Zoom → quita inert del modal → devuelve foco
  //
  // Reglas de foco:
  //   - Mientras Zoom está abierto, el modal principal queda `inert`
  //     (igual que #app queda inert mientras el modal está abierto).
  //   - Escape dentro de Zoom cierra SOLO Zoom (no propaga a trapFocus
  //     del modal, porque el listener de Zoom usa su propio handler
  //     y detiene la propagación).
  //   - Al cerrar Zoom, el foco vuelve exactamente al botón que lo
  //     abrió (guardado en _zoomLastFocused), y el modal principal
  //     permanece abierto con su propio _lastFocused intacto para
  //     cuando el usuario lo cierre después.

  function buildZoom() {
    const div = document.createElement('div');
    div.id = 'argira-zoom-overlay';
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = `
      <div id="argira-zoom-content" role="dialog" aria-modal="true" aria-label="Imagen ampliada" tabindex="-1">
        <button id="argira-zoom-close-btn" type="button" aria-label="Cerrar imagen ampliada">✕</button>
        <img id="argira-zoom-img" src="" alt="" />
      </div>
    `;
    document.body.appendChild(div);
    return div;
  }

  function getZoomFocusables() {
    if (!zoomContent) return [];
    return Array.from(zoomContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.disabled && !el.closest('[hidden]'));
  }

  function trapFocusZoom(e) {
    if (!_zoomOpen) return;

    if (e.key === 'Escape') {
      // Cierra SOLO Zoom. stopPropagation evita que el listener de
      // trapFocus del modal principal (también en 'keydown' sobre
      // document) procese este mismo Escape y cierre el modal.
      e.stopPropagation();
      e.preventDefault();
      closeZoom();
      return;
    }

    if (e.key === 'Tab') {
      const els = getZoomFocusables();
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      // No stopPropagation aquí: Tab dentro de Zoom no debe llegar a
      // trapFocus del modal de todos modos, porque preventDefault ya
      // impide el comportamiento por defecto y el foco se mantiene
      // dentro de zoomContent. Por seguridad adicional, se detiene:
      e.stopPropagation();
    }
  }

  function openZoom(srcUrl, altText, triggerBtn) {
    if (!srcUrl) return;

    if (!zoomOverlay) {
      zoomOverlay  = document.getElementById('argira-zoom-overlay') || buildZoom();
      zoomContent  = document.getElementById('argira-zoom-content');
      zoomImg      = document.getElementById('argira-zoom-img');
      zoomCloseBtn = document.getElementById('argira-zoom-close-btn');

      zoomCloseBtn.addEventListener('click', closeZoom);
      // Click en el fondo (fuera de la imagen) también cierra, igual
      // que el patrón ya usado en el overlay del modal principal.
      zoomOverlay.addEventListener('click', e => {
        if (e.target === zoomOverlay || e.target === zoomContent) closeZoom();
      });
    }

    zoomImg.src = srcUrl;
    zoomImg.alt = altText || '';

    // Modal principal queda inerte: el lector de pantalla y el
    // teclado no deben poder navegar accidentalmente por detrás
    // mientras Zoom está abierto.
    if (modal) modal.inert = true;

    _zoomLastFocused = triggerBtn || document.activeElement;

    zoomOverlay.removeAttribute('aria-hidden');
    zoomOverlay.classList.add('open');
    _zoomOpen = true;

    setTimeout(() => zoomContent.focus({ preventScroll: true }), 30);

    // Listener propio en captura: se ejecuta ANTES que trapFocus del
    // modal (que está en document, fase de burbuja por defecto),
    // garantizando que Escape/Tab se resuelvan aquí primero.
    document.addEventListener('keydown', trapFocusZoom, true);
  }

  function closeZoom() {
    if (!_zoomOpen) return;

    _zoomOpen = false;
    document.removeEventListener('keydown', trapFocusZoom, true);

    zoomOverlay.setAttribute('aria-hidden', 'true');
    zoomOverlay.classList.remove('open');

    // Liberar el modal principal — ya no está inerte.
    if (modal) modal.inert = false;

    // Limpiar src para no dejar la imagen ampliada cargada en memoria
    // más tiempo del necesario (buena práctica, no imprescindible).
    if (zoomImg) { zoomImg.removeAttribute('src'); zoomImg.alt = ''; }

    if (_zoomLastFocused && typeof _zoomLastFocused.focus === 'function') {
      setTimeout(() => _zoomLastFocused.focus({ preventScroll: true }), 30);
    }
    _zoomLastFocused = null;
  }

  function openModal(meta) {
    if (!meta) { console.warn('[ARGIRA] openModal: meta undefined'); return; }

    // Pizarra en blanco: nunca asume estado previo.
    // Cubre apertura inicial, reapertura sobre obra anterior, y recuperación tras error.
    hardResetModalState();

    if (!overlay) {
      overlay = document.getElementById('argira-obra-overlay') || buildModal();
      modal     = document.getElementById('argira-obra-modal');
      listenBtn = document.getElementById('argira-obra-listen-btn');
      closeBtn  = document.getElementById('argira-obra-close-btn');
      zoomBtn   = document.getElementById('argira-obra-zoom-btn');

      closeBtn?.addEventListener('click', closeModal);
      overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
      listenBtn.addEventListener('click', toggleListen);
      zoomBtn?.addEventListener('click', () => {
        const imgEl = document.getElementById('argira-obra-img');
        if (imgEl && imgEl.src) openZoom(imgEl.src, imgEl.alt, zoomBtn);
      });
    }

    document.getElementById('argira-obra-title').textContent  = meta.titulo;
    document.getElementById('argira-obra-artist').textContent = meta.artista;
    document.getElementById('argira-obra-desc').textContent   = meta.descripcion;

    const nivelEl = document.getElementById('argira-obra-nivel');
    if (nivelEl) { nivelEl.textContent = ''; nivelEl.setAttribute('aria-hidden', 'true'); }

    const imgEl = document.getElementById('argira-obra-img');
    const phEl  = document.getElementById('argira-obra-img-placeholder');
    imgEl.onload = null; imgEl.onerror = null;
    imgEl.removeAttribute('src');
    imgEl.classList.remove('loaded');
    phEl.style.display = '';
    imgEl.alt = `${meta.titulo} — ${meta.artista}`;

    // Zoom: oculto por defecto hasta confirmar que hay imagen cargada.
    if (zoomBtn) zoomBtn.hidden = true;

    if (meta.img) {
      phEl.textContent = 'cargando imagen…';
      imgEl.onload  = () => {
        imgEl.classList.add('loaded');
        phEl.style.display = 'none';
        if (zoomBtn) zoomBtn.hidden = false;
      };
      imgEl.onerror = () => {
        imgEl.classList.remove('loaded');
        phEl.textContent = 'imagen no disponible';
        if (zoomBtn) zoomBtn.hidden = true;
      };
      imgEl.src = resolveImg(meta);
    } else {
      phEl.textContent = 'sin imagen';
    }

    _currentObra = window.CATALOGUE?.find(o => o.id === meta.id) || null;

    // Siempre: reset primero (limpia disabled + estado visual), decisión después
    resetListenBtn();
    // El botón "Escuchar" dispara: (a) síntesis en tiempo real si hay obra en
    // CATALOGUE (_currentObra), y/o (b) locución de la descripción. Ya no hay
    // archivo .wav que condicione esto — antes 'meta.audio' hacía ese papel.
    if (listenBtn) listenBtn.disabled = !_currentObra && !meta.descripcion;
    listenBtn.dataset.texto   = meta.descripcion || '';
    listenBtn.dataset.titulo  = meta.titulo;
    listenBtn.dataset.artista = meta.artista;

    // Estrategia de foco al cerrar
    const _mapNode = meta?.id
      ? document.querySelector(`.map-node[data-id="${CSS.escape(meta.id)}"]`)
      : null;
    const _active = document.activeElement;
    const _activeIsUsable = _active &&
      _active !== document.body &&
      _active.id !== 'mapWrap' &&
      typeof _active.focus === 'function';
    _lastFocused = _mapNode || (_activeIsUsable ? _active : null)
                  || document.getElementById('btn-ayuda');

    _setModalState('OPEN');
    setTimeout(() => modal.focus({ preventScroll: true }), 50);
    document.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    if (_modalState === 'CLOSED') return;
    // Red de seguridad: Zoom nunca debería seguir abierto cuando se
    // cierra el modal (Escape dentro de Zoom cierra solo Zoom, y el
    // click en el backdrop del modal no es alcanzable con Zoom encima),
    // pero si ocurriera, se limpia aquí para no dejar overlay/listener
    // de Zoom huérfano.
    if (_zoomOpen) closeZoom();
    hardResetModalState();
    // overlay: quitar clase open y aria-hidden (hardReset no toca el DOM del overlay)
    overlay?.setAttribute('aria-hidden', 'true');
    overlay?.classList.remove('open');
    if (_lastFocused && typeof _lastFocused.focus === 'function') {
      // FIX: en Chrome Android, focus({preventScroll:true}) sobre un nodo
      // dentro de #mapWrap (touch-action:none) a veces no respeta
      // preventScroll y el navegador desplaza/reflowa el layout al
      // "traer a la vista" el elemento — eso es lo que movía el mapa
      // hacia la derecha justo al cerrar el modal. Como red de seguridad,
      // se captura el scroll del documento y de #mapWrap antes del focus
      // y se restaura inmediatamente después si el navegador los movió.
      const _sx = window.scrollX, _sy = window.scrollY;
      const _mw = document.getElementById('mapWrap');
      const _mwLeft = _mw ? _mw.scrollLeft : 0;
      const _mwTop  = _mw ? _mw.scrollTop  : 0;
      setTimeout(() => {
        _lastFocused.focus({ preventScroll: true });
        if (window.scrollX !== _sx || window.scrollY !== _sy) {
          window.scrollTo(_sx, _sy);
        }
        if (_mw && (_mw.scrollLeft !== _mwLeft || _mw.scrollTop !== _mwTop)) {
          _mw.scrollLeft = _mwLeft;
          _mw.scrollTop  = _mwTop;
        }
      }, 50);
    }
  }

  function toggleListen() {
    if (_isListening) stopListen();
    else startListen();
  }

  // SESSION ENTRY POINT — único lugar donde _isListening pasa a true.
  async function startListen() {
    // 0. Guard de reentrada — descarta dobles starts sin sesión activa que parar
    //    Si ya estamos escuchando, stopListen() ya habrá sido llamado por toggleListen.
    //    Si no estamos escuchando, _stopAllAudio() sin guard pisaría un init concurrente.
    if (_isListening) return;

    // 1. Unlock audioCtx dentro del gesto de usuario
    if (window.audioCtx?.state === 'suspended') {
      try { await window.audioCtx.resume(); } catch(_) {}
    }

    // 2. Parar pipelines previos solo si hay sesión activa (evita double-stop hazard)
    //    En arranque limpio (_isListening === false) no hay nada que parar.
    //    En reentrada concurrente el guard del paso 0 ya bloqueó la ejecución.
    // (llegados aquí, _isListening es false — no hay sesión activa que cancelar)

    // 3. Nueva sesión — token invalida callbacks async de la sesión anterior
    const token = ++_audioToken;

    // 4. Fuente de verdad JS primero — no el DOM
    _isListening = true;
    listenBtn.setAttribute('aria-pressed', 'true');
    listenBtn.classList.add('speaking');
    listenBtn.innerHTML = '⏹ Detener';

    // 5. Capturar estado antes del primer await (evita stale closure tras suspensión)
    const obra    = _currentObra;
    const titulo  = listenBtn.dataset.titulo;
    const artista = listenBtn.dataset.artista;
    const texto   = listenBtn.dataset.texto;
    const textoCompleto = [
      titulo && artista ? `${titulo}, por ${artista}.` : titulo || artista,
      texto
    ].filter(Boolean).join(' ');

    // 6. WebAudio: pipeline primario — campo sonoro activo antes que la voz
    // DIAGNÓSTICO TEMPORAL: await + .catch() explícito. playAnchor() es async;
    // sin esto, cualquier excepción quedaba como unhandled promise rejection
    // silenciosa — no llegaba a elStatus ni a consola visible en móvil.
    // Quitar el catch (dejar solo await) una vez resuelta la causa real.
    if (obra && window.ensureAudio && window.playAnchor) {
      await window.ensureAudio();
      try {
        await window.playAnchor({
          ...obra,
          label: titulo, cx: 0, cy: 0, t: performance.now(),
        });
      } catch (err) {
        console.error('[map-explorer] window.playAnchor rechazado:', err);
        const elStatus = document.getElementById('status');
        if (elStatus) elStatus.textContent = `⚠ play error: ${err.message}`;
      }
    }

    // 7. Speech: awaited — paso en el flujo, no controlador del estado
    const speechPromise = window.ArgiraSpeech
      ? window.ArgiraSpeech.speak(textoCompleto, { rate: 0.92 })
      : Promise.resolve();
    await speechPromise;

    // 8. Sin capa .wav discreta: el pipeline sintetiza en tiempo real (playAnchor,
    // paso 6) — no hay archivo que reproducir aparte. El campo sonoro (WebAudio)
    // continúa activo hasta que el usuario pulse stop.
    // No se llama _resetListenUI() — _isListening permanece true y el botón en "⏹ Detener".
  }

  // INTERNAL HARD STOP — para todas las capas de audio sin tocar el modelo de estado.
  function _stopAllAudio() {
    // 1. Speech — cancel() es más fiable que stop() en Firefox
    //    (speechSynthesis mantiene cola interna y no siempre corta con stop())
    if (window.ArgiraSpeech) window.ArgiraSpeech.stop();
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    // 2. WebAudio anchor — única capa de audio activa (síntesis en tiempo real)
    if (window.stopAnchor) window.stopAnchor();
  }

  // SESSION EXIT POINT — único lugar donde _isListening pasa a false.
  function stopListen() {
    _isListening = false; // señal al completion gate de startListen()
    _audioToken++;        // invalida cualquier callback async pendiente de la sesión anterior
    _stopAllAudio();
    _resetListenUI();
  }

  // resetListenBtn — alias público mantenido por compatibilidad con openModal().
  // Solo toca UI; no muta _isListening. Usar _resetListenUI() internamente.
  function resetListenBtn() { _resetListenUI(); }

  // announceToSR eliminada. El único canal assertive es #sr-announcer,
  // gestionado exclusivamente desde index.html (commit de obra).
  // La apertura de modal usa foco programático — el SR lee el contenido del modal.

  // ------------------------------------------------------------------
  // 3. UTILIDADES DE COORDENADAS
  // ------------------------------------------------------------------
  function getP1Range() {
    if (typeof window.P1_MIN !== 'undefined') return { min: window.P1_MIN, max: window.P1_MAX };
    return { min: 1.0, max: 5.0 };
  }
  function getP4Range() {
    if (typeof window.P4_MIN !== 'undefined') return { min: window.P4_MIN, max: window.P4_MAX };
    return { min: 1.55, max: 1.95 };
  }

  function clientToNearest(clientX, clientY) {
    // FIX: usar mapWrap (no canvas) para el rect — es la MISMA fuente que
    // index.html usa en resize() para calcular W/H antes de pintar los nodos
    // (pToCanvas). Usar canvas.getBoundingClientRect() aquí introducía un
    // desfase de coordenadas (borde CSS de #mapWrap, layout dvh en móvil)
    // que hacía fallar el hit-test de forma silenciosa: clientToNearest()
    // devolvía null y el modal nunca se abría, sin ningún error visible.
    const mapWrap = document.getElementById('mapWrap');
    if (!mapWrap || !window.CATALOGUE) return null;
    const rect = mapWrap.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const { min: P1_lo, max: P1_hi } = getP1Range();
    const { min: P4_lo, max: P4_hi } = getP4Range();
    const normP1 = v => (v - P1_lo) / (P1_hi - P1_lo);
    const normP4 = v => (v - P4_lo) / (P4_hi - P4_lo);
    const W = rect.width, H = rect.height;
    const PAD = 44;
    let bestDist = Infinity, bestObra = null;
    window.CATALOGUE.forEach(obra => {
      const cx = PAD + normP1(obra.P1) * (W - PAD * 2);
      const cy = PAD + (1 - normP4(obra.P4)) * (H - PAD * 2);
      const dx = x - cx, dy = y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 44 && dist < bestDist) { bestDist = dist; bestObra = obra; }
    });
    return bestObra;
  }

  // ------------------------------------------------------------------
  // 4. OVERLAY Y NODOS DOM
  // ------------------------------------------------------------------
  let mapOverlay = null;
  let overlayListenersAttached = false;

  function initOverlayAndNodes() {
    const canvas = document.getElementById('map');
    const mapWrap = document.getElementById('mapWrap');
    if (!canvas || !mapWrap) return false;

    if (!mapOverlay) {
      mapOverlay = document.getElementById('map-overlay');
      if (!mapOverlay) {
        mapOverlay = document.createElement('div');
        mapOverlay.id = 'map-overlay';
        canvas.insertAdjacentElement('afterend', mapOverlay);
      }
    }

    function syncOverlaySize() {
      const rect = canvas.getBoundingClientRect();
      mapOverlay.style.width = rect.width + 'px';
      mapOverlay.style.height = rect.height + 'px';
    }

    // ------------------------------------------------------------------
    // CLEANUP TOTAL — elimina todo el contenido de mapOverlay de una vez.
    // No depende de clases específicas: cualquier estructura futura
    // (sections, wrappers de clustering, índices dinámicos) queda limpia
    // automáticamente. Es seguro porque mapOverlay es el root aislado
    // que solo contiene nodos del mapa — nunca elementos externos.
    // ------------------------------------------------------------------
    function cleanup() {
      // Si TalkBack tenía foco dentro del overlay, blur() antes de destruir
      // el árbol evita "focus fantasma": foco apuntando a un nodo ya eliminado.
      // Se mueve al mapOverlay (container seguro) para que el AT no quede
      // sin punto de referencia.
      const active = document.activeElement;
      if (active && mapOverlay.contains(active)) {
        active.blur();
        mapOverlay.focus?.();
      }
      mapOverlay.innerHTML = '';
    }

    function onNodeActivate(e) {
      const id = e.currentTarget.dataset.id;
      const obra = window.CATALOGUE.find(o => o.id === id);
      if (!obra) return;
      openModal(findMeta(obra.id));
    }

    function onNodeKeydown(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const id = e.currentTarget.dataset.id;
      const obra = window.CATALOGUE.find(o => o.id === id);
      if (!obra) return;
      openModal(findMeta(obra.id));
    }

    function _makeExitNode() {
      // Escape dentro del flujo AT — invisible visualmente.
      // Posición off-screen: no ocupa espacio visual ni interfiere con pointer.
      // Al activarse, devuelve el foco a btn-audio-header (primer control del header).
      const btn = document.createElement('button');
      btn.className = 'map-exit-node';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Salir del mapa. Volver al menú principal');
      btn.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;white-space:nowrap;';
      btn.addEventListener('click', () => {
        const target = document.getElementById('btn-audio-header');
        if (target) target.focus();
      });
      return btn;
    }

    // Etiquetas semánticas de la cuadrícula 3×3.
    // Eje X (P1): variedad de color  → monocromático / intermedio / variado
    // Eje Y (P4): complejidad visual → simple / media / compleja
    const ZONA_LABELS = {
      '0-0': 'obras monocromáticas simples',
      '1-0': 'obras de color intermedio simples',
      '2-0': 'obras variadas simples',
      '0-1': 'obras monocromáticas de complejidad media',
      '1-1': 'obras de color intermedio y complejidad media',
      '2-1': 'obras variadas de complejidad media',
      '0-2': 'obras monocromáticas complejas',
      '1-2': 'obras de color intermedio complejas',
      '2-2': 'obras variadas y complejas',
    };

    function _zoneKey(obra, p1lo, p1hi, p4lo, p4hi) {
      const rangeP1 = p1hi - p1lo || 1;
      const rangeP4 = p4hi - p4lo || 1;
      const col = obra.P1 < p1lo + rangeP1 * 0.33 ? 0
                : obra.P1 < p1lo + rangeP1 * 0.66 ? 1 : 2;
      const row = obra.P4 < p4lo + rangeP4 * 0.33 ? 0
                : obra.P4 < p4lo + rangeP4 * 0.66 ? 1 : 2;
      return `${col}-${row}`;
    }

    function renderMapNodes() {
      if (!window.CATALOGUE) return;

      // cleanup() vacía mapOverlay.innerHTML — seguro para cualquier estructura
      cleanup();

      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      const PAD = 44;
      const { min: P1_lo, max: P1_hi } = getP1Range();
      const { min: P4_lo, max: P4_hi } = getP4Range();
      const normP1 = v => (v - P1_lo) / (P1_hi - P1_lo);
      const normP4 = v => (v - P4_lo) / (P4_hi - P4_lo);

      // Usar DocumentFragment para insertar todo en un solo reflow
      const frag = document.createDocumentFragment();

      // ── Agrupar obras por zona 3×3 ────────────────────────────────────
      // Dentro de cada zona: orden P1 asc (izq→der).
      const zoneMap = new Map();
      window.CATALOGUE.forEach(obra => {
        const key = _zoneKey(obra, P1_lo, P1_hi, P4_lo, P4_hi);
        if (!zoneMap.has(key)) zoneMap.set(key, []);
        zoneMap.get(key).push(obra);
      });
      zoneMap.forEach(obras => obras.sort((a, b) => a.P1 - b.P1));

      // Orden canónico: fila 0 (simple) → 1 (media) → 2 (compleja),
      // dentro de cada fila col 0 (monocromático) → 1 → 2 (variado).
      const zoneOrder = ['0-0','1-0','2-0','0-1','1-1','2-1','0-2','1-2','2-2'];

      // ── Escape INICIAL — swipe atrás desde la primera obra sale del mapa ──
      frag.appendChild(_makeExitNode());

      // Construir primero la lista de sections para que los saltos puedan
      // referenciar la section siguiente antes de que exista en el DOM.
      // sections[i] apunta a la section de zoneOrder[i] (zonas no vacías).
      const activeSections = [];  // { section, label } en orden canónico

      zoneOrder.forEach(zKey => {
        const obras = zoneMap.get(zKey);
        if (!obras || !obras.length) return;

        const label = ZONA_LABELS[zKey] || `zona ${zKey}`;
        const section = document.createElement('section');
        section.className = 'map-zone-section';
        section.setAttribute('aria-label',
          `${label}, ${obras.length} obra${obras.length !== 1 ? 's' : ''}`);
        // inset:0 + pointer-events:none: la section cubre todo el overlay
        // sin interferir con el puntero — los botones tienen pointer-events:auto.
        section.style.cssText = 'position:absolute;inset:0;pointer-events:none;';

        obras.forEach(obra => {
          const btn = document.createElement('button');
          btn.className = 'map-node';
          btn.type = 'button';
          btn.setAttribute('tabindex', '-1');
          btn.dataset.id = obra.id;
          const meta = findMeta(obra.id);
          btn.setAttribute('aria-label',
            `${meta.titulo}, de ${meta.artista}. ${label}. Pulsa Enter para abrir`);
          const cx = PAD + normP1(obra.P1) * (W - PAD * 2);
          const cy = PAD + (1 - normP4(obra.P4)) * (H - PAD * 2);
          btn.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;` +
            `width:44px;height:44px;transform:translate(-50%,-50%);` +
            `opacity:0;background:none;border:none;padding:0;cursor:pointer;pointer-events:auto;`;
          btn.addEventListener('click', onNodeActivate);
          btn.addEventListener('keydown', onNodeKeydown);
          section.appendChild(btn);
        });

        activeSections.push({ section, label });
      });

      // Actualizar aria-label de cada section con posición ahora que conocemos el total
      activeSections.forEach(({ section, label }, i) => {
        const total = activeSections.length;
        const pos = i + 1;
        const nObras = section.querySelectorAll('.map-node').length;
        section.setAttribute('aria-label',
          `Zona ${pos} de ${total}. ${label}. ${nObras} obra${nObras !== 1 ? 's' : ''}`);
      });

      // ── Ancla de salto al final de cada section ───────────────────────
      // Cada zona tiene DOS botones al final, visibles solo para AT:
      //   1. "Saltar a siguiente zona" (si no es la última)
      //   2. "Salir del mapa" — siempre presente en TODAS las zonas
      // Así cada categoría es una unidad cerrada con salida explícita.
      // Compatible con TalkBack (swipe derecha) y VoiceOver (swipe derecha / VO+flecha).
      const offScreen = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;white-space:nowrap;';

      function _makeZoneExitBtn() {
        const btn = document.createElement('button');
        btn.className = 'map-zone-exit';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Salir del mapa. Volver al menú principal');
        btn.style.cssText = offScreen;
        btn.addEventListener('click', () => {
          const target = document.getElementById('btn-audio-header');
          if (target) target.focus();
        });
        return btn;
      }

      activeSections.forEach(({ section, label }, i) => {
        const isLast = i === activeSections.length - 1;
        const total = activeSections.length;
        const pos = i + 1; // 1-based

        // Separador semántico: anuncia "Fin de zona N de M" antes de los botones
        const endMarker = document.createElement('button');
        endMarker.className = 'map-zone-end-marker';
        endMarker.type = 'button';
        endMarker.setAttribute('aria-label', `Fin de zona ${pos} de ${total}`);
        endMarker.style.cssText = offScreen;
        endMarker.addEventListener('click', () => {}); // no-op: solo orientación AT
        section.appendChild(endMarker);

        // Botón A: saltar a siguiente zona (todas excepto la última)
        if (!isLast) {
          const skipBtn = document.createElement('button');
          skipBtn.className = 'map-zone-skip';
          skipBtn.type = 'button';
          skipBtn.setAttribute('aria-label', `Saltar a zona ${pos + 1}`);
          skipBtn.style.cssText = offScreen;
          skipBtn.addEventListener('click', () => {
            const nextSection = activeSections[i + 1].section;
            const firstNode = nextSection.querySelector('.map-node');
            if (firstNode) {
              _getNodes().forEach(n => n.setAttribute('tabindex', '-1'));
              firstNode.setAttribute('tabindex', '0');
              firstNode.focus();
            }
          });
          section.appendChild(skipBtn);
        }

        // Botón B: salir del mapa — presente en TODAS las zonas
        const exitBtn = _makeZoneExitBtn();
        exitBtn.setAttribute('aria-label', 'Salir del mapa');
        section.appendChild(exitBtn);

        frag.appendChild(section);
      });

      // ── Escape FINAL — swipe adelante desde la última obra sale del mapa ──
      frag.appendChild(_makeExitNode());

      // Un solo reflow: insertar todo el árbol de una vez
      mapOverlay.appendChild(frag);
    }

    // ── Roving tabindex: navegación por flechas dentro del mapa ──────
    // Los nodos tienen tabindex="-1". El foco entra al mapa por mapWrap
    // (tabindex="0"). Flechas mueven el foco entre nodos. Tab/Escape salen.
    let _rovingIdx = -1;

    function _getNodes() {
      return Array.from(mapOverlay.querySelectorAll('.map-node'));
    }

    function _rovingFocus(idx) {
      const nodes = _getNodes();
      if (!nodes.length) return;
      _rovingIdx = Math.max(0, Math.min(idx, nodes.length - 1));
      nodes.forEach((n, i) => n.setAttribute('tabindex', i === _rovingIdx ? '0' : '-1'));
      nodes[_rovingIdx].focus();
    }

    function _sortedByP1(nodes) {
      // Orden izq→der por P1 (variedad de color)
      return nodes.slice().sort((a, b) => {
        const idA = a.dataset.id, idB = b.dataset.id;
        const oA = window.CATALOGUE.find(o => o.id === idA);
        const oB = window.CATALOGUE.find(o => o.id === idB);
        return (oA?.P1 || 0) - (oB?.P1 || 0);
      });
    }

    // Cuando mapWrap recibe foco (Tab desde header), el aria-label anuncia instrucciones.
    // El foco NO se mueve automáticamente al primer nodo — espera la primera flecha.
    // Así el lector anuncia las instrucciones completas antes de que el usuario navegue.
    const mapWrapEl = document.getElementById('mapWrap');
    if (mapWrapEl) {
      mapWrapEl.addEventListener('focus', () => {
        // El aria-label del mapWrap se anuncia aquí automáticamente por el lector.
        // No hacemos nada más — el usuario decide cuándo empieza a navegar.
      });

      mapWrapEl.addEventListener('keydown', e => {
        const nodes = _getNodes();
        if (!nodes.length) return;
        const sorted = _sortedByP1(nodes);
        const curNode = document.activeElement;
        const curSortedIdx = sorted.indexOf(curNode);

        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          // Primera flecha: si ningún nodo está activo, empezar desde el extremo correcto
          let next;
          if (curSortedIdx === -1) {
            next = e.key === 'ArrowRight' ? sorted[0] : sorted[sorted.length - 1];
          } else {
            next = e.key === 'ArrowRight'
              ? sorted[Math.min(curSortedIdx + 1, sorted.length - 1)]
              : sorted[Math.max(curSortedIdx - 1, 0)];
          }
          const nextIdx = nodes.indexOf(next);
          _rovingFocus(nextIdx);

          // Anuncio enriquecido: título, artista, posición, zona
          const id = next.dataset.id;
          const obra = window.CATALOGUE.find(o => o.id === id);
          const meta = window.ArgiraMapExplorer?.findMeta(id);
          if (meta && obra) {
            const nextSortedIdx = sorted.indexOf(next);
            const pos = nextSortedIdx + 1; // 1-based
            const total = sorted.length;
            const { min: _p1lo, max: _p1hi } = getP1Range();
            const { min: _p4lo, max: _p4hi } = getP4Range();
            const zonaDesc = ZONA_LABELS[_zoneKey(obra, _p1lo, _p1hi, _p4lo, _p4hi)] || '';
            next.setAttribute('aria-label',
              `${meta.titulo}, ${meta.artista}. ${zonaDesc}. Obra ${pos} de ${total}. Pulsa Enter para abrir.`
            );
          }
        }

        if (e.key === 'Tab' || e.key === 'Escape') {
          // Salir del mapa: restaurar tabindex y mover foco al header
          nodes.forEach(n => n.setAttribute('tabindex', '-1'));
          _rovingIdx = -1;
          if (e.key === 'Escape') {
            e.preventDefault();
            const btnAyuda = document.getElementById('btn-ayuda');
            if (btnAyuda) btnAyuda.focus();
          }
          // Tab nativo sigue su curso normal hacia el siguiente elemento
        }
      });
    }

    syncOverlaySize();
    requestAnimationFrame(() => requestAnimationFrame(renderMapNodes));
    const ro = new ResizeObserver(() => { syncOverlaySize(); renderMapNodes(); });
    ro.observe(canvas);
    window.ArgiraMapOverlay = mapOverlay;
    window.ArgiraRenderMapNodes = renderMapNodes;
    return true;
  }

  // ------------------------------------------------------------------
  // 5. INTERACCIÓN UNIFICADA (pointerup) — REACTIVADO
  // ------------------------------------------------------------------
  // Restaurado al comportamiento de la versión anterior que funcionaba:
  // tap simple sobre un nodo abre el modal directamente. El sistema de
  // doble-tap añadido en index.html (_tryOpenModalAtPoint) dependía de
  // que window.ArgiraMapExplorer ya existiera en el momento exacto del
  // gesto, lo cual resultó frágil. Este sistema, al vivir dentro del
  // propio map-explorer.js, no tiene ese problema de timing: solo se
  // registra una vez que el módulo ya terminó de inicializarse.
  // index.html ya no debe abrir el modal por su cuenta — solo ancla
  // (setAnchorFromHover) en pointerup, sin lógica de doble tap.
  function initPointerInteraction() {
    const mapWrap = document.getElementById('mapWrap');
    if (!mapWrap) return false;

    function handlePointerUp(e) {
      // Modelo de interacción:
      //   Ratón / touch normal → tap simple (sin arrastre) abre modal
      //   Arrastre real → solo explora/ancla el mapa, NO abre modal
      //   TalkBack / VoiceOver → doble toque nativo del AT activa el click del nodo
      // window._argiraPtrMoved lo marca index.html en pointermove cuando el
      // desplazamiento supera TAP_MOVE_THRESHOLD_PX. Antes esta función abría
      // el modal en CUALQUIER pointerup, incluso tras arrastrar — por eso
      // soltar el dedo después de explorar el mapa abría la obra más cercana
      // al punto de suelta de forma inesperada.
      if (window._argiraPtrMoved) return;

      const obra = clientToNearest(e.clientX, e.clientY);
      if (!obra) return;
      const meta = findMeta(obra.id);

      // Cancelar cualquier anuncio SR pendiente del hover anterior
      clearTimeout(window._anchorAnnounceTid);
      const srAnnouncer = document.getElementById('sr-announcer');
      if (srAnnouncer) { srAnnouncer.textContent = ''; }

      openModal(meta);
    }

    if (!overlayListenersAttached) {
      mapWrap.addEventListener('pointerup', handlePointerUp, { passive: true });
      overlayListenersAttached = true;
    }
    return true;
  }

  // ------------------------------------------------------------------
  // 6. ARRANQUE POR EVENTOS (SIN POLLING)
  // ------------------------------------------------------------------
  let isInitialized = false;

  function initialize() {
    if (isInitialized) return;
    const canvas = document.getElementById('map');
    const catalogue = window.CATALOGUE;
    if (!canvas || !catalogue || !catalogue.length) return;
    
    initOverlayAndNodes();
    initPointerInteraction();
    isInitialized = true;
    console.log('✅ ARGIRA Map Explorer: inicializado correctamente');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  window.addEventListener('argira:catalogue-ready', initialize);

  // ------------------------------------------------------------------
  // 7. API PÚBLICA
  // ------------------------------------------------------------------
  window.ArgiraMapExplorer = {
    open: openModal,
    close: closeModal,
    findMeta: findMeta,
    clientToNearest: clientToNearest,
    syncNodes: () => window.ArgiraRenderMapNodes?.(),
    overlay: () => document.getElementById('map-overlay'),
  };
  console.log('[ARGIRA] map-explorer.js: IIFE completo, ArgiraMapExplorer expuesto');
})();