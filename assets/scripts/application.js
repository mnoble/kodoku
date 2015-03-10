(function($, ko) {
    var LOCAL_STORAGE_KEY = "kodoku";

    var Document = function (title, content) {
        this.title    = ko.observable(title || "Untitled Document");
        this.content  = ko.observable(content);
    };

    var ViewModel = function (documents) {
        this.documents = ko.observableArray(documents.map(function (document) {
            return new Document(document.title, document.content);
        }));

        this.mode = ko.observable("normal");
        this.modeTimeout = null;

        this.lastActiveDocument = this.documents()[0];

        /* Event Handlers */

        this.mouseDidMove = function () {
            this.enableNormalMode();
        };

        /* Modes */

        this.enableNormalMode = function () {
            this.mode("normal");

            clearTimeout(this.modeTimeout);

            this.modeTimeout = setTimeout(function () {
                this.enableEditMode();
            }.bind(this), 2000);
        };

        this.enableEditMode = function () {
            this.mode("edit");
        };

        /* Documents */

        this.open = function (document) {
            this.lastActiveDocument = this.activeDocument();
            this.activeDocument(document);
            $("#document").html(this.activeDocument().content());
        }.bind(this);

        this.save = function (document, event) {
            document.content(event.target.innerHTML);
        };

        this.newDocument = function () {
            var document = new Document();
            this.activeDocument(document);
            this.documents.push(document);
        }.bind(this);

        this.removeDocument = function (document) {
            this.documents.remove(document);
            this.activeDocument(this.lastActiveDocument);
        }.bind(this);

        ko.computed(function () {
            localStorage.setItem(LOCAL_STORAGE_KEY, ko.toJSON(this.documents));
        }.bind(this)).extend({
            rateLimit: { timeout: 250, method: "notifyWhenChangesStop" }
        });

        /* Event Bindings */

        $(document).on("mousemove", function (event) {
            this.mouseDidMove(event);
        }.bind(this));

        $(document).on("keypress", function (event) {
            this.keyDidPress(event);
        }.bind(this));

        /* Initialization */

        this.activeDocument = ko.observable(this.lastActiveDocument);
        this.open(this.activeDocument());
        this.enableNormalMode();
    };

    var documents = ko.utils.parseJson(localStorage.getItem(LOCAL_STORAGE_KEY));
    var viewModel = new ViewModel(documents || []);

    ko.applyBindings(viewModel);
})(Zepto, ko);
