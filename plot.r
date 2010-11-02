# Compass data processing

conservative = c(0,-1)
liberal = c(0,1)
left = c(-1,0)
right = c(1,0)

normalizeVote <- function(value, vec) {
  vec * (value - 3)
}

getVector <- function(a) {
  colSums(getVectors(a))
}

politicalPoints <- function(list) {
  height <- length(list[,1])
  m <- matrix(ncol=2,nrow=height)

  for(i in 1:height) {
    m[i,] <- getVector(list[i,])
  }
  
  m
}

plotCompass <- function(frame,newdots=2) {
  coords <- politicalPoints(frame)
  nicks <- frame$Nimimerkki

  # Split the data to old and new
  newCoords <- tail(coords,newdots)
  oldCoords <- head(coords,-newdots)
  newNicks <- tail(nicks,newdots)
  oldNicks <- head(nicks,-newdots)
  
  plot(coords,
       type="n",
       main="Poliittinen kompassi",
       xlab="vasemmisto – oikeisto",
       ylab="konservatiivi – liberaali",
       xlim=c(-10,10),
       ylim=c(-10,10))

  # Leftrightconsulibe
  rect(-10,  0, 0,10,col="#FC9FC2")
  rect(-10,-10, 0, 0,col="#CE8A8A")
  rect(  0,  0,10,10,col="#B2BAF7")
  rect(  0,-10,10, 0,col="#9B9CC1")

  # Old points
  points(oldCoords,pch=1)

  # Anti-alias
  points(newCoords,pch=16,cex=1.5)
  points(newCoords,pch=1,cex=1.5)

  
  text(newCoords[,1],newCoords[,2],newNicks,cex=2,pos=3)
}
