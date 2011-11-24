function(doc) {
    if (doc.arvonta != true) return; // Ingen vinst.
    emit(Math.random(),null); // Emit random number as a key.
}
