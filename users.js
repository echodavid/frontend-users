const url = API_URL + "/users";

function postUser() {
  const myUser = {
    name: $('#name').val(),
    email: $('#email').val(),
    age: $('#age').val(),
    comments: $('#comments').val(),
  };

  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(myUser),
    success: function (data) {
      console.log("Usuario creado:", data);
      showAlert("¡Usuario creado exitosamente!", "success");
      clearForm();
      getUsers();
    },
    error: function () {
      showAlert("Error al crear el usuario. Inténtalo de nuevo.", "danger");
    },
  });
}

function deleteUser(userId) {
  if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

  $.ajax({
    url: `${url}/${userId}`,
    type: 'DELETE',
    success: function (data) {
      console.log("Usuario eliminado:", data);
      showAlert("¡Usuario eliminado exitosamente!", "success");
      getUsers();
    },
    error: function () {
      showAlert("Error al eliminar el usuario. Inténtalo de nuevo.", "danger");
    },
  });
}

function updateUser() {
  const myId = $('#id').val();
  const myUser = {
    name: $('#name').val(),
    email: $('#email').val(),
    age: $('#age').val(),
    comments: $('#comments').val(),
  };

  $.ajax({
    url: `${url}/${myId}`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(myUser),
    success: function (data) {
      console.log("Usuario actualizado:", data);
      showAlert("¡Usuario actualizado exitosamente!", "success");
      clearForm();
      getUsers();
    },
    error: function () {
      showAlert("Error al actualizar el usuario. Inténtalo de nuevo.", "danger");
    },
  });
}

function getUser() {
  const myId = $('#fetchId').val();

  $.ajax({
    url: `${url}/${myId}`,
    type: 'GET',
    success: function (data) {
      console.log("Usuario obtenido:", data);
      const user = data.user;
      $('#id').val(user.id);
      $('#name').val(user.name);
      $('#email').val(user.email);
      $('#age').val(user.age);
      $('#comments').val(user.comments);
      showAlert("Datos del usuario cargados para edición.", "info");
    },
    error: function () {
      showAlert("Error al obtener el usuario. Inténtalo de nuevo.", "danger");
    },
  });
}

function getUsers() {
  $.getJSON(url, function (json) {
    console.log("Usuarios obtenidos:", json);

    const arrUsers = json.users;
    let htmlRows = '';

    if (arrUsers.length === 0) {
      htmlRows = `
        <tr>
          <td colspan="6" class="text-center">No se encontraron usuarios</td>
        </tr>`;
    } else {
      arrUsers.forEach(function (item) {
        htmlRows += `
          <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.age}</td>
            <td>${item.comments || 'Sin comentarios'}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="prepareUpdate(${item.id})">Actualizar</button>
              <button class="btn btn-danger btn-sm" onclick="deleteUser(${item.id})">Eliminar</button>
            </td>
          </tr>`;
      });
    }

    $('#resultado-body').html(htmlRows);
  }).fail(function () {
    $('#resultado-body').html(`
      <tr>
        <td colspan="6" class="text-center text-danger">Error al obtener los usuarios</td>
      </tr>`);
  });
}

function prepareUpdate(userId) {
  console.log("Preparando para actualizar usuario con ID:", userId);

  $.ajax({
    url: `${url}/${userId}`,
    type: 'GET',
    success: function (data) {
      console.log("Usuario obtenido para actualización:", data);

      const user = data.user;

      $('#id').val(user.id);
      $('#name').val(user.name);
      $('#email').val(user.email);
      $('#age').val(user.age);
      $('#comments').val(user.comments);

      $('#userModal').modal('show');

      showAlert("Datos del usuario cargados para edición.", "info");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error al obtener el usuario:", textStatus, errorThrown);
      console.error("Respuesta:", jqXHR.responseText);
      showAlert("Error al obtener el usuario para actualización. Inténtalo de nuevo.", "danger");
    },
  });
}

function showAlert(message, type) {
  const toastHtml = `
    <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
      </div>
    </div>`;
  
  $('#toast-container').append(toastHtml);

  const toastElement = $('#toast-container .toast').last();
  const toast = new bootstrap.Toast(toastElement[0]);
  toast.show();
}

function clearForm() {
  $('#id').val('');
  $('#name').val('');
  $('#email').val('');
  $('#age').val('');
  $('#comments').val('');
  $('#userModal').modal('hide');
}

function saveUser() {
  const userId = $('#id').val();
  if (userId) {
    updateUser();
  } else {
    postUser();
  }
}