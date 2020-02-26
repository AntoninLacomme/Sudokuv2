
class KeyBoard {
	/// ma grande classe KeyBoard

	constructor (plateau) {
		/// commençons par créer notre constructeur
		this.main = document.createElement("DIV");
		this.main.onselectstart = new Function ("return false");
		this.mywindow = plateau;
		this.varcss;
		this.Load();
	}

	Load(){
		/// cette fonction importe le fichier json stockant le css du keyboard dans une variable globale this.varcss
		/*var request = new XMLHttpRequest();
		request.open('GET', "keyboard/meta/file.json");
		request.responseType = 'json';
		request.send();

		var upper = this;
		request.onload = function () {
			if (request.readyState == 4 && request.status == 200) {*/
				this.varcss = {
					"main": [
						{
						"width": "145px",
						"border": "solid thin black",
						"borderRadius": "15px",
						"marginLeft": "20px",
						"backgroundColor": "#ccc"
						}
					],


					"touche": [
						{
						"padding": "5px",
						"margin": "10px",
						"border": "solid thin black",
						"borderRadius": "10px",
						"boxShadow": "3px 3px 5px #888",
						"width": "40px",
						"height": "40px",
						"textAlign": "center",
						"verticalAlign": "middle",
						"backgroundColor": "ivory",
						"display": "inline-block",
						"fontSize": "35px"
						}
					],
					"toucheevdown": [
						{
							"backgroundColor": "rgb(120, 120, 120)"
						}
					],
					"toucheevup": [
						{
							"backgroundColor": "ivory"
						}
					],
					"toucheevover": [
						{
							"width": "50px",
							"height": "50px",
							"margin": "5px",
							"fontSize": "45px",
							"boxShadow": "5px 5px 8px #888"
						}
					],
					"toucheevout": [
						{
							"width": "40px",
							"height": "40px",
							"margin": "10px",
							"fontSize": "35px",
							"boxShadow": "3px 3px 5px #888",
							"backgroundColor": "ivory"
						}
					],

					"ecran":[
						{
						"border": "solid thin black",
						"borderRadius": "10px",
						"width": "40px",
						"height": "40px"
						}
					],
					"ecranevover":[
						{
						"width": "50px",
						"height": "50px"
						}
					],
					"ecranevout":[
						{
						"width": "40px",
						"height": "40px"
						}
					]
				}

				/// application du css global du clavier
				this.applicationJson2Css(this.main, "main");

				/// création des touches de 1 à 9 et application de leur css
				for (var i=1; i<=9; i++){
					this.main.append(this.createNumberTouch(i));
				}
				this.main.append(this.createCallBackTouch('◄'));
				var arraycolor = new Array("black", "blue", "red", "yellowgreen");
				for (var val in arraycolor){
					this.main.append(this.createColorTouch(arraycolor[val]));
				}

			}
		//}
	//}

	createCallBackTouch (val){
		/// cette fonction crée une touche numérique équivalente au ctrl + z
		var touch = document.createElement("DIV");
		touch.innerHTML = val; 								  // on lui donne sa valeur
		touch.value = "*";

		this.addEvents(touch);

		return touch;
	}

	createNumberTouch (val) {
		/// cette fonction crée une nouvelle touche numérique dans le clavier

		var touch = document.createElement("DIV");
		touch.innerHTML = val; 								  // on lui donne sa valeur
		touch.value = val;

		this.addEvents(touch);

		return touch;
	}

	createColorTouch (color) {
		/// cette foncrion crée une nouvelle touche de couleur dans le clavier

		var touch = document.createElement("DIV");
		var ecran = document.createElement("DIV");
		touch.value = color;

		ecran.style.backgroundColor = color;
		this.applicationJson2Css(ecran, "ecran");
		touch.addEventListener("mouseover", (event) => {
			this.applicationJson2Css(ecran, "ecranevover");
		});
		touch.addEventListener("mouseout", (event) => {
			this.applicationJson2Css(ecran, "ecranevout");
		});


		touch.append(ecran);
		this.addEvents(touch);
		return touch;
	}

	addEvents (touch) {
		var upper = this;
		touch.onselectstart = new Function ("return false");

		// saisie d'un évènement lié à cet objet
		touch.addEventListener("mousedown", (event) => {
			upper.applicationJson2Css(touch, "toucheevdown");
			upper.mywindow.SetValue(upper.mywindow.focuscell, touch.value);
		});

		touch.addEventListener("mouseup", (event) => {
			upper.applicationJson2Css(touch, "toucheevup");
		});

		touch.addEventListener("mouseover", (event) => {
			upper.applicationJson2Css(touch, "toucheevover");
		});

		touch.addEventListener("mouseout", (event) => {
			upper.applicationJson2Css(touch, "toucheevout");
		})

		// saisie d'un css lié au fichier json
		upper.applicationJson2Css(touch, "touche");
	}

	applicationJson2Css (obj, key) {
		for (var val in this.varcss[key][0]){
			obj.style[val] = this.varcss[key][0][val];
		}
	}

	SetWindow (window){
		this.mywindow = window;
	}

	GetMain () {
		return this.main;
	}
}


function GetKeyBoard (plateau) {
	return new KeyBoard(plateau).GetMain();
}
