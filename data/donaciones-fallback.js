const DONACIONES_FALLBACK = [
 ...["Jabón líquido","Desinfectante","Escoba","Recogedor","Franelas","Ambientadores","Limpia vidrios","Trapeador de tela","Papel higiénico","Detergente","Cera para muebles","Lavavajilla","Secadores","Lejía","Bolsas para basura"].map((nombre,i)=>({id:`limpieza-${i}`,nombre,categoria:"Limpieza",conseguido:false})),
 ...["Hojas de colores","Hojas Bond","Cinta de embalaje","Cinta masking"].map((nombre,i)=>({id:`otros-${i}`,nombre,categoria:"Otros",conseguido:false}))
];