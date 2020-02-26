class Window {
	constructor (nb, sudoku=false) {
		if (sudoku == false){this.grille = new Sudoku().GetGrille(nb);}
		else {this.grille = sudoku; }
		this.varcss;
		this.focusclign; 				// cette variable permet de gérer le clignotement de la cellule qui a le focus
		this.focuscell; 				// cette variable est la cellule qui a le focus
		this.defautcolor = "black"; 	// couleur par défaut
		this.pointcell; 				// cellule sur laquelle se trouve actuellement la sourie
		this.arraynbfocus; 				// array contenant toutes les div ayant pour valeur html la valeur de la main div sélectionnée

		this.memory = new Array(); 		// dans cette variable, nous stockons en mémoire chaque coup joué par l'utilisateur

		this.maindiv = document.createElement("DIV");
		this.Load();
	}

	Load () {
		/// cette fonction importe le fichier json stockant le css du plateau dans une variable globale this.varcss
		/*var request = new XMLHttpRequest();
		request.open('GET', "game/meta/fileWindow.json");
		request.responseType = 'json';
		request.send();

		var upper = this;
		request.onload = function () {
			if (request.readyState == 4 && request.status == 200) {*/
				this.varcss = {
					"main" : [
						{
							"margin": "auto auto",
							"width": "575px",
							"background-color": "grey"
						}
					],
					"span":[
						{
							"border": "solid 0px black",
							"borderRadius": "50%",
							"padding": "0px",
							"paddingLeft": "9px",
							"paddingRight": "9px"
						}
					],
					"spantrue":[
						{
							"border": "solid 3px yellowgreen"
						}
					],
					"spanfalse":[
						{
							"border": "solid 3px red"
						}
					],
					"cellule": [
						{
							"border": "solid thin black",
							"padding": "10px",
							"width": "35px",
							"height": "35px",
							"display": "inline-block",
							"textAlign": "center",
							"verticalAlign": "middle",
							"margin": "2px",
							"backgroundColor": "ivory",
							"fontSize": "35px"
						}
					],
					"celluleevdown": [
						{
							"backgroundColor": "rgb(190, 190, 190)"
						}
					],
					"celluleevover": [
						{
							"backgroundColor": "#eee"
						}
					],
					"cellulelineevover": [
						{
							"backgroundColor": "#eee"
						}
					],
					"celluleevout": [
						{
							"backgroundColor": "ivory"
						}
					],
					"cellulelineevout": [
						{
							"backgroundColor": "ivory"
						}
					],
					"celluleselected": [
						{
							"backgroundColor": "#ccc"
						}
					]
				};
				this.applicationJson2Css(this.maindiv, "main");
				for (var i=0; i <81; i++){
					this.maindiv.append(this.newDiv(i));
				}
				this.tryBorder();

				document.addEventListener("keydown", (event) => {
					var indexupdown = (tab, nb) => {
						for (var i=0; i<tab.length; i++){
							if (this.focuscell == tab[i]){
								var myindex = i +nb;
								if (myindex < 0){
									myindex = 81 + myindex;
								}
								else if (myindex > 80){
									myindex = myindex - 81;
								}
								return myindex;
							}
						}
						return -1;
					};


					var indexrightleft = (tab, nb) => {
						for (var i=0; i<tab.length; i++){
							if (this.focuscell == tab[i]){
								var myindex = i +nb;
								if (myindex%9 == 0 && i%9 == 8){
									myindex = myindex -9;
								}
								else if ((myindex%9 == 8 || myindex%9 == -1) && i%9 == 0){
									myindex = myindex +9;
								}
								return myindex;
							}
						}
						return -1;
					}


					this.placeColor(this.focuscell);
					try {
						if (event.key == "ArrowUp"){
							this.placeFocus(upper.maindiv.getElementsByTagName("DIV")[indexupdown(upper.maindiv.getElementsByTagName("DIV"), -9)]);
						}
						else if (event.key == "ArrowDown"){
							this.placeFocus(upper.maindiv.getElementsByTagName("DIV")[indexupdown(upper.maindiv.getElementsByTagName("DIV"), 9)]);
						}
						else if (event.key == "ArrowLeft"){
							this.placeFocus(upper.maindiv.getElementsByTagName("DIV")[indexrightleft(upper.maindiv.getElementsByTagName("DIV"), -1)]);
						}
						else if (event.key == "ArrowRight"){
							this.placeFocus(upper.maindiv.getElementsByTagName("DIV")[indexrightleft(upper.maindiv.getElementsByTagName("DIV"), 1)]);
						}
					}
					catch (error) {
					}
					if (event.key == "Backspace"){
						this.SetValue(this.focuscell, "Backspace");
					}
					else{
						try{
							if (event.key.length == 1 && parseInt(event.key) > 0){
								this.SetValue(this.focuscell, parseInt(event.key));
							}
						}
						catch (error) {
						}
					}
				});
			}
		//}
	//}

	newDiv (pos) {
		/// cette fonction est appelée à la génération du Sudoku
		/// elle crée une nouvelle cellule de la grille
		/// et lui adjoint tous les évènement auxquels elle doit réagir
		var x = Math.trunc(pos / 9);
		var y = pos % 9;

		var cellule = document.createElement("DIV");
		var cadre = document.createElement("SPAN");
		this.applicationJson2Css(cadre, "span");
		cellule.onselectstart = new Function ("return false");
		cellule.value = pos;
		var upper = this;
		if (this.grille[x][y] != 0) {
			cadre.innerHTML = this.grille[x][y];
			cellule.style.fontWeight = "bold";
			cellule.name = "main";
		}
		cellule.addEventListener ("mousedown", (event) => {
			upper.placeFocus(cellule);
			upper.hoverLine(cellule, "over");
			upper.useSelectedHtml(cadre.innerHTML);
		});
		cellule.addEventListener("mouseover", (event) => {
			upper.pointcell = cellule;
			upper.hoverLine(cellule, "over");
		});
		cellule.addEventListener("mouseout", (event) => {
			upper.pointcell = undefined;
			upper.hoverLine(cellule, "out");
		});
		this.applicationJson2Css(cellule, "cellule");
		cellule.append(cadre);
		return cellule;
	}

	placeFocus(cellule){
		/// cette fonction place le focus sur la case mise en paramètre
		/// elle affecte donc <cellule> à <this.focuscell>, et applique à cette cellule un clignotement
		function clignotement (cellule){
			/// fonction de clignotement de la cellule
			if (cellule.style.backgroundColor == upper.varcss["cellule"][0]["backgroundColor"]){
				cellule.style.backgroundColor = upper.varcss["celluleevdown"][0]["backgroundColor"];
			}
			else{
				cellule.style.backgroundColor = upper.varcss["cellule"][0]["backgroundColor"];
			}
		}

		var upper = this;
		try{
			// on applique à l'actuel focuscell la couleur qu'elle doit obtenir selon l'état actuel de la grille
			this.placeColor(this.focuscell);
		}
		catch (error) {}
		clearInterval(this.focusclign); 						// on supprime son clignotement
		this.focuscell = cellule;	 							// et enfin on met à jour la nouvelle cellule ayant le focus

		this.focuscell.style.backgroundColor = upper.varcss["celluleevdown"][0]["backgroundColor"];
		this.focusclign = setInterval(clignotement, 500, this.focuscell); 	// et on lui donne son clignotement
	}

	placeColor (cellule) {
		/// fonction appliquant sa couleur de fonc à <cellule> selon l'état actuel de la grille
		var upper = this;
		try
		{
			if (this.pointcell == cellule){
				/// si <cellule> est la div sur laquelle pointe la sourie :
				cellule.style.backgroundColor = this.varcss["celluleevover"][0]["backgroundColor"];
			}
			else if (isInArray(this.arraynbfocus, this.focuscell)){
				/// sinon si <cellule> est une des cellules actuellement en surbriance
				cellule.style.backgroundColor = this.varcss["celluleselected"][0]["backgroundColor"];
			}
			else if (this.searchHoverLine(this.pointcell).find(function(element) { return upper.focuscell == element}) != undefined)
			{
				/// sinon si <cellule> fait partie des cellules HoverLine
				cellule.style.backgroundColor = this.varcss["cellulelineevover"][0]["backgroundColor"];
			}
			else{
				/// sinon,
				cellule.style.backgroundColor = this.varcss["cellule"][0]["backgroundColor"];
			}
		}
		catch (error){
		}
	}

	selectdivbyhtml (val) {
		/// fonction retournant dans un tableau toutes les cellules ayant pour valeur val
		/// par exemple, si val=3, cette fonction rendra dans un tableau toutes les cellules dont l'innerHTML est égal à 3
		var tab = this.maindiv.getElementsByTagName("DIV");
		var tabres = new Array();
		for (var i = 0; i < tab.length; i++){
			if (tab[i].children[0].innerHTML == val){
				tabres.push(tab[i]);
			}
		}
		return tabres;
	}

	useSelectedHtml (val) {
		if (val != ""){
			try {
				for (var item in this.arraynbfocus){
					if (isInArray(this.searchHoverLine(this.pointcell), this.arraynbfocus[item])){
						this.arraynbfocus[item].style.backgroundColor = this.varcss["cellulelineevover"][0]["backgroundColor"];
					}
					else {
						this.arraynbfocus[item].style.backgroundColor = this.varcss["cellule"][0]["backgroundColor"];
					}
				}
			}
			catch(error) {}
			this.arraynbfocus = this.selectdivbyhtml(val);
			var event = "celluleselected";
		}
		else{
			var event = "cellule";
		}
		for (var i in this.arraynbfocus){
			this.arraynbfocus[i].style.backgroundColor = this.varcss[event][0]["backgroundColor"];
		}

		if (val == ""){
			this.arraynbfocus = new Array();
		}

	}

	applicationJson2Css (obj, key) {
		for (var val in this.varcss[key][0]){
			if (obj != this.focuscell){
				if (isInArray(this.arraynbfocus, obj)){
					obj.style.backgroundColor = this.varcss["celluleselected"][0]["backgroundColor"];
				}
				else{
					obj.style[val] = this.varcss[key][0][val];
				}
			}
		}
	}


	tryBorder (){
		var acctab = this.maindiv.getElementsByTagName("DIV");
		for (var i=0; i<acctab.length; i++){
			var mycellval = parseInt(acctab[i].value) % 27;
			if (Math.trunc(mycellval / 9) == 0){
				acctab[i].style.borderTop = "solid 5px black";
			}
			else if (Math.trunc(mycellval / 9) == 2){
				acctab[i].style.borderBottom = 'solid 5px black';
			}

			if (mycellval % 9 == 0 ||mycellval % 9 == 3 || mycellval % 9 == 6){
				acctab[i].style.borderLeft = "solid 5px black";
			}
			else if (mycellval % 9 == 2 || mycellval % 9 == 5 || mycellval % 9 == 8){
				acctab[i].style.borderRight = 'solid 5px black';
			}
		}
	}

	searchHoverLine (cellule){
		try
		{
			var accx = Math.trunc(parseInt(cellule.value) / 9);
			var accy = parseInt(cellule.value) % 9;

			var acctab = this.maindiv.getElementsByTagName("DIV");
			var restab = new Array();
			for (var i=0; i<acctab.length; i++)
			{
				var mycellval = parseInt(acctab[i].value);
				if (accx == Math.trunc(mycellval / 9) || accy == mycellval % 9)
				{
					try{
						restab.push(acctab[i]);
					}
					catch (error) {restab.push(acctab[i]);}
				}
			}
			return restab;
		}
		catch (error) { return new Array; }
	}

	hoverLine (cellule, event) {
		var acctab = this.searchHoverLine(cellule);
		for (var val in acctab)
		{
			this.applicationJson2Css(acctab[val], "cellulelineev" + event);
		}
		this.applicationJson2Css(cellule, "celluleev" + event);
	}


	callBack () {
		try {
			this.SetValue(this.memory[this.memory.length -1][0], this.memory[this.memory.length -1][1], false);
			this.memory.splice(this.memory.length-1, 1);
		}
		catch (error) {}
	}

	SetValue (cellule, nb, back=true) {
		try{
			if (this.focuscell.name != "main"){
				var past = cellule.children[0].innerHTML;
				if (nb == '*'){
					return this.callBack();
				}
				else if (nb == "Backspace"){
					cellule.children[0].innerHTML = "";
				}
				else if (nb.length > 1){
					this.defautcolor = nb;
					back = false;
				}
				else{
					cellule.children[0].innerHTML = nb;
				}

				if (back){
					this.memory.push(new Array(this.focuscell, past));
				}

				cellule.style.color = this.defautcolor;
				this.Victory(); 	// vérifions si l'on a gagné :)
			}
		}
		catch (error) { }
	}

	SetValueColor (pos, couleur) {
		try{
			var cadre = this.maindiv.getElementsByTagName("DIV")[pos].children[0];
			cadre.style.borderColor = couleur;
			cadre.style.borderWidth = "2px";
		}
		catch (error) {}
	}

	SetAllValuesColor (col) {
		Array.from(this.maindiv.getElementsByTagName("SPAN")).forEach(function (elem) {
			elem.style.borderColor = col;
			elem.style.borderWidth = "2px";
		});
	}

	CleanAllValuesColor () {
		var upper = this;
		Array.from(this.maindiv.getElementsByTagName("SPAN")).forEach(function (elem) {
			upper.applicationJson2Css(elem, "span");
		});
	}

	RefreshAll () {
		var upper = this;
		Array.from(this.maindiv.getElementsByTagName("DIV")).forEach(function (elem) {
			if (elem.name != 'main'){
				elem.children[0].innerHTML = '';
				elem.style.color = upper.defautcolor;
			}
		});
		this.CleanAllValuesColor();
		this.arraynbfocus.forEach((elem) => {
			elem.style.backgroundColor = upper.varcss["cellule"][0]["backgroundColor"];
		});
		this.arraynbfocus = new Array();
	}

	Victory () {
		/// fonction vérifiant si l'on a gagné ou toujours pas :)
		var matrix = this.GenerateMatrix();
		this.CleanAllValuesColor();
		for (var line in matrix){
			if (isInArray(matrix[line], 0)){
				return false;
			}
		}
		var upper = this;
		new VerificationSudoku(matrix, upper);
	}

	GenerateMatrix () {
		/// fonction convertissant le plateau affiché à l'écran en une matrice utilisable et compréhensible par l'ordinateur :)
		var tab = this.maindiv.getElementsByTagName("SPAN");
		var tabres = new Array();
		for (var i=0; i<9; i++){
			var line = new Array();
			for (var j=0; j<9; j++){
				if (tab[i*9 + j].innerHTML == ""){
					line[j] = 0;
				}
				else{
					line[j] = parseInt(tab[i*9 + j].innerHTML);
				}
			}
			tabres.push(line);
		}
		return tabres;
	}

	GetGrille () {
		return this.maindiv;
	}
}

function isInArray(array, val){
	for (var i in array){
		if (array[i] == val){ return true; }
	}
	return false;
}

function GetWindow () {
	return new Window().GetGrille();
}
