// --- BASE DE DATOS JSON DE PRODUCTOS CON CÓDIGOS HEXADECIMALES ---
const productosData = [
    // PARA ALGODÓN - REACTIVOS BIFUNCIONALES
    { name: "Amarillo Reactivo 160", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#F3E500" },
    { name: "Amarillo Reactivo 145", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#E98A00" },
    { name: "Naranja Reactivo 122", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#E65000" },
    { name: "Rojo Reactivo 195", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#B6134F" },
    { name: "Rojo Reactivo NS H/C", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#A61144" },
    { name: "Azul Reactivo 21", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#009BBF" },
    { name: "Azul Reactivo 19", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#1A4BA9" },
    { name: "Azul Reactivo 222", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#1D3244" },
    { name: "Negro Reactivo 5", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#141F2B" },
    { name: "Negro Reactivo HFGR", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#121316" },
    { name: "Negro Reactivo RGB", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#15161A" },
    { name: "Negro Reactivo Intenso NS", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#101114" },
    { name: "Negro Reactivo NG", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Bifuncionales", hex: "#101114" },

    // PARA ALGODÓN - MONOCLOROTRIAZINA (HE)
    { name: "Amarillo Reactivo 105", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Monoclorotriazina (HE)", hex: "#D6D11B" },
    { name: "Amarillo Reactivo 84", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Monoclorotriazina (HE)", hex: "#DE9906" },
    { name: "Naranja Reactivo 84", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Monoclorotriazina (HE)", hex: "#DC5404" },
    { name: "Rojo Reactivo 120", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Monoclorotriazina (HE)", hex: "#A6052E" },
    { name: "Rojo Reactivo 141", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Monoclorotriazina (HE)", hex: "#B21749" },
    { name: "Azul Reactivo 71", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Monoclorotriazina (HE)", hex: "#0087B2" },
    { name: "Azul Reactivo 198", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Monoclorotriazina (HE)", hex: "#00569E" },
    { name: "Azul Reactivo 171", category: "algodon", classKey: "algodon", subcategory: "Colorantes Reactivos - Monoclorotriazina (HE)", hex: "#15253F" },

    // PARA ALGODÓN - COLORANTES DIRECTOS
    { name: "Amarillo Directo Fluo F8G", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#EAEE00" },
    { name: "Amarillo Directo 44", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#EAD100" },
    { name: "Amarillo Directo 50", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#EAC000" },
    { name: "Naranja Directo 26", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#DC4F05" },
    { name: "Rosa Directo 227", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#C52774" },
    { name: "Rojo Directo 81", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#AF1542" },
    { name: "Rojo Directo 23", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#B81328" },
    { name: "Rojo Directo 243", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#94204D" },
    { name: "Café Directo 95", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#5C311E" },
    { name: "Café Directo 2", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#564634" },
    { name: "Verde Directo 1", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#164A36" },
    { name: "Violeta Directo 51", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#3B1873" },
    { name: "Azul Directo 86", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#0093CB" },
    { name: "Azul Directo 199", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#0081C4" },
    { name: "Azul Directo NSG", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#0F4687" },
    { name: "Azul Rey Directo NS", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#13347C" },
    { name: "Azul Directo 15", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#163870" },
    { name: "Azul Directo 80", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#1F2D61" },
    { name: "Azul Directo 201", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#202E68" },
    { name: "Azul Directo 2", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#171A49" },
    { name: "Azul Directo 151", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#18173D" },
    { name: "Azul Directo 200", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#192F73" },
    { name: "Negro Directo 22", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#23272C" },
    { name: "Negro Directo 38", category: "algodon", classKey: "algodon", subcategory: "Colorantes Directos", hex: "#252A30" },

    // COLORANTES AL AZUFRE
    { name: "Negro al Azufre", category: "algodon", classKey: "algodon", subcategory: "Colorantes al Azufre", hex: "#1C1D1F" },

    // PARA POLIÉSTER - DISPERSOS
    { name: "Amarillo Disperso Fluo 82", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#D6FF00" }, // Flavina 8 GFF (Muestra 2)
    { name: "Amarillo Disperso Fluo 10 G", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#E2F500" },
    { name: "Naranja Disperso Fluo", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#FF5E00" },
    { name: "Rojo Disperso 277", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#FF2649" },
    { name: "Rojo Disperso 362", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#E61462" },
    { name: "Violeta Disperso CN", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#3A3FA0" },
    { name: "Azul Disperso CN", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#00479E" },
    { name: "Amarillo Disperso 114", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#D6CB00" },
    { name: "Amarillo Disperso 211", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#F3D500" }, // Amarillo 4G (Muestra 8)
    { name: "Amarillo Disperso 54", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#E6C600" }, // Amarillo 3GE (Muestra 5)
    { name: "Naranja Disperso 25", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#D94A00" }, // Naranja H3R (Muestra 10)
    { name: "Naranja Disperso 30", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#C64600" }, // Naranja 2R-FS (Muestra 12)
    { name: "Magenta Disperso NS", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#94023B" },
    { name: "Rojo Disperso 60", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#C10435" }, // Rojo FB (Muestra 20)
    { name: "Rojo Disperso 1", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#B6111C" }, // Escarlata B (Muestra 16)
    { name: "Rojo Disperso 343", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#960032" },
    { name: "Rojo Disperso 167", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#8F022D" },
    { name: "Rojo Disperso 73", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#75001C" }, // Rubina G-FL (Muestra 22)
    { name: "Violeta Disperso SR", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#560233" },
    { name: "Azul Disperso 60", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#0056A6" },
    { name: "Azul Disperso 354", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#0040B4" },
    { name: "Azul Disperso 56", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#0E3982" },
    { name: "Azul Disperso 183", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#0A1B5E" },
    { name: "Azul Disperso 366", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#000A5E" },
    { name: "Azul Disperso 79", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#0D1126" },
    { name: "Azul Disperso EXSF", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#0B0E21" },
    { name: "Negro Disperso EXSF", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#0B0C0F" },
    { name: "Negro Disperso CC3R", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#0A0B0D" },
    { name: "Negro Disperso NSPG", category: "poliester", classKey: "poliester", subcategory: "Colorantes Dispersos", hex: "#0B0D11" },

    // PARA POLIÉSTER - TRANSFER
    { name: "Amarillo Transfer NS Fluo", category: "poliester", classKey: "poliester", subcategory: "Colorantes para Transfer", hex: "#E9F500" },
    { name: "Rosa Transfer NS Fluo", category: "poliester", classKey: "poliester", subcategory: "Colorantes para Transfer", hex: "#FF147B" },
    { name: "Amarillo Transfer 4G", category: "poliester", classKey: "poliester", subcategory: "Colorantes para Transfer", hex: "#E6CE00" },
    { name: "Naranja Transfer 2BP", category: "poliester", classKey: "poliester", subcategory: "Colorantes para Transfer", hex: "#E55B00" },
    { name: "Escarlata Transfer EMV", category: "poliester", classKey: "poliester", subcategory: "Colorantes para Transfer", hex: "#D61F00" },
    { name: "Rojo Transfer 2BP", category: "poliester", classKey: "poliester", subcategory: "Colorantes para Transfer", hex: "#C40A35" },
    { name: "Azul Rey Transfer FBLN", category: "poliester", classKey: "poliester", subcategory: "Colorantes para Transfer", hex: "#0047A6" },
    { name: "Turquesa Transfer BP", category: "poliester", classKey: "poliester", subcategory: "Colorantes para Transfer", hex: "#008EA6" },
    { name: "Negro Transfer NST", category: "poliester", classKey: "poliester", subcategory: "Colorantes para Transfer", hex: "#141518" },

    // COLORANTES ÁCIDOS
    { name: "Amarillo Ácido 49", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#E5D200" },
    { name: "Amarillo Ácido 219", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#D78E00" },
    { name: "Naranja Ácido 67", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#E27B00" },
    { name: "Naranja Ácido 156", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#A84E0C" },
    { name: "Rojo Ácido 52", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#FF007F" },
    { name: "Rojo Ácido NG", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#C80B2B" },
    { name: "Rojo Ácido 151", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#A50216" },
    { name: "Rojo Ácido 114", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#C00B23" },
    { name: "Rojo Ácido 131", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#7E003D" },
    { name: "Rojo Ácido 249", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#BD0952" },
    { name: "Rojo Ácido 337", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#87021E" },
    { name: "Rojo Ácido 299", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#46142B" },
    { name: "Azul Ácido 185", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#00478F" },
    { name: "Azul Ácido 324", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#002F75" },
    { name: "Azul Ácido 62", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#003EB3" },
    { name: "Azul Ácido 113", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#09142E" },
    { name: "Negro Ácido 194", category: "acidos", classKey: "acidos", subcategory: "Colorantes Ácidos", hex: "#121419" },

    // COLORANTES SOLVENTES
    { name: "Amarillo Solvente Fluo 3G", category: "solventes", classKey: "solventes", subcategory: "Colorantes Solventes", hex: "#EEF200" },
    { name: "Amarillo Solvente 16", category: "solventes", classKey: "solventes", subcategory: "Colorantes Solventes", hex: "#E5AF00" },
    { name: "Amarillo Solvente 163", category: "solventes", classKey: "solventes", subcategory: "Colorantes Solventes", hex: "#CC8B00" },
    { name: "Rojo Solvente 24", category: "solventes", classKey: "solventes", subcategory: "Colorantes Solventes", hex: "#BF1322" },
    { name: "Rojo Solvente 195", category: "solventes", classKey: "solventes", subcategory: "Colorantes Solventes", hex: "#AC0432" },
    { name: "Azul Solvente 36", category: "solventes", classKey: "solventes", subcategory: "Colorantes Solventes", hex: "#006FA6" },
    { name: "Azul Solvente 97", category: "solventes", classKey: "solventes", subcategory: "Colorantes Solventes", hex: "#0E244C" },
    { name: "Rojo a la Cuba 41", category: "solventes", classKey: "solventes", subcategory: "Otros Colorantes", hex: "#A30F30" },

    // PIGMENTOS
    { name: "Amarillo Pigmento Fluo", category: "pigmentos", classKey: "pigmentos", subcategory: "Pigmentos", hex: "#E9F800" },
    { name: "Salmón Pigmento Fluo", category: "pigmentos", classKey: "pigmentos", subcategory: "Pigmentos", hex: "#FF6E4A" },
    { name: "Coral Pigmento Fluo", category: "pigmentos", classKey: "pigmentos", subcategory: "Pigmentos", hex: "#FF4057" },
    { name: "Rosa Pigmento Fluo", category: "pigmentos", classKey: "pigmentos", subcategory: "Pigmentos", hex: "#FF1493" },
    { name: "Limón Pigmento Fluo", category: "pigmentos", classKey: "pigmentos", subcategory: "Pigmentos", hex: "#D6ED00" },

    // GLITTERS
    { name: "Glitter Multicolor", category: "glitters", classKey: "glitters", subcategory: "Glitters", hex: "#EAEAEA" },
    { name: "Glitter Plata", category: "glitters", classKey: "glitters", subcategory: "Glitters", hex: "#C0C0C0" },
    { name: "Glitter Dorado", category: "glitters", classKey: "glitters", subcategory: "Glitters", hex: "#D4AF37" },
    { name: "Glitter Rosa", category: "glitters", classKey: "glitters", subcategory: "Glitters", hex: "#FFB6C1" },

    // PRODUCTOS AUXILIARES (Químicos/Líquidos neutros)
    { name: "Alfamilaza", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Enzimas", hex: "#FFFFFF" },
    { name: "Enzima Ácida", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Enzimas", hex: "#FFFFFF" },
    { name: "Enzima Neutra", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Enzimas", hex: "#FFFFFF" },
    { name: "Detergente Neutro", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Detergentes", hex: "#FFFFFF" },
    { name: "Detergente Alcalino", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Detergentes", hex: "#FFFFFF" },
    { name: "Betes Clean", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Detergentes", hex: "#FFFFFF" },
    { name: "Humectante", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Humectantes", hex: "#FFFFFF" },
    { name: "Fijador", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Fijadores", hex: "#FFFFFF" },
    { name: "Base Bloqueador Poliéster", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Bloqueadores", hex: "#FFFFFF" },
    { name: "Dispersante para Nylon", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Dispersantes", hex: "#FFFFFF" },
    { name: "Dispersante", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Dispersantes", hex: "#FFFFFF" },
    { name: "Disp. p/ algodón", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Dispersantes", hex: "#FFFFFF" },
    { name: "Base Suavizante Miel", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Suavizantes", hex: "#FFFFFF" },
    { name: "Suavizante para Nylon", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Suavizantes", hex: "#FFFFFF" },
    { name: "Silicon", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Suavizantes", hex: "#FFFFFF" },
    { name: "Bínder", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Otros", hex: "#FFFFFF" },
    { name: "Secuestrante", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Otros", hex: "#FFFFFF" },
    { name: "Antiespumante", category: "auxiliares", classKey: "auxiliares", subcategory: "Auxiliares - Otros", hex: "#FFFFFF" },

    // BLANCOS ÓPTICOS
    { name: "White BYX H/C", category: "blancos", classKey: "blancos", subcategory: "Blancos Ópticos - Para Algodón", hex: "#FFFFFF" },
    { name: "Óptico Stone 2B", category: "blancos", classKey: "blancos", subcategory: "Blancos Ópticos - Para Algodón", hex: "#FFFFFF" },
    { name: "Óptico Abrillantador 2B", category: "blancos", classKey: "blancos", subcategory: "Blancos Ópticos - Para Algodón", hex: "#FFFFFF" },
    { name: "White Cotton NS", category: "blancos", classKey: "blancos", subcategory: "Blancos Ópticos - Para Algodón", hex: "#FFFFFF" },
    { name: "White BYX NYL H/C", category: "blancos", classKey: "blancos", subcategory: "Blancos Ópticos - Para Nylon", hex: "#FFFFFF" },
    { name: "Abrillantador PET NSN", category: "blancos", classKey: "blancos", subcategory: "Blancos Ópticos - Para Poliéster", hex: "#FFFFFF" },
    { name: "Abrillantador PET NSB", category: "blancos", classKey: "blancos", subcategory: "Blancos Ópticos - Para Poliéster", hex: "#FFFFFF" },
    { name: "White OB-1", category: "blancos", classKey: "blancos", subcategory: "Blancos Ópticos - Para Plástico", hex: "#FFFFFF" }
];