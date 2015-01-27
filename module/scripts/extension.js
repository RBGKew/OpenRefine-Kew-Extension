// Internationalization init
var lang = navigator.language.split("-")[0] || navigator.userLanguage.split("-")[0];
var dictionary = "";
$.ajax({
	url : "command/core/load-language?",
	type : "POST",
	async : false,
	data : {
	  module : "kew-extension",
//		lang : lang
	},
	success : function(data) {
		dictionary = data;
	}
});
$.i18n.setDictionary(dictionary);
// End internationalization

DataTableColumnHeaderUI.extendMenu(function(column, columnHeaderUI, menu) {
    var columnIndex = Refine.columnNameToColumnIndex(column.name);
    var doAddColumnFromKew = function() {
        var o = DataTableView.sampleVisibleRows(column);;
        new KewExtendDataPreviewDialog(
            column, 
            columnIndex, 
            o.rowIndices, 
            function(extension, url) {
                Refine.postProcess(
                    "kew-extension",
                    "extend-data", 
                    {
                        baseColumnName: column.name,
                        columnInsertIndex: columnIndex + 1,
                        kewMqlUrl: url
                    },
                    {
                        extension: JSON.stringify(extension)
                    },
                    { rowsChanged: true, modelsChanged: true }
                );
            }
        );
    };

    MenuSystem.insertAfter(
        menu,
        [ "core/edit-column", "core/add-column-by-fetching-urls" ],
        {
            id: "kew/add-columns-from-kew",
            label: $.i18n._('kew-mql')["mql-menu"],
            click: doAddColumnFromKew
        }
    );
});
