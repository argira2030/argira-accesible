// ================================================================
//  ARGIRA · MAP EXPLORER · ARRANQUE POR EVENTOS (SIN POLLING)
//  ================================================================
(function() {
  'use strict';

  // ------------------------------------------------------------------
  // 1. METADATOS DE OBRAS (OBRA_META + ALIASES)
  // ------------------------------------------------------------------
  const OBRA_META = {
    'Rembrandt · Self-Portrait_1659': {
      titulo: 'Autorretrato (1659)',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Autorretrato tardío de Rembrandt. La luz emerge de la oscuridad con la técnica del claroscuro más depurada. El rostro envejecido mira directamente, sin idealización ni concesión.',
      img: '500px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg',
      audio: '500px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.wav',
    },
    'Malevich · White_on_White': {
      titulo: 'Blanco sobre Blanco',
      artista: 'Kazimir Malevich',
      descripcion: 'Suprematismo en su estado más puro: dos cuadrados blancos, uno girado levemente sobre el otro. Ausencia total de color cromático. El silencio visual hecho pintura.',
      img: 'White_on_White_(Malevich,_1918).png',
      audio: 'White_on_White_(Malevich,_1918).wav',
    },
    'Malevich · Black_Square': {
      titulo: 'Cuadrado Negro',
      artista: 'Kazimir Malevich',
      descripcion: 'Icono del Suprematismo. Un cuadrado negro sobre fondo blanco, sin representación de ningún objeto real. Simboliza la «sensación pura» liberada de toda referencia figurativa.',
      img: 'Kazimir_Malevich,_1915,_Black_Suprematic_Square,_oil_on_linen_canvas,_79.5_x_79.5_cm,_Tretyakov_Gallery,_Moscow.jpg',
      audio: 'Kazimir_Malevich,_1915,_Black_Suprematic_Square,_oil_on_linen_canvas,_79.5_x_79.5_cm,_Tretyakov_Gallery,_Moscow.wav',
    },
    'Rembrandt · Self-Portrait': {
      titulo: 'Autorretrato',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Autorretrato de Rembrandt con su maestría inconfundible del claroscuro. La luz modela el rostro desde la sombra, revelando una presencia intensa y meditativa.',
      img: '500px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg',
      audio: '500px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.wav',
    },
    'Velazquez · Las_Meninas': {
      titulo: 'Las Meninas',
      artista: 'Diego Velázquez',
      descripcion: 'La obra maestra del Barroco español. Velázquez se retrata pintando mientras la infanta Margarita y su séquito ocupan el primer plano. El espejo al fondo revela a los reyes. Un enigma visual sobre la representación y la mirada.',
      img: 'Las_Meninas,_by_Diego_Velázquez,_from_Prado_in_Google_Earth.jpg',
      audio: 'Las_Meninas,_by_Diego_Velázquez,_from_Prado_in_Google_Earth.wav',
    },
    'Rembrandt · La_Ronda_de_Noche': {
      titulo: 'La Ronda de Noche',
      artista: 'Rembrandt van Rijn',
      descripcion: 'La obra más célebre de Rembrandt. Una compañía de milicianos emerge de la oscuridad con dramatismo teatral. La luz cae de forma selectiva sobre las figuras, creando una composición en perpetuo movimiento.',
      img: 'La_ronda_de_noche,_por_Rembrandt_van_Rijn.jpg',
      audio: 'La_ronda_de_noche,_por_Rembrandt_van_Rijn.wav',
    },
    'Leonardo · Mona_Lisa': {
      titulo: 'La Gioconda',
      artista: 'Leonardo da Vinci',
      descripcion: 'El retrato más famoso del mundo. La sonrisa ambigua de Lisa Gherardini y el paisaje esfumado del fondo desafían cualquier interpretación definitiva. El sfumato de Leonardo disuelve los contornos en atmósfera.',
      img: 'Leonardo_da_Vinci_-_Mona_Lisa_(Louvre,_Paris).jpg',
      audio: 'Leonardo_da_Vinci_-_Mona_Lisa_(Louvre,_Paris).wav',
    },
    'Klimt · Adele_Bloch-Bauer': {
      titulo: 'Retrato de Adele Bloch-Bauer I',
      artista: 'Gustav Klimt',
      descripcion: 'La «Mona Lisa austriaca». Adele Bloch-Bauer emerge de un mosaico de pan de oro, espirales y ojos egipcios. El cuerpo se disuelve en ornamento. La máxima expresión del período dorado de Klimt.',
      img: 'Gustav_Klimt_039.jpg',
      audio: 'Gustav_Klimt_039.wav',
    },
    'Botticelli · La_nascita_di_Venere': {
      titulo: 'El Nacimiento de Venus',
      artista: 'Sandro Botticelli',
      descripcion: 'Venus emerge del mar sobre una concha, impulsada por los vientos. Línea sinuosa, paleta de rosas y verdes delicados. El ideal de belleza renacentista florentino cristalizado en temple sobre lienzo.',
      img: 'Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
      audio: 'Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.wav',
    },
    'Kandinsky · Composition_8': {
      titulo: 'Composición VIII',
      artista: 'Wassily Kandinsky',
      descripcion: 'Triángulos, círculos y líneas interactúan sobre fondo claro en una sinfonía visual. Kandinsky codifica aquí su teoría del color y la forma como equivalentes de sonidos musicales. Abstracción total al servicio de la emoción.',
      img: 'Kandinsky_-_Composition_8,_July_1923.jpg',
      audio: 'Kandinsky_-_Composition_8,_July_1923.wav',
    },
    'Monet · Field_of_Poppies': {
      titulo: 'Campo de Amapolas',
      artista: 'Claude Monet',
      descripcion: 'Un campo de amapolas rojas bajo el cielo de verano francés. Manchas de color puro, sin contorno definido. La vibración del color sobre el lienzo recrea la sensación fugaz de la luz al mediodía.',
      img: 'field-of-poppies.jpg!Large.jpg',
      audio: 'field-of-poppies.jpg!Large.wav',
    },
    'Turner · Fighting_Temeraire': {
      titulo: 'El Temerario',
      artista: 'J.M.W. Turner',
      descripcion: 'El viejo navío de guerra Temeraire es remolcado a su último puerto por un vaporcito negro. El sol se pone sobre la era de la vela. Turner convierte la nostalgia industrial en una elegía de luz y niebla.',
      img: 'The_Fighting_Temeraire,_JMW_Turner,_National_Gallery.jpg',
      audio: 'The_Fighting_Temeraire,_JMW_Turner,_National_Gallery.wav',
    },
    'Degas · Ballet_Class': {
      titulo: 'La Clase de Ballet',
      artista: 'Edgar Degas',
      descripcion: 'El maestro Jules Perrot dirige el ensayo mientras las bailarinas esperan su turno. Espacio escénico complejo, perspectiva oblicua, luz difusa de estudio. Degas capta el trabajo invisible detrás de la ilusión del ballet.',
      img: 'Edgar_Degas_-_The_Ballet_Class_-_Google_Art_Project.jpg',
      audio: 'Edgar_Degas_-_The_Ballet_Class_-_Google_Art_Project.wav',
    },
    'Monet · Cliff_Walk': {
      titulo: 'Acantilados de Pourville',
      artista: 'Claude Monet',
      descripcion: 'Dos figuras femeninas en lo alto del acantilado, bajo un cielo normando. Pinceladas vibrantes capturan el movimiento del viento y el brillo del mar. Impresionismo pleno.',
      img: 'Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.jpg',
      audio: 'Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.wav',
    },
    'Hopper · Morning_Sun': {
      titulo: 'Morning Sun',
      artista: 'Edward Hopper',
      descripcion: 'Una mujer sentada en la cama, bañada por la luz de la mañana. Soledad urbana norteamericana. Colores cálidos pero contenidos, composición geométrica, silencio palpable.',
      img: 'EdwardHopperMorningSun1952.jpg',
      audio: 'EdwardHopperMorningSun1952.wav',
    },
    'Vermeer · Het_melkmeisje': {
      titulo: 'La Lechera',
      artista: 'Johannes Vermeer',
      descripcion: 'Una criada vierte leche con concentración absoluta. Luz de ventana difusa y precisa. Azules y amarillos en equilibrio casi musical. Una escena cotidiana convertida en eternidad.',
      img: 'Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.png',
      audio: 'Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.wav',
    },
    'Monet · Impression_Soleil_Levant': {
      titulo: 'Impresión, Sol Naciente',
      artista: 'Claude Monet',
      descripcion: 'El cuadro que dio nombre al Impresionismo. El puerto de El Havre al amanecer: un disco solar naranja sobre agua gris azulada. La pincelada libre y la captura del instante como programa estético.',
      img: 'claude-monet-Impression-soleil-levant-1872-Musee-Marmottan-Monet-Paris-©-SLB-Christian-Baraja.jpg',
      audio: 'claude-monet-Impression-soleil-levant-1872-Musee-Marmottan-Monet-Paris-©-SLB-Christian-Baraja.wav',
    },
    'Kandinsky · Several_Circles': {
      titulo: 'Varios Círculos',
      artista: 'Wassily Kandinsky',
      descripcion: 'Círculos de colores puros flotan sobre fondo negro. Para Kandinsky, cada color tiene una resonancia espiritual y musical. Este cuadro es casi una partitura visual del cosmos interior.',
      img: 'este.jpg',
      audio: 'este.wav',
    },
    'Cezanne · Madame_Cezanne': {
      titulo: 'Madame Cézanne en Sillón Amarillo',
      artista: 'Paul Cézanne',
      descripcion: 'Retrato de Hortense Fiquet, esposa de Cézanne. La figura se construye con pinceladas moduladas que aplanan el espacio. La misma paciente geometrización que aplica a las manzanas y a la montaña.',
      img: 'Paul_Cézanne_-_Madame_Cézanne_In_A_Yellow_Armchair_-_Google_Art_Project.jpg',
      audio: 'Paul_Cézanne_-_Madame_Cézanne_In_A_Yellow_Armchair_-_Google_Art_Project.wav',
    },
    'Van_Gogh · Korenveld_met_kraaien': {
      titulo: 'Campo de Trigo con Cuervos',
      artista: 'Vincent van Gogh',
      descripcion: 'Una de las últimas obras de Van Gogh. Un camino se bifurca bajo un cielo turbulento y cuervos negros. Pinceladas en espiral expresan angustia y al mismo tiempo amor apasionado por la tierra.',
      img: '1280px-Korenveld_met_kraaien_-_s0149V1962_-_Van_Gogh_Museum.jpg',
      audio: '1280px-Korenveld_met_kraaien_-_s0149V1962_-_Van_Gogh_Museum.wav',
    },
    'Renoir · Moulin_de_la_Galette': {
      titulo: 'Le Moulin de la Galette',
      artista: 'Pierre-Auguste Renoir',
      descripcion: 'Una tarde de domingo en el popular baile parisino de Montmartre. La luz se filtra entre los árboles y se fragmenta sobre los vestidos y los rostros. Alegría colectiva capturada en pinceladas vibrantes.',
      img: 'Pierre-Auguste_Renoir,_Le_Moulin_de_la_Galette.jpg',
      audio: 'Pierre-Auguste_Renoir,_Le_Moulin_de_la_Galette.wav',
    },
    'Degas · Bailarinas_Azules': {
      titulo: 'Bailarinas Azules',
      artista: 'Edgar Degas',
      descripcion: 'Cuatro bailarinas ajustan sus trajes en un momento de pausa. El azul domina el cuadro con intensidad. Composición fragmentada, vista desde un ángulo inusual, casi fotográfico.',
      img: 'Edgar_Germain_Hilaire_Degas_076.jpg',
      audio: 'Edgar_Germain_Hilaire_Degas_076.wav',
    },
    'Seurat · Grande_Jatte': {
      titulo: 'Una tarde de domingo en la Grande Jatte',
      artista: 'Georges Seurat',
      descripcion: 'El manifiesto del Puntillismo. Cientos de puntos de color puro, aplicados con método científico, crean la escena del ocio burgués parisino a orillas del Sena. La mezcla óptica en lugar de la mezcla física.',
      img: 'Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte_--_1884_-_Google_Art_Project.jpg',
      audio: 'Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte_--_1884_-_Google_Art_Project.wav',
    },
    'Matisse · La_Danse_II': {
      titulo: 'La Danza II',
      artista: 'Henri Matisse',
      descripcion: 'Cinco figuras desnudas danzan en círculo sobre un fondo de cielo azul y tierra verde. Línea contorneada, color plano y vibrante, ausencia de perspectiva. La alegría del movimiento reducida a su esencia más pura.',
      img: 'La_Danse_II,_par_Henri_Matisse.jpg',
      audio: 'La_Danse_II,_par_Henri_Matisse.wav',
    },
    'Vermeer · Meisje_met_de_parel': {
      titulo: 'La Joven de la Perla',
      artista: 'Johannes Vermeer',
      descripcion: 'Una joven se gira y mira al espectador sobre fondo negro. La perla en su oreja —¿real o de vidrio?— capta la luz como un segundo ojo. Economía radical de medios, máxima intensidad de presencia.',
      img: 'Meisje_met_de_parel.jpg',
      audio: 'Meisje_met_de_parel.wav',
    },
    'Monet · Stack_of_Wheat_Snow': {
      titulo: 'Almiar (Efecto de Nieve)',
      artista: 'Claude Monet',
      descripcion: 'Uno de los almiares que Monet pintó en serie para estudiar el mismo motivo bajo distintas condiciones de luz. El invierno apaga los colores y los envuelve en una atmósfera silenciosa y uniforme.',
      img: 'Claude_Monet_-_Stack_of_Wheat_(Snow_Effect,_Overcast_Day).jpg',
      audio: 'Claude_Monet_-_Stack_of_Wheat_(Snow_Effect,_Overcast_Day).wav',
    },
    'Matisse · Woman_with_Hat': {
      titulo: 'Mujer con Sombrero',
      artista: 'Henri Matisse',
      descripcion: 'Retrato de Amélie Matisse con un exuberante sombrero. Los colores del rostro —verdes, rosas, naranjas— escandalizaron en 1905. Obra fundacional del Fauvismo: el color como emoción pura, no como descripción.',
      img: 'Matisse-Woman-with-a-Hat.jpg',
      audio: 'Matisse-Woman-with-a-Hat.wav',
    },
    'Kandinsky · Jaune_Rouge_Bleu': {
      titulo: 'Amarillo Rojo Azul',
      artista: 'Wassily Kandinsky',
      descripcion: 'Composición abstracta en la que los tres colores primarios organizan el espacio. Líneas, curvas y manchas interactúan como instrumentos en una sinfonía. El cuadro más cromático del catálogo.',
      img: '3840px-Kandinsky_-_Jaune_Rouge_Bleu.jpg',
      audio: '3840px-Kandinsky_-_Jaune_Rouge_Bleu.wav',
    },
    'Matisse · La_Desserte_Rouge': {
      titulo: 'La Mesa Roja',
      artista: 'Henri Matisse',
      descripcion: 'Una habitación donde el rojo lo invade todo: mesa, paredes, decoración. Los patrones arabescos vibran sobre el rojo intenso. Color liberado de la forma, música hecha pintura.',
      img: 'La_Desserte_rouge,_par_Henri_Matisse.jpg',
      audio: 'La_Desserte_rouge,_par_Henri_Matisse.wav',
    },
    'Goya · Maja_Desnuda': {
      titulo: 'La Maja Desnuda',
      artista: 'Francisco de Goya',
      descripcion: 'Una de las primeras representaciones de un desnudo femenino sin pretexto mitológico en la historia del arte occidental. La maja mira directamente al espectador con una audacia que escandalizó a la Inquisición.',
      img: 'Goya_Maja_naga2.jpg',
      audio: 'Goya_Maja_naga2.wav',
    },
    // ── Obras extra del catálogo grande ───────────────────────────────
    '1280px-Idylle': {
      titulo: 'Idylle (Fabel)',
      artista: 'Gustav Klimt',
      descripcion: 'Obra temprana de Klimt de influencia academicista. Figuras alegóricas en un ambiente idílico antes de que el artista desarrollara su característico lenguaje ornamental dorado.',
      img: '1280px-Idylle.jpg',
      audio: '1280px-Idylle.wav',
    },
    '1280px-Philosophy-final-state-1907': {
      titulo: 'Filosofía (estado final, 1907)',
      artista: 'Gustav Klimt',
      descripcion: 'Una de las pinturas para la Universidad de Viena que provocaron un escándalo mayúsculo. Figuras flotantes, cuerpos entrelazados en el cosmos y una esfinge emergen de la oscuridad. Fue destruida en 1945.',
      img: '1280px-Philosophy-final-state-1907.jpg',
      audio: '1280px-Philosophy-final-state-1907.wav',
    },
    'Barco de esclavos_William Turner': {
      titulo: 'El Barco Negrero',
      artista: 'J.M.W. Turner',
      descripcion: 'Un buque arroja esclavos al mar durante una tormenta para cobrar el seguro. El cielo y el océano se funden en una catástrofe cromática de naranjas y rojos. La pintura más políticamente cargada de Turner.',
      img: 'Barco de esclavos_William Turner.jpg',
      audio: 'Barco de esclavos_William Turner.wav',
    },
    'Dante-und-Virgil-in-der-Hoelle-Die-Dante-Barke-2': {
      titulo: 'La Barca de Dante',
      artista: 'Eugène Delacroix',
      descripcion: 'Dante y Virgilio cruzan la laguna Estigia mientras los condenados se aferran a la barca. Romanticismo puro: dramatismo, color intenso y movimiento convulso. Delacroix tenía 24 años cuando la pintó.',
      img: 'Dante-und-Virgil-in-der-Hoelle-Die-Dante-Barke-2.jpg',
      audio: 'Dante-und-Virgil-in-der-Hoelle-Die-Dante-Barke-2.wav',
    },
    'Diego_Velazquez_An_Old_Woman_Cooking_Eggs': {
      titulo: 'Vieja Friendo Huevos',
      artista: 'Diego Velázquez',
      descripcion: 'Una anciana fríe huevos mientras un niño observa. Velázquez tenía 19 años y ya dominaba la luz sobre superficies diversas: cerámica, metal, yema, piel. Bodegón de cocina elevado a obra maestra.',
      img: 'Diego_Velazquez_An_Old_Woman_Cooking_Eggs.jpg',
      audio: 'Diego_Velazquez_An_Old_Woman_Cooking_Eggs.wav',
    },
    'Diego_Velázquez_Rokeby_Venus': {
      titulo: 'La Venus del Espejo',
      artista: 'Diego Velázquez',
      descripcion: 'El único desnudo femenino conocido de Velázquez. Venus yace de espaldas mientras Cupido sostiene un espejo que refleja su rostro ambiguo. Elegancia y misterio en una obra que desafió la moral de su época.',
      img: 'Diego_Velázquez_Rokeby_Venus.jpg',
      audio: 'Diego_Velázquez_Rokeby_Venus.wav',
    },
    'Edgar_DegasInterior': {
      titulo: 'Interior (La Violación)',
      artista: 'Edgar Degas',
      descripcion: 'Una habitación de noche: un hombre de pie, una mujer encogida. La lámpara central divide el espacio en zonas de tensión. La obra más oscura y narrativamente críptica de Degas.',
      img: 'Edgar_DegasInterior.jpg',
      audio: 'Edgar_DegasInterior.wav',
    },
    'Edgar_DegasThe_Bellelli_Family': {
      titulo: 'La Familia Bellelli',
      artista: 'Edgar Degas',
      descripcion: 'Retrato familiar de gran formato que Degas tardó años en terminar. La baronesa y sus hijas forman un bloque compacto; el barón, sentado de espaldas, está separado. Una radiografía fría de las tensiones domésticas.',
      img: 'Edgar_DegasThe_Bellelli_Family.jpg',
      audio: 'Edgar_DegasThe_Bellelli_Family.wav',
    },
    'Edgar_Degas_Ballet_Rehearsal_on_Stage': {
      titulo: 'Ensayo de Ballet en el Escenario',
      artista: 'Edgar Degas',
      descripcion: 'Vista desde las bambalinas durante un ensayo. Degas usa una perspectiva inhabitual y la luz de candilejas para crear un espacio escénico irreal. Las bailarinas son figuras en espera, no protagonistas.',
      img: 'Edgar_Degas_Ballet_Rehearsal_on_Stage.jpg',
      audio: 'Edgar_Degas_Ballet_Rehearsal_on_Stage.wav',
    },
    'Edgar_Degas_Chasse_de_danse': {
      titulo: 'Chassé de Danse',
      artista: 'Edgar Degas',
      descripcion: 'Bailarinas en movimiento capturadas en el instante del paso de danza. Paleta suave, composición fragmentada. Degas estudia el cuerpo en acción con la mirada analítica de un anatomista.',
      img: 'Edgar_Degas_Chasse_de_danse.jpg',
      audio: 'Edgar_Degas_Chasse_de_danse.wav',
    },
    'Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway': {
      titulo: 'El Grito',
      artista: 'Edvard Munch',
      descripcion: 'Una figura de rasgos disueltos abre la boca ante un cielo en llamas. Munch describió la experiencia como sentir el grito infinito de la naturaleza. Icono universal de la angustia existencial moderna.',
      img: 'Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.jpg',
      audio: 'Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.wav',
    },
    'ElRetornoDelHijoProdigo-Rembrant': {
      titulo: 'El Retorno del Hijo Pródigo',
      artista: 'Rembrandt van Rijn',
      descripcion: 'El hijo arrodillado recibe el abrazo del padre anciano. Una de las obras más conmovedoras de Rembrandt: la luz cae sobre las manos del padre como una bendición. Pintura de perdón y compasión sin palabras.',
      img: 'ElRetornoDelHijoProdigo-Rembrant.jpg',
      audio: 'ElRetornoDelHijoProdigo-Rembrant.wav',
    },
    'Elajenjo': {
      titulo: 'El Ajenjo',
      artista: 'Edgar Degas',
      descripcion: 'Un hombre y una mujer en un café parisino, cada uno ensimismado en su copa de ajenjo. Distancia entre cuerpos que comparten mesa. Retrato sin piedad del aislamiento urbano y el vicio silencioso.',
      img: 'Elajenjo.jpg',
      audio: 'Elajenjo.wav',
    },
    'Gustav_Klimt_046': {
      titulo: 'El Beso',
      artista: 'Gustav Klimt',
      descripcion: 'Una pareja se funde en un abrazo sobre un fondo dorado. Los mantos ornamentados los envuelven hasta hacerlos indistinguibles. El amor como disolución del individuo en el ornamento y en el otro.',
      img: 'Gustav_Klimt_046.jpg',
      audio: 'Gustav_Klimt_046.wav',
    },
    'Gustav_Klimt_Blind_Man': {
      titulo: 'El Ciego',
      artista: 'Gustav Klimt',
      descripcion: 'Figura masculina de pie con los ojos cerrados o ciegos. Klimt explora aquí la vulnerabilidad del cuerpo con una sobriedad inusual, alejada del ornamento dorado de su período más célebre.',
      img: 'Gustav_Klimt_Blind_Man.jpg',
      audio: 'Gustav_Klimt_Blind_Man.wav',
    },
    'Gustav_Klimt_Fakultatsbild_Die_Medizin': {
      titulo: 'La Medicina',
      artista: 'Gustav Klimt',
      descripcion: 'Segunda de las pinturas universitarias: una columna de cuerpos humanos flotantes —vida, enfermedad, muerte— se eleva junto a Higía. Destruida en 1945. Se conserva en fotografías y estudios preparatorios.',
      img: 'Gustav_Klimt_Fakultatsbild_Die_Medizin.jpg',
      audio: 'Gustav_Klimt_Fakultatsbild_Die_Medizin.wav',
    },
    'Gustav_Klimt_Tranquil_PondEgelsee_near_Golling_Salzburg': {
      titulo: 'Estanque en Calma (Egelsee)',
      artista: 'Gustav Klimt',
      descripcion: 'Vista cenital de un estanque cubierto de vegetación acuática. Sin horizonte, sin figura humana. El agua y los reflejos forman un tapiz abstracto. La naturaleza como ornamento puro.',
      img: 'Gustav_Klimt_Tranquil_PondEgelsee_near_Golling_Salzburg.jpg',
      audio: 'Gustav_Klimt_Tranquil_PondEgelsee_near_Golling_Salzburg.wav',
    },
    'Joseph_Mallord_William_Turner,_English_-_The_Burning_of_the_Houses_of_Lords_and_Commons,_October_16,_1834_-_Google_Art_Project': {
      titulo: 'El Incendio de las Cámaras del Parlamento',
      artista: 'J.M.W. Turner',
      descripcion: 'El incendio real de Westminster en 1834, visto desde el puente de Waterloo. La ciudad se convierte en una hoguera reflejada en el Támesis. Turner lo presenció y tomó apuntes en el lugar.',
      img: 'Joseph_Mallord_William_Turner,_English_-_The_Burning_of_the_Houses_of_Lords_and_Commons,_October_16,_1834_-_Google_Art_Project.jpg',
      audio: 'Joseph_Mallord_William_Turner,_English_-_The_Burning_of_the_Houses_of_Lords_and_Commons,_October_16,_1834_-_Google_Art_Project.wav',
    },
    'Joseph_Mallord_William_Turner_Fishermen_at_Sea': {
      titulo: 'Pescadores en el Mar',
      artista: 'J.M.W. Turner',
      descripcion: 'Primera obra de Turner expuesta en la Royal Academy. Una barca de pesca nocturna bajo la luna, rodeada de oscuridad y olas. Ya aparece el dramatismo lumínico que definirá toda su carrera.',
      img: 'Joseph_Mallord_William_Turner_Fishermen_at_Sea.jpg',
      audio: 'Joseph_Mallord_William_Turner_Fishermen_at_Sea.wav',
    },
    'JuditYolofernes': {
      titulo: 'Judith y Holofernes',
      artista: 'Caravaggio',
      descripcion: 'Judith decapita al general asirio con expresión concentrada y distante. La criada observa desde las sombras. Caravaggio usa el tenebrismo para hacer la violencia cotidiana y casi doméstica.',
      img: 'JuditYolofernes.jpg',
      audio: 'JuditYolofernes.wav',
    },
    'Jurisprudence-final-state-1907': {
      titulo: 'Jurisprudencia (estado final, 1907)',
      artista: 'Gustav Klimt',
      descripcion: 'Tercera pintura universitaria: un hombre anciano y encogido es apresado por tentáculos de pulpo ante las figuras de la Verdad, la Justicia y la Ley. La obra más oscura del ciclo, también destruida en 1945.',
      img: 'Jurisprudence-final-state-1907.jpg',
      audio: 'Jurisprudence-final-state-1907.wav',
    },
    'LanoviaJudia': {
      titulo: 'La Novia Judía',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Un hombre posa su mano sobre el pecho de una mujer en un gesto de ternura solemne. La identidad de los personajes es incierta. Van Gogh escribió que daría diez años de vida por contemplarla dos semanas.',
      img: 'LanoviaJudia.jpg',
      audio: 'LanoviaJudia.wav',
    },
    'Latormentaenelmar': {
      titulo: 'La Tormenta en el Mar',
      artista: 'J.M.W. Turner',
      descripcion: 'Vórtice de luz y agua: el mar en tormenta como fuerza abstracta que devora la forma. Turner, según la leyenda, se hizo atar al mástil de un barco para observar una tormenta de cerca.',
      img: 'Latormentaenelmar.jpg',
      audio: 'Latormentaenelmar.wav',
    },
    'Lavendimia': {
      titulo: 'La Vendimia',
      artista: 'Francisco de Goya',
      descripcion: 'Escena festiva de la recogida de la uva. Colores cálidos, figuras populares en el campo. Uno de los cartones para tapices de la fábrica real, cuando Goya aún pintaba la vida cotidiana con optimismo.',
      img: 'Lavendimia.jpg',
      audio: 'Lavendimia.wav',
    },
    'Lecciondeanatomia': {
      titulo: 'La Lección de Anatomía del Dr. Tulp',
      artista: 'Rembrandt van Rijn',
      descripcion: 'El doctor Nicolaes Tulp disecciona un brazo ante siete estudiantes de medicina. Rembrandt tenía 26 años. La composición triangular y la luz sobre el cadáver convierten una práctica médica en teatro moral.',
      img: 'Lecciondeanatomia.jpg',
      audio: 'Lecciondeanatomia.wav',
    },
    'Nighthawks_by_Edward_Hopper_1942': {
      titulo: 'Nighthawks',
      artista: 'Edward Hopper',
      descripcion: 'Una cafetería nocturna en una ciudad vacía. Cuatro figuras bajo la luz de neón, incomunicadas. La obra más icónica de Hopper es también la más precisa sobre la soledad en la ciudad moderna americana.',
      img: 'Nighthawks_by_Edward_Hopper_1942.jpg',
      audio: 'Nighthawks_by_Edward_Hopper_1942.wav',
    },
    'Paul_Cézanne_-_Montagne_Saint-victoire_-_Google_Art_Project': {
      titulo: 'La Montaña Sainte-Victoire',
      artista: 'Paul Cézanne',
      descripcion: 'Cézanne pintó esta montaña provenzal más de ochenta veces. Cada versión desmonta la perspectiva clásica y construye la forma con planos de color modulados. El puente entre el Impresionismo y el Cubismo.',
      img: 'Paul_Cézanne_-_Montagne_Saint-victoire_-_Google_Art_Project.jpg',
      audio: 'Paul_Cézanne_-_Montagne_Saint-victoire_-_Google_Art_Project.wav',
    },
    'Paul_Cézanne_-_The_Basket_of_Apples_-_1926.252_-_Art_Institute_of_Chicago': {
      titulo: 'La Cesta de Manzanas',
      artista: 'Paul Cézanne',
      descripcion: 'Un bodegón donde los puntos de vista son múltiples e incompatibles: la cesta, la botella y el mantel pertenecen a distintos sistemas de perspectiva. La inestabilidad es la estructura misma del cuadro.',
      img: 'Paul_Cézanne_-_The_Basket_of_Apples_-_1926.252_-_Art_Institute_of_Chicago.jpg',
      audio: 'Paul_Cézanne_-_The_Basket_of_Apples_-_1926.252_-_Art_Institute_of_Chicago.wav',
    },
    'Retrato_de_Juan_Pareja_by_Diego_Velázquez': {
      titulo: 'Retrato de Juan de Pareja',
      artista: 'Diego Velázquez',
      descripcion: 'Retrato del esclavo y asistente de Velázquez, pintado en Roma. La mirada directa y la dignidad de la figura escandalizaron a quienes sabían que el retratado era esclavo. Fue expuesto en el Panteón y admirado por toda Roma.',
      img: 'Retrato_de_Juan_Pareja_by_Diego_Velázquez.jpg',
      audio: 'Retrato_de_Juan_Pareja_by_Diego_Velázquez.wav',
    },
    'RouenCathedral_Monet_1894': {
      titulo: 'La Catedral de Rouen',
      artista: 'Claude Monet',
      descripcion: 'Una de las series más radicales de Monet: la misma fachada gótica bajo distintas horas y condiciones de luz. La piedra se convierte en atmósfera, en color puro. El motivo no es el edificio sino la luz que lo transforma.',
      img: 'RouenCathedral_Monet_1894.jpg',
      audio: 'RouenCathedral_Monet_1894.wav',
    },
    'Surprised-Rousseau': {
      titulo: 'Sorprendida (Tormenta en la Selva)',
      artista: 'Henri Rousseau',
      descripcion: 'Una tigresa avanza entre la vegetación durante una tormenta. Rousseau, aduanero sin formación académica, pintó selvas que nunca vio con una precisión onírica y una intensidad que los surrealistas admirarían décadas después.',
      img: 'Surprised-Rousseau.jpg',
      audio: 'Surprised-Rousseau.wav',
    },
    'TheStandardBearer': {
      titulo: 'El Abanderado',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Un joven portaestandarte gira con su bandera desplegada. La luz dorada sobre el traje y el gesto arrogante contrastan con el fondo neutro. Obra de juventud que muestra ya el dominio de Rembrandt sobre la textura y la luz.',
      img: 'TheStandardBearer.jpg',
      audio: 'TheStandardBearer.wav',
    },
    'TurnerDido': {
      titulo: 'Dido Construyendo Cartago',
      artista: 'J.M.W. Turner',
      descripcion: 'Dido supervisa la construcción de Cartago bañada en una luz mediterránea dorada. Turner la consideraba su obra maestra y la legó a la National Gallery con la condición de que colgara junto a paisajes de Claude Lorrain.',
      img: 'TurnerDido.jpg',
      audio: 'TurnerDido.wav',
    },
    'TurnerRainSteam_and_Speed': {
      titulo: 'Lluvia, Vapor y Velocidad',
      artista: 'J.M.W. Turner',
      descripcion: 'Una locomotora cruza el viaducto de Maidenhead a toda velocidad bajo una tormenta de lluvia. La forma se disuelve en el movimiento y la atmósfera. Quizás la primera pintura moderna sobre la velocidad industrial.',
      img: 'TurnerRainSteam_and_Speed.jpg',
      audio: 'TurnerRainSteam_and_Speed.wav',
    },
    'Van_Gogh_-_Starry_Night_-_Google_Art_Project': {
      titulo: 'La Noche Estrellada',
      artista: 'Vincent van Gogh',
      descripcion: 'El cielo nocturno de Saint-Rémy-de-Provence se convierte en un vórtice de espirales luminosas. Pinceladas en movimiento, estrellas que estallan, un ciprés oscuro que asciende. La obra más célebre de Van Gogh.',
      img: 'Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
      audio: 'Van_Gogh_-_Starry_Night_-_Google_Art_Project.wav',
    },
    'Velazquez_de_Breda_o_Las_LanzasMuseo_del_Prado_1634-35': {
      titulo: 'La Rendición de Breda (Las Lanzas)',
      artista: 'Diego Velázquez',
      descripcion: 'El general holandés entrega las llaves de Breda al español Ambrosio Spínola, quien le recibe con cortesía. Las lanzas forman una pantalla vertical. Una rendición militar convertida en lección de dignidad mutua.',
      img: 'Velazquez_de_Breda_o_Las_LanzasMuseo_del_Prado_1634-35.jpg',
      audio: 'Velazquez_de_Breda_o_Las_LanzasMuseo_del_Prado_1634-35.wav',
    },
    'baco': {
      titulo: 'Baco',
      artista: 'Caravaggio',
      descripcion: 'Un Baco adolescente y lánguido ofrece una copa de vino al espectador. La fruta del cesto está en proceso de pudrición. Caravaggio pinta la mitología con modelos de la calle y una luz que hace la divinidad completamente carnal.',
      img: 'baco.jpg',
      audio: 'baco.wav',
    },
    'goya-saturno': {
      titulo: 'Saturno Devorando a su Hijo',
      artista: 'Francisco de Goya',
      descripcion: 'Una de las Pinturas Negras de la Quinta del Sordo. Saturno devora un cuerpo con ojos desorbitados de pánico. Goya pintó esto directamente sobre la pared de su casa, para sí mismo. Horror sin distancia estética.',
      img: 'goya-saturno.jpg',
      audio: 'goya-saturno.wav',
    },
    '41.283_ph_web-1': {
      titulo: 'Obra del Catálogo',
      artista: 'ARGIRA',
      descripcion: 'Obra del catálogo ARGIRA. Explora su sonificación en el mapa perceptual.',
      img: '41.283_ph_web-1.jpg',
      audio: '41.283_ph_web-1.wav',
    },
  };

  // ------------------------------------------------------------------
  // ID SYNONYMS: claves raw del catálogo → metadatos curados
  // Solo para IDs cuya clave en OBRA_META es "humana" (Artista · Título)
  // y no coincide literalmente con el id del catálogo.
  // ------------------------------------------------------------------
  (function buildSynonyms() {
    const S = [
      ['Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited', 'Botticelli · La_nascita_di_Venere'],
      ['La_Desserte_rouge,_par_Henri_Matisse',                                   'Matisse · La_Desserte_Rouge'],
      ['La_Danse_II,_par_Henri_Matisse',                                         'Matisse · La_Danse_II'],
      ['Matisse-Woman-with-a-Hat',                                               'Matisse · Woman_with_Hat'],
      ['Leonardo_da_Vinci_-_Mona_Lisa_(Louvre,_Paris)',                          'Leonardo · Mona_Lisa'],
      ['Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project',                 'Vermeer · Het_melkmeisje'],
      ['Meisje_met_de_parel',                                                    'Vermeer · Meisje_met_de_parel'],
      ['Kazimir_Malevich,_1915,_Black_Suprematic_Square,_oil_on_linen_canvas,_79.5_x_79.5_cm,_Tretyakov_Gallery,_Moscow', 'Malevich · Black_Square'],
      ['White_on_White_(Malevich,_1918)',                                        'Malevich · White_on_White'],
      ['Van_Gogh_-_Starry_Night_-_Google_Art_Project',                           'Van_Gogh · Starry_Night'],
      ['1280px-Korenveld_met_kraaien_-_s0149V1962_-_Van_Gogh_Museum',            'Van_Gogh · Korenveld_met_kraaien'],
      ['Kandinsky_-_Composition_8,_July_1923',                                   'Kandinsky · Composition_8'],
      ['3840px-Kandinsky_-_Jaune_Rouge_Bleu',                                    'Kandinsky · Jaune_Rouge_Bleu'],
      ['Gustav_Klimt_039',                                                        'Klimt · Adele_Bloch-Bauer'],
      // Gustav_Klimt_046 ya tiene entrada directa en OBRA_META — sin alias necesario
      ['Edgar_Degas_-_The_Ballet_Class_-_Google_Art_Project',                    'Degas · Ballet_Class'],
      ['Edgar_Germain_Hilaire_Degas_076',                                        'Degas · Bailarinas_Azules'],
      ['Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte_--_1884_-_Google_Art_Project', 'Seurat · Grande_Jatte'],
      ['Pierre-Auguste_Renoir,_Le_Moulin_de_la_Galette',                         'Renoir · Moulin_de_la_Galette'],
      ['Paul_Cézanne_-_Madame_Cézanne_In_A_Yellow_Armchair_-_Google_Art_Project','Cezanne · Madame_Cezanne'],
      ['Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project',            'Monet · Cliff_Walk'],
      ['Claude_Monet_-_Stack_of_Wheat_(Snow_Effect,_Overcast_Day)',              'Monet · Stack_of_Wheat_Snow'],
      ['claude-monet-Impression-soleil-levant-1872-Musee-Marmottan-Monet-Paris-\u00a9-SLB-Christian-Baraja', 'Monet · Impression_Soleil_Levant'],
      ['The_Fighting_Temeraire,_JMW_Turner,_National_Gallery',                  'Turner · Fighting_Temeraire'],
      ['Las_Meninas,_by_Diego_Vel\u00e1zquez,_from_Prado_in_Google_Earth',      'Velazquez · Las_Meninas'],
      ['La_ronda_de_noche,_por_Rembrandt_van_Rijn',                             'Rembrandt · La_Ronda_de_Noche'],
      ['LaRondadeNoche',                                                          'Rembrandt · La_Ronda_de_Noche'],
      ['500px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project',          'Rembrandt · Self-Portrait_1659'],
      ['EdwardHopperMorningSun1952',                                              'Hopper · Morning_Sun'],
      ['3840px-Edward_Hopper_-_Morning_Sun_-_c_1952_-_Columbus_Museum_of_Art',   'Hopper · Morning_Sun'],
      ['Goya_Maja_naga2',                                                         'Goya · Maja_Desnuda'],
      ['The_Fighting_Temeraire_tugged_to_her_last_Berth_to_be_broken',           'Turner · Fighting_Temeraire'],
    ];
    S.forEach(([rawId, metaKey]) => {
      if (OBRA_META[rawId] === undefined && OBRA_META[metaKey] !== undefined) {
        OBRA_META[rawId] = OBRA_META[metaKey];
      }
    });
  })();

  // La resolución de rutas ocurre en resolveImg(), cerca del punto de uso (img.src).

  // Normalización canónica: convierte cualquier ID (raw del motor o clave humana)
  // a una forma comparable. Sin aliases manuales.
  function canonicalKey(id) {
    if (!id) return '';
    return id
      .replace(/_/g, ' ')
      .replace(/·/g, ' ')
      .replace(/\s*-\s*Google Art Project.*$/i, '')
      .replace(/\bedited\b/gi, '')
      .replace(/\bpar\b/gi, '')
      .replace(/[,.()\[\]]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // Caché de lookup construida una sola vez por carga de catálogo
  let _metaCache = null;
  function getMetaCache() {
    if (_metaCache) return _metaCache;
    _metaCache = new Map();
    for (const [key, meta] of Object.entries(OBRA_META)) {
      _metaCache.set(canonicalKey(key), { key, meta });
    }
    return _metaCache;
  }

  function findMeta(id) {
    // 1. Lookup exacto (ruta rápida)
    const exactOverride = OBRA_META[id];

    // 2. Base desde CATALOGUE
    const base = window.CATALOGUE?.find(o => o.id === id);

    // 3. Lookup normalizado en OBRA_META
    const cache = getMetaCache();
    const hit = cache.get(canonicalKey(id));
    const override = exactOverride || hit?.meta || null;

    // 4. Sin base → error controlado, nunca UI rota
    if (!base) {
      if (override) return override;
      console.warn(`[ARGIRA] obra no encontrada en catálogo: "${id}"`);
      return {
        titulo:      id,
        artista:     'ARGIRA',
        descripcion: 'Obra no encontrada en el catálogo ARGIRA.',
        img:         null,
        audio:       null,
      };
    }

    // 5. Base derivada desde CATALOGUE (fallback sin metadatos curados)
    const derived = {
      titulo:      base.id,
      artista:     'ARGIRA',
      descripcion: 'Obra del catálogo ARGIRA. Explora su sonificación en el mapa perceptual.',
      img:         base.wav ? base.wav.replace(/\.wav$/i, '.jpg') : null,
      audio:       base.wav || null,
      freq:        base.freq,
      tempo:       base.tempo,
    };

    // 6. Merge: override curado gana sobre base derivada
    if (!override) {
      console.warn(`[ARGIRA] sin metadatos curados para: "${id}"`);
      return derived;
    }
    return { ...derived, ...override };
  }

  // Resuelve src de imagen: assets locales → img/, URLs absolutas → tal cual.
  // Mantener aquí (capa de presentación), no en findMeta (capa de datos).
  function resolveImg(src) {
    if (!src) return '';
    if (/^https?:\/\//.test(src)) return src;
    return 'img/' + src;
  }

  // ------------------------------------------------------------------
  // 2. MODAL (TODAS LAS FUNCIONES)
  // ------------------------------------------------------------------
  let overlay, modal, listenBtn, closeBtn, xBtn;
  let _currentAudio = null;
  let _lastFocused  = null;

  function buildModal() {
    const overlayDiv = document.createElement('div');
    overlayDiv.id = 'argira-obra-overlay';
    overlayDiv.setAttribute('aria-hidden', 'true');
    overlayDiv.innerHTML = `
      <div id="argira-obra-modal" role="dialog" aria-modal="true" aria-labelledby="argira-obra-title" aria-describedby="argira-obra-desc" tabindex="-1">
        <button id="argira-obra-x-btn" aria-label="Cerrar panel de obra" type="button">✕</button>
        <div id="argira-obra-img-wrap" aria-hidden="true">
          <span id="argira-obra-img-placeholder">cargando imagen…</span>
          <img id="argira-obra-img" src="" alt="" />
        </div>
        <div id="argira-obra-body">
          <p id="argira-obra-artist"></p>
          <h2 id="argira-obra-title"></h2>
          <p id="argira-obra-desc"></p>
          <p id="argira-obra-nivel"></p>
          <div id="argira-obra-actions">
            <button id="argira-obra-listen-btn" class="argira-modal-btn" type="button" aria-pressed="false">🔊 Escuchar</button>
            <button id="argira-obra-close-btn" class="argira-modal-btn" type="button">Cerrar</button>
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

  function openModal(meta) {
    if (!meta) { console.warn('[ARGIRA] openModal: meta undefined'); return; }
    if (!overlay) {
      overlay = document.getElementById('argira-obra-overlay') || buildModal();
      modal = document.getElementById('argira-obra-modal');
      listenBtn = document.getElementById('argira-obra-listen-btn');
      closeBtn = document.getElementById('argira-obra-close-btn');
      xBtn = document.getElementById('argira-obra-x-btn');

      closeBtn.addEventListener('click', closeModal);
      xBtn.addEventListener('click', closeModal);
      overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
      listenBtn.addEventListener('click', toggleListen);
    }

    document.getElementById('argira-obra-title').textContent = meta.titulo;
    document.getElementById('argira-obra-artist').textContent = meta.artista;
    document.getElementById('argira-obra-desc').textContent = meta.descripcion;

    const nivelEl = document.getElementById('argira-obra-nivel');
    if (meta.label) {
      const parts = meta.label.split('·');
      const nivel = parts[parts.length - 1]?.trim();
      nivelEl.textContent = nivel ? `Nivel cromático: ${nivel}` : '';
    } else nivelEl.textContent = '';

    const imgEl = document.getElementById('argira-obra-img');
    const phEl = document.getElementById('argira-obra-img-placeholder');
    // Reset seguro: el CSS usa opacity 0/1 vía clase .loaded — nunca tocar display ni hidden
    imgEl.onload = null;
    imgEl.onerror = null;
    imgEl.removeAttribute('src');
    imgEl.classList.remove('loaded');
    phEl.style.display = '';
    imgEl.alt = `${meta.titulo} — ${meta.artista}`;

    if (meta.img) {
      phEl.textContent = 'cargando imagen…';
      imgEl.onload  = () => { imgEl.classList.add('loaded'); phEl.style.display = 'none'; };
      imgEl.onerror = () => { imgEl.classList.remove('loaded'); phEl.textContent = 'imagen no disponible'; };
      imgEl.src = resolveImg(meta.img);
    } else {
      phEl.textContent = 'sin imagen';
    }

    resetListenBtn();
    listenBtn.disabled = !meta.audio && !meta.descripcion;
    listenBtn.dataset.audio = meta.audio || '';
    listenBtn.dataset.texto = meta.descripcion || '';
    listenBtn.dataset.titulo = meta.titulo;
    listenBtn.dataset.artista = meta.artista;

    _lastFocused = document.activeElement;
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('open');
    setTimeout(() => modal.focus(), 50);
    document.addEventListener('keydown', trapFocus);
    announceToSR(`Obra seleccionada: ${meta.titulo}, ${meta.artista}. Pulsa Escuchar para oír la descripción, o Cerrar para volver al mapa.`);
  }

  function closeModal() {
    if (!overlay) return;
    stopListen();
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', trapFocus);
    if (_lastFocused && typeof _lastFocused.focus === 'function') setTimeout(() => _lastFocused.focus(), 50);
  }

  function toggleListen() {
    if (listenBtn.getAttribute('aria-pressed') === 'true') stopListen();
    else startListen();
  }

  function startListen() {
    const audio = listenBtn.dataset.audio;
    const texto = listenBtn.dataset.texto;
    const titulo = listenBtn.dataset.titulo;
    const artista = listenBtn.dataset.artista;
    const textoCompleto = [titulo && artista ? `${titulo}, por ${artista}.` : titulo || artista, texto].filter(Boolean).join(' ');

    if (window.ArgiraSpeech) window.ArgiraSpeech.stop();
    if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }

    listenBtn.setAttribute('aria-pressed', 'true');
    listenBtn.classList.add('speaking');
    listenBtn.innerHTML = '⏹ Detener';

    if (window.ArgiraSpeech) {
      window.ArgiraSpeech.speak(textoCompleto, { rate: 0.92 }).then(() => {
        if (audio && listenBtn.getAttribute('aria-pressed') === 'true') playAudioFile(audio);
        else resetListenBtn();
      });
    }
  }

  function playAudioFile(src) {
    try {
      _currentAudio = new Audio(src);
      _currentAudio.volume = 0.75;
      _currentAudio.onended = () => { _currentAudio = null; resetListenBtn(); };
      _currentAudio.onerror = () => { _currentAudio = null; resetListenBtn(); };
      _currentAudio.play().catch(() => resetListenBtn());
    } catch (e) { resetListenBtn(); }
  }

  function stopListen() {
    if (window.ArgiraSpeech) window.ArgiraSpeech.stop();
    if (_currentAudio) { _currentAudio.pause(); _currentAudio.currentTime = 0; _currentAudio = null; }
    resetListenBtn();
  }

  function resetListenBtn() {
    if (!listenBtn) return;
    listenBtn.setAttribute('aria-pressed', 'false');
    listenBtn.classList.remove('speaking');
    listenBtn.innerHTML = '🔊 Escuchar';
  }

  let _srAnnouncer = null;
  function announceToSR(msg) {
    if (!_srAnnouncer) _srAnnouncer = document.getElementById('sr-announcer');
    if (!_srAnnouncer) {
      _srAnnouncer = document.createElement('div');
      _srAnnouncer.setAttribute('role', 'status');
      _srAnnouncer.setAttribute('aria-live', 'polite');
      _srAnnouncer.setAttribute('aria-atomic', 'true');
      _srAnnouncer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      document.body.appendChild(_srAnnouncer);
    }
    _srAnnouncer.textContent = '';
    void _srAnnouncer.offsetHeight;
    _srAnnouncer.textContent = msg;
  }

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
    const canvas = document.getElementById('map');
    if (!canvas || !window.CATALOGUE) return null;
    const rect = canvas.getBoundingClientRect();
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
      if (dist < 18 && dist < bestDist) { bestDist = dist; bestObra = obra; }
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

    function cleanup() {
      mapOverlay.querySelectorAll('.map-node').forEach(n => {
        n.removeEventListener('click', onNodeActivate);
        n.removeEventListener('keydown', onNodeKeydown);
        n.remove();
      });
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

    function renderMapNodes() {
      if (!window.CATALOGUE) return;
      cleanup();
      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      const PAD = 44;
      const { min: P1_lo, max: P1_hi } = getP1Range();
      const { min: P4_lo, max: P4_hi } = getP4Range();
      const normP1 = v => (v - P1_lo) / (P1_hi - P1_lo);
      const normP4 = v => (v - P4_lo) / (P4_hi - P4_lo);

      window.CATALOGUE.forEach(obra => {
        const btn = document.createElement('button');
        btn.className = 'map-node';
        btn.type = 'button';
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.dataset.id = obra.id;
        const meta = findMeta(obra.id);
        btn.setAttribute('aria-label', `${meta.titulo}, de ${meta.artista}. Abrir obra en el mapa perceptual`);
        const cx = PAD + normP1(obra.P1) * (W - PAD * 2);
        const cy = PAD + (1 - normP4(obra.P4)) * (H - PAD * 2);
        btn.style.cssText = `position:absolute; left:${cx}px; top:${cy}px; width:44px; height:44px; transform:translate(-50%,-50%); opacity:0; background:none; border:none; padding:0; cursor:pointer;`;
        btn.addEventListener('click', onNodeActivate);
        btn.addEventListener('keydown', onNodeKeydown);
        mapOverlay.appendChild(btn);
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
  // 5. INTERACCIÓN UNIFICADA (pointerup)
  // ------------------------------------------------------------------
  let lastPointer = { time: 0, x: 0, y: 0, id: null };
  const POINTER_CONFIG = { DOUBLE_TAP_DELAY: 320, MOVE_TOLERANCE: 30 };

  function initPointerInteraction() {
    const mapWrap = document.getElementById('mapWrap');
    if (!mapWrap) return false;

    function handlePointerUp(e) {
      const rect = mapWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = Date.now();
      const timeDiff = now - lastPointer.time;
      const dist = Math.hypot(x - lastPointer.x, y - lastPointer.y);
      const obra = clientToNearest(e.clientX, e.clientY);
      if (!obra) return;
      const meta = findMeta(obra.id);

      const isDouble = (timeDiff < POINTER_CONFIG.DOUBLE_TAP_DELAY && dist < POINTER_CONFIG.MOVE_TOLERANCE);
      if (isDouble) {
        openModal(meta);
        lastPointer.time = 0;
        return;
      }
      // Un solo toque → anclaje (si existe la función global)
      if (typeof window.setAnchorFromHover === 'function') {
        window.setAnchorFromHover(e);
      }
      lastPointer = { time: now, x, y, id: obra.id };
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
})();