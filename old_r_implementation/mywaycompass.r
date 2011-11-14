# Compass used in My Way Expo

source("plot.r")
source("google.r")

getVectors <- function(a) {
  rbind(normalizeVote(a$"Maahanmuutto",liberal),
        normalizeVote(a$"Tuomiot",liberal),
        normalizeVote(a$"Aseet",liberal),
        normalizeVote(a$"Homojen oikeudet",liberal),
        normalizeVote(a$"Asevelvollisuus",liberal),
        normalizeVote(a$"Veroaste",right),
        normalizeVote(a$"Veroprogressio",right),
        normalizeVote(a$"Kehitysyhteistyö",right),
        normalizeVote(a$"Palkka",right),
        normalizeVote(a$"Talous",right)
        )
}

