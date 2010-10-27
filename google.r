# Compass data fetching

getCompassSheet <- function(username, password) {
  auth <- getGoogleAuth(username, password, service="wise")
  con <- getGoogleDocsConnection(auth)
  form <- getWorksheets(a$`Poliittinen kompassi`, con)
  form$Sheet1
}

getCompassMatrix <- function(sheet) {
  sheetAsMatrix(sheet, header = TRUE, as.data.frame = TRUE, trim = TRUE)
}
