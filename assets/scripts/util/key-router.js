App.Util.KeyRouter = {
	keys: {
		8  : "backspace",
		9  : "tab",
		13 : "enter",
		16 : "shift",
		17 : "ctrl",
		18 : "alt",
		20 : "caps lock",
		27 : "escape",
		32 : "space",
		33 : "page up",
		34 : "page down",
		35 : "end",
		36 : "home",
		37 : "left",
		38 : "up",
		39 : "right",
		40 : "down",
		45 : "insert",
		46 : "delete",
		48 : "0",
		49 : "1",
		50 : "2",
		51 : "3",
		52 : "4",
		53 : "5",
		54 : "6",
		55 : "7",
		56 : "8",
		57 : "9",
		65 : "a",
		66 : "b",
		67 : "c",
		68 : "d",
		69 : "e",
		70 : "f",
		71 : "g",
		72 : "h",
		73 : "i",
		74 : "j",
		75 : "k",
		76 : "l",
		77 : "m",
		78 : "n",
		79 : "o",
		80 : "p",
		81 : "q",
		82 : "r",
		83 : "s",
		84 : "t",
		85 : "u",
		86 : "v",
		87 : "w",
		88 : "x",
		89 : "y",
		90 : "z",
		93 : "select",
	},

	routes: {},

	register: function (keystroke, message) {
		this.routes[keystroke] = message;
	},

	listen: function (responder) {
		this.responder = responder;
		$(document).on("keyup", $.proxy(this.dispatch, this));
	},

	dispatch: function (event) {
		var keystroke = "";

		if (event.altKey) {
			keystroke = keystroke + "alt+";
		}

		if (event.ctrlKey) {
			keystroke = keystroke + "ctrl+";
		}

		if (event.metaKey) {
			keystroke = keystroke + "meta+";
		}

		keystroke = keystroke + this.keys[event.which];

		if (keystroke in this.routes && this.responder[this.routes[keystroke]]) {
			this.responder[this.routes[keystroke]](event);
		}
	}
}
