# This needs connection to sheet ('sheet') to work

library(RGoogleDocs)
source("mywaycompass.r")
source("passwd.r")

sheet <- getCompassSheet(username,password)
frame <- getCompassMatrix(sheet)
png(filename="kompassi.png",width=750,height=750)
plotCompass(frame,newdots=5)
dev.off()
