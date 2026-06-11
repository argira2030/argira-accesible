// ================================================================
//  ARGIRA · MAP EXPLORER · ARRANQUE POR EVENTOS (SIN POLLING)
//  ================================================================
(function() {
  'use strict';

  // ------------------------------------------------------------------
  // 1. METADATOS DE OBRAS (OBRA_META + ALIASES)
  // ------------------------------------------------------------------
  const OBRA_META = {
    '1280px-Idylle': {
      titulo: "Idylle (Fabel)",
      artista: "Gustav Klimt",
      descripcion: "Obra temprana de Klimt de influencia academicista. Figuras alegóricas en un ambiente idílico antes de que el artista desarrollara su característico lenguaje ornamental dorado.",
      img: "1280px-Idylle.jpg",
      audio: "1280px-Idylle.wav",
    },
    '1280px-Korenveld_Van_Gogh': {
      titulo: "Campo de Trigo con Cuervos",
      artista: "Vincent van Gogh",
      descripcion: "Una de las últimas obras de Van Gogh. Un camino se bifurca bajo un cielo turbulento y cuervos negros. Pinceladas en espiral expresan angustia y al mismo tiempo amor apasionado por la tierra.",
      img: "1280px-Korenveld_met_kraaien_-_s0149V1962_-_Van_Gogh_Museum.jpg",
      audio: "1280px-Korenveld_met_kraaien_-_s0149V1962_-_Van_Gogh_Museum.wav",
    },
    'Klimt · Filosofía': {
      titulo: "Filosofía (estado final, 1907)",
      artista: "Gustav Klimt",
      descripcion: "Una de las pinturas para la Universidad de Viena que provocaron un escándalo mayúsculo. Figuras flotantes, cuerpos entrelazados en el cosmos y una esfinge emergen de la oscuridad. Fue destruida en 1945.",
      img: "1280px-Philosophy-final-state-1907.jpg",
      audio: "1280px-Philosophy-final-state-1907.wav",
    },
    'Hopper · Morning Sun': {
      titulo: "Morning Sun",
      artista: "Edward Hopper",
      descripcion: "Una mujer sentada en la cama, bañada por la luz de la mañana. Soledad urbana norteamericana. Colores cálidos pero contenidos, composición geométrica, silencio palpable.",
      img: "EdwardHopperMorningSun1952.jpg",
      audio: "EdwardHopperMorningSun1952.wav",
    },
    'Kandinsky · Jaune Rouge Bleu': {
      titulo: "Amarillo Rojo Azul",
      artista: "Wassily Kandinsky",
      descripcion: "Composición abstracta en la que los tres colores primarios organizan el espacio. Líneas, curvas y manchas interactúan como instrumentos en una sinfonía. El cuadro más cromático del catálogo.",
      img: "3840px-Kandinsky_-_Jaune_Rouge_Bleu.jpg",
      audio: "3840px-Kandinsky_-_Jaune_Rouge_Bleu.wav",
    },
    'Rembrandt · Self-Portrait': {
      titulo: "Autorretrato",
      artista: "Rembrandt van Rijn",
      descripcion: "Autorretrato de Rembrandt con su maestría inconfundible del claroscuro. La luz modela el rostro desde la sombra, revelando una presencia intensa y meditativa.",
      img: "500px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg",
      audio: "500px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.wav",
    },
    'Turner · Barco de esclavos': {
      titulo: "El Barco Negrero",
      artista: "J.M.W. Turner",
      descripcion: "Un buque arroja esclavos al mar durante una tormenta para cobrar el seguro. El cielo y el océano se funden en una catástrofe cromática de naranjas y rojos. La pintura más políticamente cargada de Turner.",
      img: "Barco de esclavos_William Turner.jpg",
      audio: "Barco de esclavos_William Turner.wav",
    },
    'Monet · Cliff Walk Pourville': {
      titulo: "Acantilados de Pourville",
      artista: "Claude Monet",
      descripcion: "Dos figuras femeninas en lo alto del acantilado, bajo un cielo normando. Pinceladas vibrantes capturan el movimiento del viento y el brillo del mar. Impresionismo pleno.",
      img: "Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.jpg",
      audio: "Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.wav",
    },
    'Monet · Almiar Efecto Nieve': {
      titulo: "Almiar (Efecto de Nieve)",
      artista: "Claude Monet",
      descripcion: "Uno de los almiares que Monet pintó en serie para estudiar el mismo motivo bajo distintas condiciones de luz. El invierno apaga los colores y los envuelve en una atmósfera silenciosa y uniforme.",
      img: "Claude_Monet_-_Stack_of_Wheat_(Snow_Effect,_Overcast_Day).jpg",
      audio: "Claude_Monet_-_Stack_of_Wheat_(Snow_Effect,_Overcast_Day).wav",
    },
    'Dalí · Perfil del tiempo': {
      titulo: "La Persistencia de la Memoria",
      artista: "Salvador Dalí",
      descripcion: "Relojes blandos se derriten sobre un paisaje desértico de Port Lligat. El tiempo se licúa, la lógica se suspende. La imagen más reconocible del Surrealismo y del inconsciente como espacio habitable.",
      img: "Dalí,_Perfil_del_tiempo,_Vroclavo,_7.jpeg",
      audio: "Dalí,_Perfil_del_tiempo,_Vroclavo,_7.wav",
    },
    'Delacroix · Dante y Virgilio': {
      titulo: "La Barca de Dante",
      artista: "Eugène Delacroix",
      descripcion: "Dante y Virgilio cruzan la laguna Estigia mientras los condenados se aferran a la barca. Romanticismo puro: dramatismo, color intenso y movimiento convulso. Delacroix tenía 24 años cuando la pintó.",
      img: "Dante-und-Virgil-in-der-Hoelle-Die-Dante-Barke-2.jpg",
      audio: "Dante-und-Virgil-in-der-Hoelle-Die-Dante-Barke-2.wav",
    },
    'Velázquez · Vieja friendo huevos': {
      titulo: "Vieja Friendo Huevos",
      artista: "Diego Velázquez",
      descripcion: "Una anciana fríe huevos mientras un niño observa. Velázquez tenía 19 años y ya dominaba la luz sobre superficies diversas: cerámica, metal, yema, piel. Bodegón de cocina elevado a obra maestra.",
      img: "Diego_Velazquez_An_Old_Woman_Cooking_Eggs.jpg",
      audio: "Diego_Velazquez_An_Old_Woman_Cooking_Eggs.wav",
    },
    'Velázquez · Venus Rokeby': {
      titulo: "La Venus del Espejo",
      artista: "Diego Velázquez",
      descripcion: "El único desnudo femenino conocido de Velázquez. Venus yace de espaldas mientras Cupido sostiene un espejo que refleja su rostro ambiguo. Elegancia y misterio en una obra que desafió la moral de su época.",
      img: "Diego_Velázquez_Rokeby_Venus.jpg",
      audio: "Diego_Velázquez_Rokeby_Venus.wav",
    },
    'Degas · Interior': {
      titulo: "Interior (La Violación)",
      artista: "Edgar Degas",
      descripcion: "Una habitación de noche: un hombre de pie, una mujer encogida. La lámpara central divide el espacio en zonas de tensión. La obra más oscura y narrativamente críptica de Degas.",
      img: "Edgar_DegasInterior.jpg",
      audio: "Edgar_DegasInterior.wav",
    },
    'Degas · Familia Bellelli': {
      titulo: "La Familia Bellelli",
      artista: "Edgar Degas",
      descripcion: "Retrato familiar de gran formato que Degas tardó años en terminar. La baronesa y sus hijas forman un bloque compacto; el barón, sentado de espaldas, está separado. Una radiografía fría de las tensiones domésticas.",
      img: "Edgar_DegasThe_Bellelli_Family.jpg",
      audio: "Edgar_DegasThe_Bellelli_Family.wav",
    },
    'Degas · La clase de ballet': {
      titulo: "La Clase de Ballet",
      artista: "Edgar Degas",
      descripcion: "El maestro Jules Perrot dirige el ensayo mientras las bailarinas esperan su turno. Espacio escénico complejo, perspectiva oblicua, luz difusa de estudio. Degas capta el trabajo invisible detrás de la ilusión del ballet.",
      img: "Edgar_Degas_-_The_Ballet_Class_-_Google_Art_Project.jpg",
      audio: "Edgar_Degas_-_The_Ballet_Class_-_Google_Art_Project.wav",
    },
    'Degas · Ensayo de ballet': {
      titulo: "Ensayo de Ballet en el Escenario",
      artista: "Edgar Degas",
      descripcion: "Vista desde las bambalinas durante un ensayo. Degas usa una perspectiva inhabitual y la luz de candilejas para crear un espacio escénico irreal. Las bailarinas son figuras en espera, no protagonistas.",
      img: "Edgar_Degas_Ballet_Rehearsal_on_Stage.jpg",
      audio: "Edgar_Degas_Ballet_Rehearsal_on_Stage.wav",
    },
    'Degas · Chassé de danse': {
      titulo: "Chassé de Danse",
      artista: "Edgar Degas",
      descripcion: "Bailarinas en movimiento capturadas en el instante del paso de danza. Paleta suave, composición fragmentada. Degas estudia el cuerpo en acción con la mirada analítica de un anatomista.",
      img: "Edgar_Degas_Chasse_de_danse.jpg",
      audio: "Edgar_Degas_Chasse_de_danse.wav",
    },
    'Degas · Dancers pink and green': {
      titulo: "Bailarinas Rosa y Verde",
      artista: "Edgar Degas",
      descripcion: "Cinco bailarinas se preparan entre bastidores en una explosión de rosas y verdes vibrantes. Cortes compositivos audaces, perspectiva elevada. Degas eleva el instante efímero a estructura pictórica permanente.",
      img: null,   // asset no disponible en corpus
      audio: "Degas_-_Dancers_Pink_and_Green.wav",
    },
    'Munch · El Grito': {
      titulo: "El Grito",
      artista: "Edvard Munch",
      descripcion: "Una figura de rasgos disueltos abre la boca ante un cielo en llamas. Munch describió la experiencia como sentir el grito infinito de la naturaleza. Icono universal de la angustia existencial moderna.",
      img: "Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.jpg",
      audio: "Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.wav",
    },
    'Rembrandt · El hijo pródigo': {
      titulo: "El Retorno del Hijo Pródigo",
      artista: "Rembrandt van Rijn",
      descripcion: "El hijo arrodillado recibe el abrazo del padre anciano. Una de las obras más conmovedoras de Rembrandt: la luz cae sobre las manos del padre como una bendición. Pintura de perdón y compasión sin palabras.",
      img: "ElRetornoDelHijoProdigo-Rembrant.jpg",
      audio: "ElRetornoDelHijoProdigo-Rembrant.wav",
    },
    'Degas · El ajenjo': {
      titulo: "El Ajenjo",
      artista: "Edgar Degas",
      descripcion: "Un hombre y una mujer en un café parisino, cada uno ensimismado en su copa de ajenjo. Distancia entre cuerpos que comparten mesa. Retrato sin piedad del aislamiento urbano y el vicio silencioso.",
      img: "Elajenjo.jpg",
      audio: "Elajenjo.wav",
    },
    'Seurat · La Grande Jatte': {
      titulo: "Una tarde de domingo en la Grande Jatte",
      artista: "Georges Seurat",
      descripcion: "El manifiesto del Puntillismo. Cientos de puntos de color puro, aplicados con método científico, crean la escena del ocio burgués parisino a orillas del Sena. La mezcla óptica en lugar de la mezcla física.",
      img: "Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte_--_1884_-_Google_Art_Project.jpg",
      audio: "Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte_--_1884_-_Google_Art_Project.wav",
    },
    'Goya · Maja desnuda': {
      titulo: "La Maja Desnuda",
      artista: "Francisco de Goya",
      descripcion: "Una de las primeras representaciones de un desnudo femenino sin pretexto mitológico en la historia del arte occidental. La maja mira directamente al espectador con una audacia que escandalizó a la Inquisición.",
      img: "Goya_Maja_naga2.jpg",
      audio: "Goya_Maja_naga2.wav",
    },
    'Klimt · Flores de jardín': {
      titulo: "Flores de Jardín",
      artista: "Gustav Klimt",
      descripcion: "Jardín visto desde arriba: un tapiz de flores sin horizonte ni perspectiva clásica. El ornamento vegetal invade todo el plano pictórico. La naturaleza como superficie decorativa antes que como espacio ilusorio.",
      img: null,   // asset no disponible en corpus
      audio: "Klimt_-_Flower_Garden.wav",
    },
    'Klimt · 046': {
      titulo: "Retrato de Adele Bloch-Bauer I",
      artista: "Gustav Klimt",
      descripcion: "Retrato de Adele Bloch-Bauer envuelto en pan de oro y plata. El cuerpo se disuelve en un tapiz de espirales, ojos y geometrías egipcias. La obra más cara vendida en Europa en su momento; símbolo del período dorado de Klimt.",
      img: "Gustav_Klimt_046.jpg",
      audio: "Gustav_Klimt_046.wav",
    },
    'Klimt · El ciego': {
      titulo: "El Ciego",
      artista: "Gustav Klimt",
      descripcion: "Figura masculina de pie con los ojos cerrados o ciegos. Klimt explora aquí la vulnerabilidad del cuerpo con una sobriedad inusual, alejada del ornamento dorado de su período más célebre.",
      img: "Gustav_Klimt_Blind_Man.jpg",
      audio: "Gustav_Klimt_Blind_Man.wav",
    },
    'Klimt · La Medicina': {
      titulo: "La Medicina",
      artista: "Gustav Klimt",
      descripcion: "Segunda de las pinturas universitarias: una columna de cuerpos humanos flotantes —vida, enfermedad, muerte— se eleva junto a Higía. Destruida en 1945. Se conserva en fotografías y estudios preparatorios.",
      img: "Gustav_Klimt_Fakultatsbild_Die_Medizin.jpg",
      audio: "Gustav_Klimt_Fakultatsbild_Die_Medizin.wav",
    },
    'Klimt · Tranquil Pond': {
      titulo: "Estanque en Calma (Egelsee)",
      artista: "Gustav Klimt",
      descripcion: "Vista cenital de un estanque cubierto de vegetación acuática. Sin horizonte, sin figura humana. El agua y los reflejos forman un tapiz abstracto. La naturaleza como ornamento puro.",
      img: "Gustav_Klimt_Tranquil_PondEgelsee_near_Golling_Salzburg.jpg",
      audio: "Gustav_Klimt_Tranquil_PondEgelsee_near_Golling_Salzburg.wav",
    },
    'Vermeer · La lechera': {
      titulo: "La Lechera",
      artista: "Johannes Vermeer",
      descripcion: "Una criada vierte leche con concentración absoluta. Luz de ventana difusa y precisa. Azules y amarillos en equilibrio casi musical. Una escena cotidiana convertida en eternidad.",
      img: "Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.png",
      audio: "Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.wav",
    },
    'Turner · Casas del Parlamento': {
      titulo: "El Incendio de las Cámaras del Parlamento",
      artista: "J.M.W. Turner",
      descripcion: "El incendio real de Westminster en 1834, visto desde el puente de Waterloo. La ciudad se convierte en una hoguera reflejada en el Támesis. Turner lo presenció y tomó apuntes en el lugar.",
      img: "Joseph_Mallord_William_Turner,_English_-_The_Burning_of_the_Houses_of_Lords_and_Commons,_October_16,_1834_-_Google_Art_Project.jpg",
      audio: "Joseph_Mallord_William_Turner,_English_-_The_Burning_of_the_Houses_of_Lords_and_Commons,_October_16,_1834_-_Google_Art_Project.wav",
    },
    'Turner · Pescadores en el mar': {
      titulo: "Pescadores en el Mar",
      artista: "J.M.W. Turner",
      descripcion: "Primera obra de Turner expuesta en la Royal Academy. Una barca de pesca nocturna bajo la luna, rodeada de oscuridad y olas. Ya aparece el dramatismo lumínico que definirá toda su carrera.",
      img: "Joseph_Mallord_William_Turner_Fishermen_at_Sea.jpg",
      audio: "Joseph_Mallord_William_Turner_Fishermen_at_Sea.wav",
    },
    'Caravaggio · Judith': {
      titulo: "Judith y Holofernes",
      artista: "Caravaggio",
      descripcion: "Judith decapita al general asirio con expresión concentrada y distante. La criada observa desde las sombras. Caravaggio usa el tenebrismo para hacer la violencia cotidiana y casi doméstica.",
      img: "JuditYolofernes.jpg",
      audio: "JuditYolofernes.wav",
    },
    'Klimt · Jurisprudencia': {
      titulo: "Jurisprudencia (estado final, 1907)",
      artista: "Gustav Klimt",
      descripcion: "Tercera pintura universitaria: un hombre anciano y encogido es apresado por tentáculos de pulpo ante las figuras de la Verdad, la Justicia y la Ley. La obra más oscura del ciclo, también destruida en 1945.",
      img: "Jurisprudence-final-state-1907.jpg",
      audio: "Jurisprudence-final-state-1907.wav",
    },
    'Kandinsky · Composición 8': {
      titulo: "Composición VIII",
      artista: "Wassily Kandinsky",
      descripcion: "Triángulos, círculos y líneas interactúan sobre fondo claro en una sinfonía visual. Kandinsky codifica aquí su teoría del color y la forma como equivalentes de sonidos musicales. Abstracción total al servicio de la emoción.",
      img: "Kandinsky_-_Composition_8,_July_1923.jpg",
      audio: "Kandinsky_-_Composition_8,_July_1923.wav",
    },
    'Malevich · Cuadrado negro': {
      titulo: "Cuadrado Negro",
      artista: "Kazimir Malevich",
      descripcion: "Icono del Suprematismo. Un cuadrado negro sobre fondo blanco, sin representación de ningún objeto real. Simboliza la «sensación pura» liberada de toda referencia figurativa.",
      img: "Kazimir_Malevich,_1915,_Black_Suprematic_Square,_oil_on_linen_canvas,_79.5_x_79.5_cm,_Tretyakov_Gallery,_Moscow.jpg",
      audio: "Kazimir_Malevich,_1915,_Black_Suprematic_Square,_oil_on_linen_canvas,_79.5_x_79.5_cm,_Tretyakov_Gallery,_Moscow.wav",
    },
    'Rembrandt · La ronda de noche': {
      titulo: "La Ronda de Noche",
      artista: "Rembrandt van Rijn",
      descripcion: "La obra más célebre de Rembrandt. Una compañía de milicianos emerge de la oscuridad con dramatismo teatral. La luz cae de forma selectiva sobre las figuras, creando una composición en perpetuo movimiento.",
      img: "La_ronda_de_noche,_por_Rembrandt_van_Rijn.jpg",
      audio: "La_ronda_de_noche,_por_Rembrandt_van_Rijn.wav",
    },
    'Matisse · La Danza II': {
      titulo: "La Danza II",
      artista: "Henri Matisse",
      descripcion: "Cinco figuras desnudas danzan en círculo sobre un fondo de cielo azul y tierra verde. Línea contorneada, color plano y vibrante, ausencia de perspectiva. La alegría del movimiento reducida a su esencia más pura.",
      img: "La_Danse_II,_par_Henri_Matisse.jpg",
      audio: "La_Danse_II,_par_Henri_Matisse.wav",
    },
    'Matisse · La habitación roja': {
      titulo: "La Mesa Roja",
      artista: "Henri Matisse",
      descripcion: "Una habitación donde el rojo lo invade todo: mesa, paredes, decoración. Los patrones arabescos vibran sobre el rojo intenso. Color liberado de la forma, música hecha pintura.",
      img: "La_Desserte_rouge,_par_Henri_Matisse.jpg",
      audio: "La_Desserte_rouge,_par_Henri_Matisse.wav",
    },
    'Rembrandt · La novia judía': {
      titulo: "La Novia Judía",
      artista: "Rembrandt van Rijn",
      descripcion: "Un hombre posa su mano sobre el pecho de una mujer en un gesto de ternura solemne. La identidad de los personajes es incierta. Van Gogh escribió que daría diez años de vida por contemplarla dos semanas.",
      img: "LanoviaJudia.jpg",
      audio: "LanoviaJudia.wav",
    },
    'Velázquez · Las Meninas': {
      titulo: "Las Meninas",
      artista: "Diego Velázquez",
      descripcion: "La obra maestra del Barroco español. Velázquez se retrata pintando mientras la infanta Margarita y su séquito ocupan el primer plano. El espejo al fondo revela a los reyes. Un enigma visual sobre la representación y la mirada.",
      img: "Las_Meninas,_by_Diego_Velázquez,_from_Prado_in_Google_Earth.jpg",
      audio: "Las_Meninas,_by_Diego_Velázquez,_from_Prado_in_Google_Earth.wav",
    },
    'Turner · La tormenta en el mar': {
      titulo: "La Tormenta en el Mar",
      artista: "J.M.W. Turner",
      descripcion: "Vórtice de luz y agua: el mar en tormenta como fuerza abstracta que devora la forma. Turner, según la leyenda, se hizo atar al mástil de un barco para observar una tormenta de cerca.",
      img: "Latormentaenelmar.jpg",
      audio: "Latormentaenelmar.wav",
    },
    'Goya · La vendimia': {
      titulo: "La Vendimia",
      artista: "Francisco de Goya",
      descripcion: "Escena festiva de la recogida de la uva. Colores cálidos, figuras populares en el campo. Uno de los cartones para tapices de la fábrica real, cuando Goya aún pintaba la vida cotidiana con optimismo.",
      img: "Lavendimia.jpg",
      audio: "Lavendimia.wav",
    },
    'Rembrandt · Lección de anatomía': {
      titulo: "La Lección de Anatomía del Dr. Tulp",
      artista: "Rembrandt van Rijn",
      descripcion: "El doctor Nicolaes Tulp disecciona un brazo ante siete estudiantes de medicina. Rembrandt tenía 26 años. La composición triangular y la luz sobre el cadáver convierten una práctica médica en teatro moral.",
      img: "Lecciondeanatomia.jpg",
      audio: "Lecciondeanatomia.wav",
    },
    'Da Vinci · Mona Lisa': {
      titulo: "La Gioconda",
      artista: "Leonardo da Vinci",
      descripcion: "El retrato más famoso del mundo. La sonrisa ambigua de Lisa Gherardini y el paisaje esfumado del fondo desafían cualquier interpretación definitiva. El sfumato de Leonardo disuelve los contornos en atmósfera.",
      img: "Leonardo_da_Vinci_-_Mona_Lisa_(Louvre,_Paris).jpg",
      audio: "Leonardo_da_Vinci_-_Mona_Lisa_(Louvre,_Paris).wav",
    },
    'Matisse · Mujer con sombrero': {
      titulo: "Mujer con Sombrero",
      artista: "Henri Matisse",
      descripcion: "Retrato de Amélie Matisse con un exuberante sombrero. Los colores del rostro —verdes, rosas, naranjas— escandalizaron en 1905. Obra fundacional del Fauvismo: el color como emoción pura, no como descripción.",
      img: "Matisse-Woman-with-a-Hat.jpg",
      audio: "Matisse-Woman-with-a-Hat.wav",
    },
    'Vermeer · Chica con pendiente de perla': {
      titulo: "La Joven de la Perla",
      artista: "Johannes Vermeer",
      descripcion: "Una joven se gira y mira al espectador sobre fondo negro. La perla en su oreja —¿real o de vidrio?— capta la luz como un segundo ojo. Economía radical de medios, máxima intensidad de presencia.",
      img: "Meisje_met_de_parel.jpg",
      audio: "Meisje_met_de_parel.wav",
    },
    'Hopper · Nighthawks': {
      titulo: "Nighthawks",
      artista: "Edward Hopper",
      descripcion: "Una cafetería nocturna en una ciudad vacía. Cuatro figuras bajo la luz de neón, incomunicadas. La obra más icónica de Hopper es también la más precisa sobre la soledad en la ciudad moderna americana.",
      img: "Nighthawks_by_Edward_Hopper_1942.jpg",
      audio: "Nighthawks_by_Edward_Hopper_1942.wav",
    },
    'Cézanne · Madame Cézanne': {
      titulo: "Madame Cézanne en Sillón Amarillo",
      artista: "Paul Cézanne",
      descripcion: "Retrato de Hortense Fiquet, esposa de Cézanne. La figura se construye con pinceladas moduladas que aplanan el espacio. La misma paciente geometrización que aplica a las manzanas y a la montaña.",
      img: "Paul_Cézanne_-_Madame_Cézanne_In_A_Yellow_Armchair_-_Google_Art_Project.jpg",
      audio: "Paul_Cézanne_-_Madame_Cézanne_In_A_Yellow_Armchair_-_Google_Art_Project.wav",
    },
    'Cézanne · Montaña Sainte-Victoire': {
      titulo: "La Montaña Sainte-Victoire",
      artista: "Paul Cézanne",
      descripcion: "Cézanne pintó esta montaña provenzal más de ochenta veces. Cada versión desmonta la perspectiva clásica y construye la forma con planos de color modulados. El puente entre el Impresionismo y el Cubismo.",
      img: "Paul_Cézanne_-_Montagne_Saint-victoire_-_Google_Art_Project.jpg",
      audio: "Paul_Cézanne_-_Montagne_Saint-victoire_-_Google_Art_Project.wav",
    },
    'Cézanne · Cesto de manzanas': {
      titulo: "La Cesta de Manzanas",
      artista: "Paul Cézanne",
      descripcion: "Un bodegón donde los puntos de vista son múltiples e incompatibles: la cesta, la botella y el mantel pertenecen a distintos sistemas de perspectiva. La inestabilidad es la estructura misma del cuadro.",
      img: "Paul_Cézanne_-_The_Basket_of_Apples_-_1926.252_-_Art_Institute_of_Chicago.jpg",
      audio: "Paul_Cézanne_-_The_Basket_of_Apples_-_1926.252_-_Art_Institute_of_Chicago.wav",
    },
    'Renoir · Moulin de la Galette': {
      titulo: "Le Moulin de la Galette",
      artista: "Pierre-Auguste Renoir",
      descripcion: "Una tarde de domingo en el popular baile parisino de Montmartre. La luz se filtra entre los árboles y se fragmenta sobre los vestidos y los rostros. Alegría colectiva capturada en pinceladas vibrantes.",
      img: "Pierre-Auguste_Renoir,_Le_Moulin_de_la_Galette.jpg",
      audio: "Pierre-Auguste_Renoir,_Le_Moulin_de_la_Galette.wav",
    },
    'Velázquez · Retrato Juan Pareja': {
      titulo: "Retrato de Juan de Pareja",
      artista: "Diego Velázquez",
      descripcion: "Retrato del esclavo y asistente de Velázquez, pintado en Roma. La mirada directa y la dignidad de la figura escandalizaron a quienes sabían que el retratado era esclavo. Fue expuesto en el Panteón y admirado por toda Roma.",
      img: "Retrato_de_Juan_Pareja_by_Diego_Velázquez.jpg",
      audio: "Retrato_de_Juan_Pareja_by_Diego_Velázquez.wav",
    },
    'Monet · Catedral de Ruán': {
      titulo: "La Catedral de Rouen",
      artista: "Claude Monet",
      descripcion: "Una de las series más radicales de Monet: la misma fachada gótica bajo distintas horas y condiciones de luz. La piedra se convierte en atmósfera, en color puro. El motivo no es el edificio sino la luz que lo transforma.",
      img: "RouenCathedral_Monet_1894.jpg",
      audio: "RouenCathedral_Monet_1894.wav",
    },
    'Botticelli · El nacimiento de Venus': {
      titulo: "El Nacimiento de Venus",
      artista: "Sandro Botticelli",
      descripcion: "Venus emerge del mar sobre una concha, impulsada por los vientos. Línea sinuosa, paleta de rosas y verdes delicados. El ideal de belleza renacentista florentino cristalizado en temple sobre lienzo.",
      img: "Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
      audio: "Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.wav",
    },
    'Rousseau · Sorprendida': {
      titulo: "Sorprendida (Tormenta en la Selva)",
      artista: "Henri Rousseau",
      descripcion: "Una tigresa avanza entre la vegetación durante una tormenta. Rousseau, aduanero sin formación académica, pintó selvas que nunca vio con una precisión onírica y una intensidad que los surrealistas admirarían décadas después.",
      img: "Surprised-Rousseau.jpg",
      audio: "Surprised-Rousseau.wav",
    },
    'Rembrandt · El abanderado': {
      titulo: "El Abanderado",
      artista: "Rembrandt van Rijn",
      descripcion: "Un joven portaestandarte gira con su bandera desplegada. La luz dorada sobre el traje y el gesto arrogante contrastan con el fondo neutro. Obra de juventud que muestra ya el dominio de Rembrandt sobre la textura y la luz.",
      img: "TheStandardBearer.jpg",
      audio: "TheStandardBearer.wav",
    },
    'Turner · El Temerario': {
      titulo: "El Temerario",
      artista: "J.M.W. Turner",
      descripcion: "El viejo navío de guerra Temeraire es remolcado a su último puerto por un vaporcito negro. El sol se pone sobre la era de la vela. Turner convierte la nostalgia industrial en una elegía de luz y niebla.",
      img: "The_Fighting_Temeraire,_JMW_Turner,_National_Gallery.jpg",
      audio: "The_Fighting_Temeraire,_JMW_Turner,_National_Gallery.wav",
    },
    'Turner · Temerario (alt)': {
      titulo: "El Temerario",
      artista: "J.M.W. Turner",
      descripcion: "El viejo navío de guerra Temeraire es remolcado a su último puerto por un vaporcito negro. El sol se pone sobre la era de la vela. Turner convierte la nostalgia industrial en una elegía de luz y niebla.",
      img: "The_Fighting_Temeraire,_JMW_Turner,_National_Gallery.jpg",
      audio: "The_Fighting_Temeraire,_JMW_Turner,_National_Gallery.wav",
    },
    'Turner · Dido construyendo Cartago': {
      titulo: "Dido Construyendo Cartago",
      artista: "J.M.W. Turner",
      descripcion: "Dido supervisa la construcción de Cartago bañada en una luz mediterránea dorada. Turner la consideraba su obra maestra y la legó a la National Gallery con la condición de que colgara junto a paisajes de Claude Lorrain.",
      img: "TurnerDido.jpg",
      audio: "TurnerDido.wav",
    },
    'Turner · Lluvia Vapor Velocidad': {
      titulo: "Lluvia, Vapor y Velocidad",
      artista: "J.M.W. Turner",
      descripcion: "Una locomotora cruza el viaducto de Maidenhead a toda velocidad bajo una tormenta de lluvia. La forma se disuelve en el movimiento y la atmósfera. Quizás la primera pintura moderna sobre la velocidad industrial.",
      img: "TurnerRainSteam_and_Speed.jpg",
      audio: "TurnerRainSteam_and_Speed.wav",
    },
    'Van Gogh · Noche estrellada': {
      titulo: "La Noche Estrellada",
      artista: "Vincent van Gogh",
      descripcion: "El cielo nocturno de Saint-Rémy-de-Provence se convierte en un vórtice de espirales luminosas. Pinceladas en movimiento, estrellas que estallan, un ciprés oscuro que asciende. La obra más célebre de Van Gogh.",
      img: "Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
      audio: "Van_Gogh_-_Starry_Night_-_Google_Art_Project.wav",
    },
    'Velázquez · Las lanzas': {
      titulo: "La Rendición de Breda (Las Lanzas)",
      artista: "Diego Velázquez",
      descripcion: "El general holandés entrega las llaves de Breda al español Ambrosio Spínola, quien le recibe con cortesía. Las lanzas forman una pantalla vertical. Una rendición militar convertida en lección de dignidad mutua.",
      img: "Velazquez_de_Breda_o_Las_LanzasMuseo_del_Prado_1634-35.jpg",
      audio: "Velazquez_de_Breda_o_Las_LanzasMuseo_del_Prado_1634-35.wav",
    },
    'Malevich · Blanco sobre blanco': {
      titulo: "Blanco sobre Blanco",
      artista: "Kazimir Malevich",
      descripcion: "Suprematismo en su estado más puro: dos cuadrados blancos, uno girado levemente sobre el otro. Ausencia total de color cromático. El silencio visual hecho pintura.",
      img: "White_on_White_(Malevich,_1918).png",
      audio: "White_on_White_(Malevich,_1918).wav",
    },
    'Caravaggio · Baco': {
      titulo: "Baco",
      artista: "Caravaggio",
      descripcion: "Un Baco adolescente y lánguido ofrece una copa de vino al espectador. La fruta del cesto está en proceso de pudrición. Caravaggio pinta la mitología con modelos de la calle y una luz que hace la divinidad completamente carnal.",
      img: "baco.jpg",
      audio: "baco.wav",
    },
    'Monet · Impression soleil levant': {
      titulo: "Impresión, Sol Naciente",
      artista: "Claude Monet",
      descripcion: "El cuadro que dio nombre al Impresionismo. El puerto de El Havre al amanecer: un disco solar naranja sobre agua gris azulada. La pincelada libre y la captura del instante como programa estético.",
      img: "claude-monet-Impression-soleil-levant-1872-Musee-Marmottan-Monet-Paris-©-SLB-Christian-Baraja.jpg",
      audio: "claude-monet-Impression-soleil-levant-1872-Musee-Marmottan-Monet-Paris-©-SLB-Christian-Baraja.wav",
    },
    'Goya · Saturno': {
      titulo: "Saturno Devorando a su Hijo",
      artista: "Francisco de Goya",
      descripcion: "Una de las Pinturas Negras de la Quinta del Sordo. Saturno devora un cuerpo con ojos desorbitados de pánico. Goya pintó esto directamente sobre la pared de su casa, para sí mismo. Horror sin distancia estética.",
      img: "goya-saturno.jpg",
      audio: "goya-saturno.wav",
    },
    'Caravaggio · La cabeza de Medusa': {
      titulo: "La Cabeza de Medusa",
      artista: "Caravaggio",
      descripcion: "La cabeza recién cortada de Medusa grita pintada sobre un escudo convexo. Caravaggio usó su propio rostro como modelo. El gesto congela el instante exacto entre vida y muerte, entre horror y fascinación.",
      img: "lacabezamedusa-carav.jpg",
      audio: "lacabezamedusa-carav.wav",
    },
    'Caravaggio · La captura de Cristo': {
      titulo: "La Captura de Cristo",
      artista: "Caravaggio",
      descripcion: "Soldados rodean a Cristo en el momento del beso de Judas. La linterna ilumina el caos nocturno. En el margen derecho, un hombre sostiene una lámpara: se cree que es el propio Caravaggio, testigo de la traición.",
      img: "lacapturadecristo.jpeg",
      audio: "lacapturadecristo.wav",
    },
    'Caravaggio · La vocación de San Mateo': {
      titulo: "La Vocación de San Mateo",
      artista: "Caravaggio",
      descripcion: "Cristo señala al recaudador de impuestos Mateo en una taberna. La luz atraviesa la oscuridad como un rayo. Lo sagrado irrumpe en lo cotidiano sin anunciarse. Fundamento de toda la pintura barroca posterior.",
      img: "lavocaciondesanmateo.jpeg",
      audio: "lavocaciondesanmateo.wav",
    },
    'Goya · Fusilamientos 3 de mayo': {
      titulo: "Los Fusilamientos del 3 de Mayo",
      artista: "Francisco de Goya",
      descripcion: "Soldados napoleónicos fusilan a civiles madrileños al alba. El hombre de camisa blanca con los brazos en alto es la víctima que resume todas las víctimas. Goya inventa el lenguaje visual del horror moderno.",
      img: "los-fusilamientos-del-3-de-mayo-1.jpg",
      audio: "los-fusilamientos-del-3-de-mayo-1.wav",
    },
    'Caravaggio · Narciso': {
      titulo: "Narciso",
      artista: "Caravaggio",
      descripcion: "Narciso se inclina sobre el agua contemplando su propio reflejo. La composición en círculo perfecta une figura y reflejo. Caravaggio convierte el mito en una meditación sobre la ilusión, el deseo y la trampa de la imagen.",
      img: "narciso.jpeg",
      audio: "narciso.wav",
    },
    'Cézanne · Tulipanes': {
      titulo: "Tulipanes",
      artista: "Paul Cézanne",
      descripcion: "Un jarrón de tulipanes construido con pinceladas planas y moduladas. Sin ilusión de profundidad, sin flores idealizadas. Cézanne aplica a la naturaleza muerta la misma búsqueda de estructura permanente que a las montañas.",
      img: "tulips-in-a-vase-paul-cezanne-1892-scaled.jpg",
      audio: "tulips-in-a-vase-paul-cezanne-1892-scaled.wav",
    },
    'Klimt · Árbol de la Vida': {
      titulo: "El Árbol de la Vida",
      artista: "Gustav Klimt",
      descripcion: "Friso central del ciclo de Stoclet: un árbol de ramas en espiral cubre toda la superficie como un organismo ornamental. Figuras humanas emergen del entramado vegetal. La obra más monumental del período dorado de Klimt.",
      img: "Klimt_Tree_of_Life_1909.jpg",
      audio: null,
    },
    'Klimt · El Beso': {
      titulo: "El Beso",
      artista: "Gustav Klimt",
      descripcion: "Una pareja se funde en un abrazo sobre un fondo dorado. Los mantos ornamentados los envuelven hasta hacerlos indistinguibles. El amor como disolución del individuo en el ornamento y en el otro.",
      img: null,   // pendiente asset El Beso en corpus
      audio: null,
    },
    'Degas · Bailarinas azules': {
      titulo: "Bailarinas Azules",
      artista: "Edgar Degas",
      descripcion: "Cuatro bailarinas en tutús azules ajustan sus trajes antes de salir a escena. Pastel sobre papel: los azules vibran contra fondos de naranja y verde. Una de las obras más cromáticamente audaces de Degas.",
      img: "Edgar_Germain_Hilaire_Degas_076.jpg",
      audio: null,
    },
    'Caravaggio · Los tramposos': {
      titulo: "Los Tramposos (I Bari)",
      artista: "Caravaggio",
      descripcion: "Un joven inexperto es engañado en una partida de cartas por dos fulleros. El cómplice señala las cartas del inocente con los dedos a su espalda. Caravaggio pinta el vicio callejero con la misma luz que usará para los santos.",
      img: "1000081498.jpg",
      audio: null,
    },
    'Goya · La gallina ciega': {
      titulo: "La Gallina Ciega",
      artista: "Francisco de Goya",
      descripcion: "Jóvenes aristocráticos juegan a la gallina ciega a orillas del Manzanares. Uno de los cartones para tapices de la fábrica real: colores luminosos, movimiento festivo. El Goya optimista antes de la guerra y la sordera.",
      img: "colin-maillard-the-game-of-blind-mans-bluff-circle-of-young-news-photo-1693158224.jpg",
      audio: null,
    },
    'Kandinsky · Several Circles': {
      titulo: "Varios Círculos",
      artista: "Wassily Kandinsky",
      descripcion: "Círculos de distintos tamaños y colores flotan sobre un fondo oscuro. Kandinsky explora aquí la forma más perfecta: el círculo como símbolo de eternidad, movimiento interior y reposo simultáneo. Una de sus obras más meditativas.",
      img: "Several_Circles-kandisnky.jpg",
      audio: null,
    },
    'Monet · Campo de amapolas': {
      titulo: "Campo de Amapolas",
      artista: "Claude Monet",
      descripcion: "Una figura femenina y un niño descienden por un campo de amapolas rojas bajo un cielo nublado. Pinceladas sueltas capturan el movimiento del viento y la vibración del color. Una de las primeras obras maestras del Impresionismo.",
      img: "field-of-poppies.jpg!Large.jpg",
      audio: "field-of-poppies.jpg!Large.wav",
    },
  };

  // ------------------------------------------------------------------
  // OBRA_META usa directamente los IDs del CATALOGUE como claves.
  // Sin sinónimos, sin canonicalización: lookup O(1) exacto.
  // Si una obra del catálogo no tiene entrada aquí → fallback derivado.
  // ------------------------------------------------------------------
  // La resolución de rutas ocurre en resolveImg(), cerca del punto de uso (img.src).

  // ------------------------------------------------------------------
  // IMAGE_INDEX — espejo exacto del filesystem corpus/
  // Fuente de verdad: solo se actualiza cuando cambian los archivos físicos.
  // NO normalizar aquí; los nombres son los reales del disco.
  // ------------------------------------------------------------------
  const IMAGE_INDEX = new Set([
    "1280px-Idylle.jpg",
    "1280px-Korenveld_met_kraaien_-_s0149V1962_-_Van_Gogh_Museum.jpg",
    "1280px-Philosophy-final-state-1907.jpg",
    "3840px-Edward_Hopper_-_Morning_Sun_-_c_1952_-_Columbus_Museum_of_Art (1).jpg",
    "3840px-Kandinsky_-_Jaune_Rouge_Bleu.jpg",
    "Several_Circles-kandisnky.jpg",
    "500px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg",
    "Barco de esclavos_William Turner.jpg",
    "Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.jpg",
    "Claude_Monet_-_Stack_of_Wheat_(Snow_Effect,_Overcast_Day).jpg",
    "Dalí,_Perfil_del_tiempo,_Vroclavo,_7.jpeg",
    "Dante-und-Virgil-in-der-Hoelle-Die-Dante-Barke-2.jpg",
    "Diego_Velazquez_An_Old_Woman_Cooking_Eggs.jpg",
    "Diego_Velázquez_Rokeby_Venus.jpg",
    "Edgar_DegasInterior.jpg",
    "Edgar_DegasThe_Bellelli_Family.jpg",
    "Edgar_Degas_-_The_Ballet_Class_-_Google_Art_Project.jpg",
    "Edgar_Degas_Ballet_Rehearsal_on_Stage.jpg",
    "Edgar_Degas_Chasse_de_danse.jpg",
    "Edgar_Germain_Hilaire_Degas_076.jpg",
    "Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.jpg",
    "EdwardHopperMorningSun1952.jpg",
    "ElRetornoDelHijoProdigo-Rembrant.jpeg",
    "Elajenjo.jpeg",
    "Georges_Seurat_-_A_Sunday_on_La_Grande_Jatte_--_1884_-_Google_Art_Project.jpg",
    "Goya_Maja_naga2.jpg",
    "Gustav_Klimt_039.jpg",
    "Gustav_Klimt_046.jpg",
    "Gustav_Klimt_Blind_Man.jpg",
    "Gustav_Klimt_Fakultatsbild_Die_Medizin.JPG",
    "Gustav_Klimt_Tranquil_PondEgelsee_near_Golling_Salzburg.jpg",
    "Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.png",
    "Joseph_Mallord_William_Turner,_English_-_The_Burning_of_the_Houses_of_Lords_and_Commons,_October_16,_1834_-_Google_Art_Project.jpg",
    "Joseph_Mallord_William_Turner_Fishermen_at_Sea.jpg",
    "JuditYolofernes.jpeg",
    "Jurisprudence-final-state-1907.jpg",
    "Kandinsky_-_Composition_8,_July_1923.jpg",
    "Kazimir_Malevich,_1915,_Black_Suprematic_Square,_oil_on_linen_canvas,_79.5_x_79.5_cm,_Tretyakov_Gallery,_Moscow.jpg",
    "LaRondadeNoche.jpeg",
    "La_Danse_II,_par_Henri_Matisse.jpg",
    "La_Desserte_rouge,_par_Henri_Matisse.jpg",
    "La_ronda_de_noche,_por_Rembrandt_van_Rijn.jpg",
    "LanoviaJudia.jpeg",
    "Las_Meninas,_by_Diego_Velázquez,_from_Prado_in_Google_Earth.jpg",
    "Latormentaenelmar.jpeg",
    "Lavendimia.jpeg",
    "Lecciondeanatomia.jpeg",
    "Leonardo_da_Vinci_-_Mona_Lisa_(Louvre,_Paris).jpg",
    "Matisse-Woman-with-a-Hat.jpg",
    "Meisje_met_de_parel.jpg",
    "Nighthawks_by_Edward_Hopper_1942.jpg",
    "Paul_Cézanne_-_Madame_Cézanne_In_A_Yellow_Armchair_-_Google_Art_Project.jpg",
    "Paul_Cézanne_-_Montagne_Saint-victoire_-_Google_Art_Project.jpg",
    "Paul_Cézanne_-_The_Basket_of_Apples_-_1926.252_-_Art_Institute_of_Chicago.jpg",
    "Pierre-Auguste_Renoir,_Le_Moulin_de_la_Galette.jpg",
    "Retrato_de_Juan_Pareja_by_Diego_Velázquez.jpg",
    "RouenCathedral_Monet_1894.jpg",
    "Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
    "Surprised-Rousseau.jpg",
    "TheStandardBearer.jpeg",
    "The_Fighting_Temeraire,_JMW_Turner,_National_Gallery.jpg",
    "The_Fighting_Temeraire_tugged_to_her_last_Berth_to_be_broken.jpg",
    "TurnerDido.jpg",
    "TurnerRainSteam_and_Speed.jpg",
    "Turner_-_Rain,_Steam_and_Speed_-_National_Gallery_file.jpg",
    "Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    "Velazquez_de_Breda_o_Las_LanzasMuseo_del_Prado_1634-35.jpg",
    "Vicente_López_Portaña_-_el_pintor_Francisco_de_Goya.jpg",
    "White_on_White_(Malevich,_1918).png",
    "Vincent_Willem_van_Gogh_127.jpg",
    "baco.jpeg",
    "claude-monet-Impression-soleil-levant-1872-Musee-Marmottan-Monet-Paris-©-SLB-Christian-Baraja.jpg",
    "goya-saturno.jpg",
    "jugadoresdecartas.jpeg",
    "lacabezamedusa-carav.jpg",
    "lacapturadecristo.jpeg",
    "lavocaciondesanmateo.jpeg",
    "los-fusilamientos-del-3-de-mayo-1.jpg",
    "narciso.jpeg",
    "tulips-in-a-vase-paul-cezanne-1892-scaled.jpg",
    "Klimt_Tree_of_Life_1909.jpg",
    "1000081498.jpg",
    "1000081532.jpg",
    "1000081459.jpg",
    "1000081463.jpg",
    "1000081511.jpg",
    "1000081541.jpg",
    "1000081710.jpg",
    "1000082117.jpg",
    "Several_Circles-kandisnky.jpg",
    "cuervosvolandosobrecampodetrigos_Van_Gogh.jpg",
    "field-of-poppies.jpg!Large.jpg",
    "colin-maillard-the-game-of-blind-mans-bluff-circle-of-young-news-photo-1693158224.jpg",
  ]);

  // ------------------------------------------------------------------
  // IMAGE_ALIAS_MAP — puente explícito para identidades divergentes.
  // Clave: CATALOGUE.id exacto de la obra.
  // Valor: nombre real del archivo en corpus (debe existir en IMAGE_INDEX).
  // Solo para casos donde OBRA_META.img y filesystem son semánticamente
  // distintos y ninguna heurística de extensión puede inferir la relación.
  // ------------------------------------------------------------------
  const IMAGE_ALIAS_MAP = {
    'Dalí · Perfil del tiempo':              'Dalí,_Perfil_del_tiempo,_Vroclavo,_7.jpeg',
    'Caravaggio · La cabeza de Medusa':      'lacabezamedusa-carav.jpg',
    'Caravaggio · La captura de Cristo':     'lacapturadecristo.jpeg',
    'Caravaggio · La vocación de San Mateo': 'lavocaciondesanmateo.jpeg',
    'Goya · Fusilamientos 3 de mayo':        'los-fusilamientos-del-3-de-mayo-1.jpg',
    'Cézanne · Tulipanes':                   'tulips-in-a-vase-paul-cezanne-1892-scaled.jpg',
    'Goya · La vendimia':                    '1000082117.jpg',
    'Rembrandt · Lección de anatomía':       '1000081459.jpg',
    'Rembrandt · El hijo pródigo':           '1000081463.jpg',
    'Turner · Pescadores en el mar':         '1000081511.jpg',
    'Velázquez · Las lanzas':                '1000081541.jpg',
    '1280px-Korenveld_Van_Gogh':             'cuervosvolandosobrecampodetrigos_Van_Gogh.jpg',
  };

  // Resuelve un nombre de img contra IMAGE_INDEX.
  // Prueba variantes de extensión; último recurso: case-insensitive.
  // Devuelve el nombre real del archivo o null si no existe en el corpus.
  function resolveImage(name) {
    if (!name) return null;
    const base = name.trim();
    const variants = [
      base,
      base.replace(/\.jpg$/i,  '.jpeg'),
      base.replace(/\.jpeg$/i, '.jpg'),
      base.replace(/\.jpg$/i,  '.JPG'),
      base.replace(/\.JPG$/,   '.jpg'),
    ];
    for (const v of variants) {
      if (IMAGE_INDEX.has(v)) return v;
    }
    // Último recurso: case-insensitive (cubre .JPG y mezclas de mayúsculas)
    const lower = base.toLowerCase();
    for (const file of IMAGE_INDEX) {
      if (file.toLowerCase() === lower) return file;
    }
    console.warn(`[ARGIRA] imagen no encontrada en corpus: "${name}"`);
    return null;
  }

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
        audio:       null,
      };
    }

    // 4. Fallback derivado (sin metadatos curados)
    // IMPORTANTE: id siempre presente para que resolveImg() consulte IMAGE_ALIAS_MAP.
    const derived = {
      id:          base.id,
      titulo:      base.id,
      artista:     'ARGIRA',
      descripcion: 'Obra del catálogo ARGIRA. Explora su sonificación en el mapa perceptual.',
      img:         null,
      audio:       null,
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
  // Jerarquía: (1) alias explícito por id, (2) resolveImage() por nombre+extensión.
  // Acepta el objeto meta completo para poder consultar IMAGE_ALIAS_MAP por id.
  // URLs absolutas pasan tal cual. Devuelve '' si el asset no existe en corpus.
  function resolveImg(meta) {
    if (!meta) return '';
    const src = meta.img;
    if (!src) return '';
    if (/^https?:\/\//.test(src)) return src;
    // 1. Alias explícito (identidades divergentes filesystem↔metadata)
    const alias = IMAGE_ALIAS_MAP[meta.id];
    if (alias) {
      const resolved = resolveImage(alias);
      if (resolved) return 'img/' + resolved;
    }
    // 2. Resolución directa con variantes de extensión
    const resolved = resolveImage(src);
    if (!resolved) return '';
    return 'img/' + resolved;
  }

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
  let _currentAudio = null;
  let _lastFocused  = null;
  let _modalState   = 'CLOSED'; // state machine
  let _isListening  = false;    // fuente de verdad JS del pipeline de audio (no el DOM)
  let _audioToken   = 0;        // token de sesión — invalida callbacks async de sesiones anteriores

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

    // Pizarra en blanco: nunca asume estado previo.
    // Cubre apertura inicial, reapertura sobre obra anterior, y recuperación tras error.
    hardResetModalState();

    if (!overlay) {
      overlay = document.getElementById('argira-obra-overlay') || buildModal();
      modal     = document.getElementById('argira-obra-modal');
      listenBtn = document.getElementById('argira-obra-listen-btn');
      closeBtn  = document.getElementById('argira-obra-close-btn');

      closeBtn?.addEventListener('click', closeModal);
      overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
      listenBtn.addEventListener('click', toggleListen);
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

    if (meta.img) {
      phEl.textContent = 'cargando imagen…';
      imgEl.onload  = () => { imgEl.classList.add('loaded'); phEl.style.display = 'none'; };
      imgEl.onerror = () => { imgEl.classList.remove('loaded'); phEl.textContent = 'imagen no disponible'; };
      imgEl.src = resolveImg(meta);
    } else {
      phEl.textContent = 'sin imagen';
    }

    _currentObra = window.CATALOGUE?.find(o => o.id === meta.id) || null;

    // Siempre: reset primero (limpia disabled + estado visual), decisión después
    resetListenBtn();
    if (listenBtn) listenBtn.disabled = !meta.audio && !meta.descripcion;
    listenBtn.dataset.audio   = meta.audio       || '';
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
    setTimeout(() => modal.focus(), 50);
    document.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    if (_modalState === 'CLOSED') return;
    hardResetModalState();
    // overlay: quitar clase open y aria-hidden (hardReset no toca el DOM del overlay)
    overlay?.setAttribute('aria-hidden', 'true');
    overlay?.classList.remove('open');
    if (_lastFocused && typeof _lastFocused.focus === 'function') {
      setTimeout(() => _lastFocused.focus(), 50);
    }
  }

  function toggleListen() {
    if (listenBtn.getAttribute('aria-pressed') === 'true') stopListen();
    else startListen();
  }

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
    const audio   = listenBtn.dataset.audio;
    const titulo  = listenBtn.dataset.titulo;
    const artista = listenBtn.dataset.artista;
    const texto   = listenBtn.dataset.texto;
    const textoCompleto = [
      titulo && artista ? `${titulo}, por ${artista}.` : titulo || artista,
      texto
    ].filter(Boolean).join(' ');

    // 6. WebAudio: pipeline primario — campo sonoro activo antes que la voz
    if (obra && window.ensureAudio && window.playAnchor) {
      await window.ensureAudio();
      window.playAnchor({
        p1: obra.P1, p2: obra.P2 ?? 0.5, p3: obra.P3 ?? 0.5,
        p4: obra.P4, p5: obra.P5 ?? 0.5, p6: obra.P6 ?? 0.5,
        label: titulo, cx: 0, cy: 0, t: performance.now(),
      });
    }

    // 7. Speech: awaited — paso en el flujo, no controlador del estado
    const speechPromise = window.ArgiraSpeech
      ? window.ArgiraSpeech.speak(textoCompleto, { rate: 0.92 })
      : Promise.resolve();
    await speechPromise;

    // 8. Completion gate — token + _isListening: doble check (async callback + stop explícito)
    if (!_isListening || token !== _audioToken) return;
    if (audio) playAudioFile(audio, token);
    else _resetListenUI();
  }

  function playAudioFile(src, token) {
    // token: invalida callbacks si _stopAllAudio() disparó onended/onerror tarde (Firefox)
    try {
      _currentAudio = new Audio(src);
      _currentAudio.volume = 0.75;
      _currentAudio.onended = () => {
        if (token !== _audioToken) return; // evento de sesión antigua — ignorar
        _currentAudio = null; _isListening = false; _resetListenUI();
      };
      _currentAudio.onerror = () => {
        if (token !== _audioToken) return;
        _currentAudio = null; _isListening = false; _resetListenUI();
      };
      _currentAudio.play().catch(() => {
        if (token !== _audioToken) return;
        _isListening = false; _resetListenUI();
      });
    } catch (e) {
      if (token !== _audioToken) return;
      _isListening = false; _resetListenUI();
    }
  }

  // _stopAllAudio — kill switch unificado cross-browser.
  // Para los tres motores de audio en el orden correcto para Firefox.
  // No toca _isListening ni UI: eso es responsabilidad de quien llama.
  function _stopAllAudio() {
    // 1. Speech — cancel() es más fiable que stop() en Firefox
    //    (speechSynthesis mantiene cola interna y no siempre corta con stop())
    if (window.ArgiraSpeech) window.ArgiraSpeech.stop();
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    // 2. File audio — src="" + load() necesarios en Firefox para corte inmediato
    //    (pause() solo puede no ser suficiente si el buffer ya está en streaming)
    if (_currentAudio) {
      _currentAudio.pause();
      _currentAudio.src = '';
      _currentAudio.load();
      _currentAudio = null;
    }

    // 3. WebAudio anchor
    if (window.stopAnchor) window.stopAnchor();
  }

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
  // 5. INTERACCIÓN UNIFICADA (pointerup)
  // ------------------------------------------------------------------
  function initPointerInteraction() {
    const mapWrap = document.getElementById('mapWrap');
    if (!mapWrap) return false;

    function handlePointerUp(e) {
      // Modelo de interacción:
      //   Ratón / touch normal → tap simple abre modal
      //   TalkBack / VoiceOver → doble toque nativo del AT activa el click del nodo
      // No hay lógica de doble tap propia: el AT transforma su gesto en un click estándar.
      // El mapa (arrastrar) es exploración; el modal es reproducción.
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
})();