function(doc) {
    var key = null;
    if (doc.kiinnostus) key = "kiinnostus";
    if (doc.liittyminen) key = "liittyminen";
    if (key != null) emit(key,null);
}
