/* global ReconnectingWebSocket loadedAnim */

/*
  these two are the names for the tabs in scoreboard-assistant
  use one 2p+ and one 4-text tab
*/
const primaryTab = "main"
const commentatorTab = "commentators"

const socketUrl = "ws://localhost:58341"
const websocket = new ReconnectingWebSocket(socketUrl)

let loading = true

websocket.onopen = () => {
  websocket.send(primaryTab)
  websocket.send(commentatorTab)
}

websocket.onmessage = msg => {
  const data = JSON.parse(msg.data)

  console.log(`${socketUrl} sent data for "${data.tabID}"`, data)

  if (loading) {
    updateBoardInit(msg.data, data.tabID)
    
    if (data.tabID === commentatorTab)
      loading = false
  } else {
    updateBoard(msg.data, data.tabID)
  }
}

function updateBoardInit(response, tab) {
  console.log("LOADING()")

  const data = JSON.parse(response)

  for (const property in data) { // change data
    const item = $(`[data-tab=${tab}][data-sb=${property}]`)

    if (property.startsWith("image"))
      item.attr("src", `./img/chars/${data[property]}.png`)
    else
      item.text(data[property])

  }

  if (tab === commentatorTab)
    loadedAnim()

  const showCommentators = commentatorsHaveText(data)

  if (tab === commentatorTab && showCommentators)
    $("#subBar").css("opacity", 1)
}

function updateBoard(response, tab) {
  console.log("UPDATE()")

  const data = JSON.parse(response)

  for (const key in data) { // animate opacity down
    const value = data[key]
    const item = $(`[data-tab=${tab}][data-sb=${key}]`)

    // iife, to make data[property] available in all functions
    ;((innerKey, innerValue) => {

      if (innerKey.startsWith("image")) {

        if (item.attr("src") !== `./img/chars/${innerValue}.png`) { // if src="" is not equal to new src
          item.animate({opacity: 0}, "fast", function() {
            $(this).attr("src", `./img/chars/${innerValue}.png`)
            $(this).animate({opacity: 1}, "fast")
          })
        }

      } else {

        if (item.text() !== innerValue) { // if text is not equal to new text
          console.log("fade-out")
          item.animate({opacity: 0}, "fast", null, function() {
            $(this).text(innerValue)
            console.log("fade-in")
            $(this).animate({opacity: 1}, "fast", null, function() {
              console.log("done")
            })
          })
        }
        
      }
    })(key, value) // pass the two as the new value and property
  }

  if (tab === commentatorTab) {
    const showCommentators = commentatorsHaveText(data)

    if (showCommentators)
      $("#subBar").animate({opacity: 1}, "fast")
    else
      $("#subBar").animate({opacity: 0}, "fast")

  }
}

function commentatorsHaveText(data) {
  let t1 = false, t2 = false
  if (data.text1 && data.text1.trim()) t1 = true
  if (data.text2 && data.text2.trim()) t2 = true

  return t1 || t2
}
