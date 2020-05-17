/*  SOLDOKU - Solucionador de Sudokus
*/
// Declaració de variables globals
var sudoku = new Array(9);           // germen matriu del Sudoku
var xifraActual = 1; fila = 0; col = 0; // xifra, fila i columna actuals
var i = j = resoltes = flagResoltes = 0; // definició de variables i inicialitzar a 0

window.onload=inici;    // executar funció inici DESPRÉS de carregar tota la pàgina HTML 

// funció inicial per definir els events 
function inici() {
    document.getElementById(`bt${xifraActual - 1}`).style.backgroundColor = "green";    // activa la xifra 1 com a xifra actual
    /* Inicialitza la matriu amb tots els valors possibles */ 
    for (i = 0; i <= 8; i++) {
        sudoku[i] = new Array(9);           // Cada element del vector és un nou vector amb 9 elements
        for (j = 0; j <= 8; j++) {
            sudoku[i][j] = "123456789";     // valor inicial de cada cel·la
        }
    }
    /* Associa els botons a les seves funcions */
    for (i = 0; i <= 8; i++) {
        document.getElementById(`bt${i}`).onclick = triarXifra;
        for (j = 0; j <= 8; j++) {
            document.getElementById(`bt${i}${j}`).onclick = cella;
        }
    }
    document.getElementById("xu").onclick = xifraUnica;     // assigna funció al botó
    document.getElementById("par").onclick = cercarParelles;      // assigna funció al botó
}
/*----------------------------------------------------------------*/
/* funció al triar una xifra de la part inferior de pantalla */
function triarXifra(){
    document.getElementById(`bt${xifraActual - 1}`).style.backgroundColor = "blue";   // anula la selecció de la xifra anterior
    var x = this.parentNode.childNodes.length;
    for (i = 0; i <= x; i++) {
        if (this == this.parentNode.childNodes[i]) {
            break;
        }
    } 
    xifraActual = (i + 1) / 2;
    document.getElementById(`bt${xifraActual - 1}`).style.backgroundColor = "green";
    activarCaselles(xifraActual);   // activa només les caselles no resoltes que contenen la xifra actual
}
/*----------------------------------------------------------------*/
/* funció al clickar a una cel·la */
function cella(){
    // identifica la columna clickada
    var y = this.parentNode.parentNode;
    var x = y.childNodes.length;
    for (i = 0; i <= x; i++) {
        if (this.parentNode == y.childNodes[i]) {
            break;
        }
    }
    col = (i - 1) / 2;

    // identifica la fila clickada
    var y = this.parentNode.parentNode.parentNode;
    var x = y.childNodes.length;
    for (i = 0; i <= x; i++) {
        if (this.parentNode.parentNode == y.childNodes[i]) {
            break;
        }
    }
    fila = i  / 2;

    // resolt la casella clickada
    resoldre(fila, col, xifraActual);
    // final de partida!
    if (resoltes == 81) {return;}
    // quan hi ha més de 20 caselles resoltes => intenta cercar parelles i xifres úniques
    if (resoltes > 20) {
        xifraUnica();
        cercarParelles();
    }
}
/*----------------------------------------------------------------*/
// assignar a la fila f, columna c, la xifra x
function resoldre(f, c, x) {
    var k = n = a = b = p = q = 0;  // Variables locals de la funció
    // li assigna el valor de la xifra actual
    sudoku[f][c] = x.toString();
    document.getElementById(`bt${f}${c}`).innerHTML = sudoku[f][c];
    document.getElementById(`bt${f}${c}`).onclick = "";  // bloqueja la cel·la resolta
    document.getElementById(`bt${f}${c}`).style.color = "red";  // li canvia el color
    document.getElementById(`bt${f}${c}`).style.backgroundColor = "yellow";  // li canvia el fons
    // control fi del Sudoku
    resoltes++;
    flagResoltes = 1;   // control de que es resolt alguna casella
    // final de partida!
    if (resoltes == 81) {
        document.getElementById("audi").play(); //melodia de premi
        return;
    } 
    // eliminar xifra a tota la fila
    for (k = 0; k <= 8; k++) {
        n = sudoku[f][k].indexOf(x);    // n = posició de la xifra al text de la cel·la actual o -1
        if (sudoku[f][k].length > 1 && n > -1) {        // si cel·la no està resolta i conté la xifra actual...
            sudoku[f][k] = sudoku[f][k].substring(0, n) + sudoku[f][k].substring(n+1);  // ...la elimina
            document.getElementById(`bt${f}${k}`).innerHTML = sudoku[f][k];
            document.getElementById(`bt${f}${k}`).onclick = "";     // desactiva la cel·la
            document.getElementById(`bt${f}${k}`).style.backgroundColor = "lightblue";  // li canvia el fons
            if (sudoku[f][k].length == 1) {     // queda només una xifra => casella resolta, premi!
                console.log("rf: " + f + "*" + k + "*" + sudoku[f][k]);
                resoldre(f, k, sudoku[f][k]);   // reitera la funció per eliminar el valor resolt
            }
        }
    }
    // eliminar xifra a tota la columna
    for (k = 0; k <= 8; k++) {
        n = sudoku[k][c].indexOf(x);
        if (sudoku[k][c].length > 1 && n > -1) {
            sudoku[k][c] = sudoku[k][c].substring(0, n) + sudoku[k][c].substring(n+1);
            document.getElementById(`bt${k}${c}`).innerHTML = sudoku[k][c];
            document.getElementById(`bt${k}${c}`).onclick = "";     // desactiva la cel·la
            document.getElementById(`bt${k}${c}`).style.backgroundColor = "lightblue";  // li canvia el fons
            if (sudoku[k][c].length == 1) {     // queda només una xifra => casella resolta
                console.log("rc: " + k + "*" + c + "*" + sudoku[k][c]);
                resoldre(k, c, sudoku[k][c]);   
            }
        }
    }
    // eliminar xifra a tot el quadrant
    p = Math.floor(f/3 % 3); // quadrantx 0,1,2
    q = Math.floor(c/3 % 3);  // quadranty 0,1,2
    for (k = 0; k <= 8; k++) {
        a = k%3 + p*3;
        b = Math.floor(k/3) + q*3;
        n = sudoku[a][b].indexOf(x);
        if (sudoku[a][b].length > 1 && n > -1) {
            sudoku[a][b] = sudoku[a][b].substring(0, n) + sudoku[a][b].substring(n+1);
            document.getElementById(`bt${a}${b}`).innerHTML = sudoku[a][b];
            document.getElementById(`bt${a}${b}`).onclick = "";     // desactiva la cel·la
            document.getElementById(`bt${a}${b}`).style.backgroundColor = "lightblue";  // li canvia el fons
            if (sudoku[a][b].length == 1) {     // queda només una xifra => casella resolta
                console.log("rq: " + a + "*" + b + "*" + sudoku[a][b]);
                resoldre(a, b, sudoku[a][b]);   
            }
        }
    }
}
/*----------------------------------------------------------------*/
/* funció per validar valors únic possible */
function xifraUnica(){
    x = f = c = p = q = primeraCoincidencia = 0;      // variables locals
    flagResoltes = 0;
    /* Mira a cada xifra si només hi ha una casella an la fila/col/quad en que pugui estar */
    for (x = 1; x <= 9; x++) {
        var xtext = x.toString();

    /* revisar cada fila */
        for (f = 0; f <= 8; f++) {
            primeraCoincidencia = 9;    // 9 = cap casella que pugui tenir la xifra
            for (c = 0; c <= 8; c++) {
                if (sudoku[f][c] == xtext) {break;} // cel·la resolta i és la xifra en recerca
                n = sudoku[f][c].indexOf(xtext);
                if (sudoku[f][c].length > 1 && n > -1) {    // casella no resolta que conté la xifra
                    if (primeraCoincidencia == 9) 
                        {primeraCoincidencia = c;}  // guarda quina és la primera columna que conté la xifra
                    else 
                        {primeraCoincidencia = 9; break;} // més de 2 possibilitats => no fer res, pasar a fila següent
                }
            }
            // desprès de mirar tota la fila pregunta si només una casella conté la xifra
            if (primeraCoincidencia != 9) {     // només hi ha una casella que pugui ser la xifra cercada
                console.log("Uf: " + f + "*" + primeraCoincidencia + "*" + xtext);
                resoldre(f, primeraCoincidencia, x);        // resolt la casella 
                flagResolta = 1;      // control de que s'han resolt caselles
            }
        }
        /* a cada columna */
        for (c = 0; c <= 8; c++) {
            primeraCoincidencia = 9;    // 9 = cap casella que pugui tenir la xifra
            for (f = 0; f <= 8; f++) {
                if (sudoku[f][c] == xtext) {break}  // cel·la resolta i és la xifra en recerca
                n = sudoku[f][c].indexOf(xtext);
                if (sudoku[f][c].length > 1 && n > -1) {    // casella no resolta que conté la xifra
                    if (primeraCoincidencia == 9) 
                        {primeraCoincidencia = f;}
                    else 
                        {primeraCoincidencia = 9; break;} // més de 2 possibilitats => pasar al següent
                }
            }
            // desprès de mirar tota la columna sense breaks 
            if (primeraCoincidencia != 9) {     // només hi ha una casella que pugui ser la xifra cercada
                console.log("Uc: " + primeraCoincidencia + "*" + c + "*" + xtext);
                resoldre(primeraCoincidencia, c, x);        // resolt la casella 
            }
        }
        /* a cada quadrant */
        for (i = 0; i <= 8; i++) {
            primeraCoincidencia = 9;    // 9 = cap casella que pugui tenir la xifra
            p = Math.floor(i/3 % 3); // quadrantx 0,1,2
            q = Math.floor(i % 3);  // quadranty 0,1,2
            for (k = 0; k <= 8; k++) {
                f = k%3 + p*3;
                c = Math.floor(k/3) + q*3;
                if (sudoku[f][c] == xtext) {break}  // cel·la resolta i és la xifra en recerca
                n = sudoku[f][c].indexOf(xtext);
                if (sudoku[f][c].length > 1 && n > -1) {    // casella no resolta que conté la xifra
                    if (primeraCoincidencia == 9) 
                        {primeraCoincidencia = k;}
                    else 
                        {primeraCoincidencia = 9; break;} // més de 2 possibilitats => pasar al següent
                }
            }
            // desprès de mirar tot el quadrant sense breaks 
            if (primeraCoincidencia != 9) {     // només hi ha una casella que pugui ser la xifra cercada
                f = primeraCoincidencia%3 + p*3;
                c = Math.floor(primeraCoincidencia/3) + q*3;
                console.log("Uq: " + f + "*" + c + "*" + xtext);
                resoldre(f, c, x);        // resolt la casella 
            }
        }
    }
    if (flagResoltes > 0) {xifraUnica()}   // si resolt caselles => reitera per veure si pot resoldre més
}
/*----------------------------------------------------------------*/
/* funció per validar parelles de valors */
function cercarParelles(){
    var f = c = k = l = pi = qi = pj = qj = x1 = x2 = 0;   // variables locals de la funció
    var parelles = [];           // array de parelles
    flagResoltes = 0;           // inicilaitza indicador de si resolt alguna casella
    /* Cerca totes les caselles amb només 2 valors possibles */
    for (f = 0; f <= 8; f++) {
        for (c = 0; c <= 8; c++) {
            if (sudoku[f][c].length == 2) {
                var parella = [f, c, sudoku[f][c]];   // array amb coordenades i valor de la parella
                parelles.push(parella);     // afegeix la parella a la llista
            }
        }
    }
    /* cerca parelles iguals */
    l = parelles.length - 1;
    for (i = 0; i < l; i++) {
        x1 = parelles[i][2].substring(0,1); // primera xifra de la parella
        x2 = parelles[i][2].substring(1,2); // segona xifra de la parella
        for (j = i + 1; j <= l; j++) {
            if (parelles[j][2] == parelles[i][2]) {     // 2 parelles iguals
                if (parelles[j][0] == parelles[i][0]) {     // mateix valor i fila
                    for (k = 0; k <= 8; k++) {  // revisa tota la fila de les 2 parelles
                        // si una casella NO està resolta i no és la de les 2 parelles, li treu les 2 xifres
                        if (sudoku[parelles[i][0]][k].length > 1 && sudoku[parelles[i][0]][k] != parelles[i][2]) { 
                            treuXifres(parelles[i][0],k,x1,x2); // treu com a valor possible les 2 xifres de la parella
                        }
                    }
                }
                if (parelles[j][1] == parelles[i][1]) {     // mateix valor i columna
                    for (k = 0; k <= 8; k++) {  // revisa tota la columna de les 2 parelles
                        // si una casella NO està resolta i no és la de les 2 parelles, li treu les 2 xifres
                        if (sudoku[k][parelles[i][1]].length > 1 && sudoku[k][parelles[i][1]] != parelles[i][2]) { 
                            treuXifres(k,parelles[i][1],x1,x2); // treu com a valor possible les 2 xifres de la parella
                        }
                    }
                }
                pi = Math.floor(parelles[i][0]/3); // quadrantx 0,1,2
                qi = Math.floor(parelles[i][1]/3);  // quadranty 0,1,2
                pj = Math.floor(parelles[j][0]/3); // quadrantx 0,1,2
                qj = Math.floor(parelles[j][1]/3);  // quadranty 0,1,2
                if (pi == pj && qi == qj) {         // mateix valor i quadrant
                    for (k = 0; k <= 8; k++) {  // revisa tot el quadrant de les 2 parelles
                        f = k%3 + pi*3;
                        c = Math.floor(k/3) + qi*3;
                        // si una casella NO està resolta i no és la de les 2 parelles, li treu les 2 xifres
                        if (sudoku[f][c].length > 1 && sudoku[f][c] != parelles[i][2]) { 
                            treuXifres(f,c,x1,x2); // treu com a valor possible les 2 xifres de la parella
                        }
                    }
                }
            }
        }
    }
    if (flagResoltes > 0) {cercarParelles()}   // si resolt caselles => reitera per veure si pot resoldre més
    else {activarCaselles(xifraActual);}   // activa només les caselles no resoltes que contenen la xifra actual
}
/*----------------------------------------------------------------*/
/* funció per validar activar caselles valides per a la xifra activada */
function activarCaselles(xifra) {
    for (i = 0; i <= 8; i++) {
        for (j = 0; j <= 8; j++) {
            if (sudoku[i][j].length > 1) {        // si cel·la no està resolta ...
                n = sudoku[i][j].indexOf(xifra);    // n = posició de la xifra al text de la cel·la actual o -1
                if (sudoku[i][j].length > 1 && n > -1) {        // ... i conté la xifra actual...
                    document.getElementById(`bt${i}${j}`).onclick = cella;  //... la habilita
                    document.getElementById(`bt${i}${j}`).style.backgroundColor = "white";  // li canvia el fons
                } else {
                    document.getElementById(`bt${i}${j}`).onclick = "";     //... la deshabilita
                    document.getElementById(`bt${i}${j}`).style.backgroundColor = "lightblue";  // li canvia el fons
                }
            }
        }
    }
}
/*----------------------------------------------------------------*/
/* elimina d'una casella 2 xifres com a possibles */
function treuXifres(f,c,x1,x2) {
    var n = 0;
    n = sudoku[f][c].indexOf(x1);    // n = posició de la xifra al text de la cel·la actual o -1
    if (n > -1) {        // si cel·la conté la xifra actual...
        sudoku[f][c] = sudoku[f][c].substring(0, n) + sudoku[f][c].substring(n+1);  // ...la elimina
    }
    n = sudoku[f][c].indexOf(x2);    // n = posició de la xifra al text de la cel·la actual o -1
    if (n > -1) {        // si cel·la conté la xifra actual...
        sudoku[f][c] = sudoku[f][c].substring(0, n) + sudoku[f][c].substring(n+1);  // ...la elimina
    }
    document.getElementById(`bt${f}${c}`).innerHTML = sudoku[f][c];     // actualitza les dades a pantalla
    if (sudoku[f][c].length == 1) {     // queda només una xifra => casella resolta, premi!
        console.log("rp: " + f + "*" + c + "*" + sudoku[f][c]);
        resoldre(f, c, sudoku[f][c]);   // funció per resoldre la casella
    }
}