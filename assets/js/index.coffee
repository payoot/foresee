validateRoomName = (roomName) ->
  if (roomName == "")
    return false
  else
    return true

window.validateRoomName = validateRoomName

$ ->
  $("#createRoom").click( () ->
    roomname = $("#id").val()
    if (validateRoomName(roomname))
      document.location = "host/" + roomname
    else
      $("#mod_message").html("room name must not be blank.")
    return false
  )
