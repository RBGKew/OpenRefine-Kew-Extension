DataTableColumnHeaderUI.extendMenu(function(column, columnHeaderUI, menu) {
    var columnIndex = Refine.columnNameToColumnIndex(column.name);
    var doAddColumnFromKew = function() {
        var o = DataTableView.sampleVisibleRows(column);;
        new KewExtendDataPreviewDialog(
            column, 
            columnIndex, 
            o.rowIndices, 
            function(extension) {
                Refine.postProcess(
                    "kew-extension",
                    "extend-data", 
                    {
                        baseColumnName: column.name,
                        columnInsertIndex: columnIndex + 1,
                        kewMqlUrl: KewExtendDataPreviewDialog.getKewMqlUrl()
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
            label: "Add columns from TPL ...",
            click: doAddColumnFromKew
        }
    );
});
