class Sudoku{

	/// 				 ///
	/// Mon Constructeur ///
	/// 				 ///
	constructor () {
		this.grille = this.newEmptyGrid();
		this.Generation();
	}

	///											 ///
	/// fonction retournant une matrice 9x9 vide ///
	///											 ///
	newEmptyGrid (val = true) {
		var tab = new Array(9); 						// création d'une liste de 9 éléments
		for (var i=0; i<9; i++){
			if (val){ 									// si val, on la remplie avec this.newEmptyGrid(false)
				tab[i] = this.newEmptyGrid(false);
			}
			else{ 										// si non val, on la remplie de 0
				tab[i] = 0;
			}
		}
		return tab; 									// et on retourna tab
	}

	/// 															   ///
	/// fonction créant une liste de chiffre 1 à 9 rangé aléatoirement ///
	/// 															   ///
	randRange () {
		var rng = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		var newrng = [];
		while (rng.length > 0){
			var acc = getRandomInt(rng.length) 		// on choisi un index aléatoire
			newrng.push(rng[acc]); 					// on ajoute la valeur de cet index dans newrng
			rng.splice(acc, 1) 						// et on supprime la valeur de cet index dans rng
		}
		return newrng;
	}

	///// Fonctions de Contrôle :
	isInLine (k, line){
		// fonction vérifiant si k est présent sur la ligne de grille
		for (var i=0; i<this.grille[line].length; i++){
			if (k == this.grille[line][i]){
				return false;
			}
		}
		return true;
	}

	isInColumn (k, column){
		// fonction vérifiant si k est présent sur la colonne de grille
		for (var i=0; i<this.grille.length; i++){
			if (k == this.grille[i][column]){
				return false;
			}
		}
		return true;
	}

	isInBlock (k, x, y){
		// fonction vérifiant si k est présent dans le bloc
		var accx = x - (x%3);
		var accy = y - (y%3);
		for (var i = accx; i < accx+3; i++){
			for (var j = accy; j < accy+3; j++){
				if (this.grille[i][j] == k){
					return false;
				}
			}
		}
		return true;
	}

	///// Génération de la Grille !

	Generation (pos = 0){
		if (pos >= 81){ 			// si pos > 9*9, soit quand on est sorti de la matrice
			return true;
		}

		var x = Math.trunc(pos / 9);
		var y = pos % 9;

		if (this.grille[x][y] != 0){
			return this.Generation(pos+1);
		}
		var range = this.randRange ();
		for (var i=0; i<range.length; i++) {
			var value = range[i];
			if (this.isInLine(value, x) && this.isInColumn(value, y) && this.isInBlock(value, x, y)){
				this.grille[x][y] = value;

				if (this.Generation(pos+1)){
					return true;
				}
			}
		}

		this.grille[x][y] = 0;
		return false;
	}


	///// on coupe dans la matrice ^^
	disabled (nbCases) {
		var listCases = this.AllCases();
		var Mdisabled = this.newEmptyGrid();
		for (var i=0; i<nbCases; i++){
			listCases.splice(getRandomInt(listCases.length), 1);
		}
		for (var i=0; i<listCases.length; i++){
			Mdisabled[listCases[i][0]][listCases[i][1]] = this.grille[listCases[i][0]][listCases[i][1]];
		}
		return Mdisabled;
	}

	AllCases () {
		var list = new Array(81);
		for (var i=0; i<81; i++){
			list[i] = [Math.trunc(i/9), i%9];
		}
		return list;
	}

	GetGrille (nb) {
		return this.disabled(nb);
	}
	
}


class VerificationSudoku {
	constructor (matrix, appelant) {
		this.grille = matrix;
		this.super = appelant;
		var myboolean = true;
		for (var ite = 0; ite < 81; ite++){
			var x = Math.trunc(ite / 9);
			var y = ite % 9;

			var count = this.CountLine(this.grille[x][y], x)+this.CountColumn(this.grille[x][y], y)+this.CountBlock(this.grille[x][y], x, y);
			if (count > 3){
				this.super.SetValueColor(ite, "red");
				myboolean = false;
			}
			
		}

		if (myboolean){
			this.super.SetAllValuesColor("green");
		}
	}

	CountLine (k, line){
		var acc = 0;
		for (var i=0; i<this.grille[line].length; i++){
			if (k == this.grille[line][i]){
				acc = acc+1;
			}
		}
		return acc;
	}

	CountColumn (k, column){
		var acc = 0;
		for (var i=0; i<this.grille.length; i++){
			if (k == this.grille[i][column]){
				acc = acc+1;
			}
		}
		return acc;
	}

	CountBlock (k, x, y){
		// fonction vérifiant si le nombre de fois où k apparait 
		var accx = x - (x%3);
		var accy = y - (y%3);
		var acc = 0;
		for (var i = accx; i < accx+3; i++){
			for (var j = accy; j < accy+3; j++){
				if (this.grille[i][j] == k){
					acc = acc +1;
				}
			}
		}
		return acc;
	}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}