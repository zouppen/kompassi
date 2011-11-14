# Compass data fetching

library(RGoogleDocs)

getCompassSheet <- function(username, password) {
  auth <- getGoogleAuth(username, password, service="wise")
  con <- getGoogleDocsConnection(auth)
  docs <- getDocs(con)
  form <- getWorksheets(docs$`Poliittinen kompassi`, con)
  form$Sheet1
}

getCompassMatrix <- function(sheet) {
  sheetAsMatrix(sheet, header = TRUE, as.data.frame = TRUE, trim = TRUE)
}
