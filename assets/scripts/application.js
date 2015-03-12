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

        /* Event Handlers */

        $(document).on("mousemove", function (event) {
            this.enableNormalMode();
        }.bind(this));

        /* Modes */

        this.enableNormalMode = function () {
            this.mode("normal");

            clearTimeout(this.modeTimeout);

            // Fade out the UI after 2 seconds of no mouse use.
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
            $("#document").html(document.content());
        }.bind(this);

        this.save = function (document) {
            document.title($("#title").text());
            document.content($("#document").html());
        };

        this.newDocument = function () {
            var document = new Document();
            this.documents.push(document);
            this.open(document);
        }.bind(this);

        this.removeDocument = function () {
            this.documents.remove(this.activeDocument());
            this.activeDocument(this.lastActiveDocument);
        }.bind(this);

        // Knockout watches changes to models and stores them in localStorage when
        // they change. The rate limit ensures Knockout only does that once every
        // quarter of a second.
        //
        ko.computed(function () {
            localStorage.setItem(LOCAL_STORAGE_KEY, ko.toJSON(this.documents));
        }.bind(this)).extend({
            rateLimit: { timeout: 250, method: "notifyWhenChangesStop" }
        });

        /* Key Stroke Routing */

        App.Util.KeyRouter.register("ctrl+backspace", "removeDocument");
        App.Util.KeyRouter.register("ctrl+n", "newDocument");
        App.Util.KeyRouter.listen(this);

        /* Initialization */

        this.mode = ko.observable("normal");
        this.modeTimeout = null;

        this.lastActiveDocument = this.documents()[0];
        this.activeDocument     = ko.observable(this.lastActiveDocument);

        this.open(this.activeDocument());

        this.enableNormalMode();
    };

    var documents = ko.utils.parseJson(localStorage.getItem(LOCAL_STORAGE_KEY));
    var viewModel = new ViewModel(documents || [new Document()]);

    ko.applyBindings(viewModel);
})(Zepto, ko);
