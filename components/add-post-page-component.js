import { user } from "../index.js";
import { goToPage, logout} from "../index.js";
import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { userPageOpen} from "./posts-page-component.js";
let userPostsId;

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <p class="post-text">Добавление нового поста</p>
      <div class="form-inputs">
        <div class="upload-image-container"></div>
        <div class ="post-image-load">
        <div class = "image-comment-block">
        <div  id="imagePost-input">
        <img class="file-upload-image-big  view"  src="img/photo-612x612.jpg" alt ="превью"/></div>
        <input type="text" id="textPost-input" class="input-post-comment" placeholder="Введите комментарий к фото" />
        <label class="file-upload-label secondary-button" id="label-add-photo">
        <input id="add-photo-button" type="file" class="file-upload-input" style="display:none"/>
        Выберите фото 
        </label>
        <div class="hide" id="post-button">
        <button class="button-photo" id="post-button" >Загрузить фото</button>
        </div>                
        <button   class="button-photo" id="back-button">Назад</button>
          </div>                  
        </div>
        <div class="form-error"></div>
        </div>
        </div>`;
    appEl.innerHTML = appHtml;
    addPostFunc()
  };
  render();
  const postButtonBack = document.getElementById(`back-button`)
  postButtonBack.addEventListener(`click`, () => {
    loginedUserPosts()
    goToPage(POSTS_PAGE)

    console.log(userPostsId)
  })
}


function addPostFunc() {
  const postButtonLabel = document.getElementById(`label-add-photo`)
  const postPhotoInput = document.getElementById(`add-photo-button`);
  const postTextInput = document.getElementById(`textPost-input`);
  const postButtonAdd = document.getElementById(`post-button`)

  postPhotoInput.addEventListener(`change`, () => {
    postButtonLabel.classList.add("hide")
    postButtonAdd.classList.remove("hide")
    console.log(postButtonAdd)

    const token = user.token
    console.log(user)
    console.log(token)

    //получение файла изображения

    let img = postPhotoInput.files[0]
    console.log(img)


    function getRef() {
      const data = new FormData()
      data.append('file', img)
      return fetch("https://wedev-api.sky.pro/api/upload/image", {
        method: "POST",
        body: data,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(`${data.fileUrl}`)
          const imgRef = data.fileUrl

          const postImageInput = document.getElementById(`imagePost-input`);
          console.log(postImageInput)
          postImageInput.classList.add("view")
          console.log(postImageInput.innerHTML)
          return postImageInput.innerHTML = `<img class="file-upload-image-big view" id="imagePost-input" src="${imgRef}" alt ="превью файла"/>`
        })
    } getRef()

    //отправка в облако 

    postButtonAdd.addEventListener(`click`, () => {

      function loaderButton() {
        const postLoadButton = document.getElementById(`post-button`);
        console.log(postLoadButton.innerHTML)
        postLoadButton.disabled
        return postLoadButton.innerHTML = `<button disabled class="button-photo " id="post-button" >загружаем...</button>`
      }
      loaderButton()



      const data = new FormData()
      data.append('file', img)
      return fetch("https://wedev-api.sky.pro/api/upload/image", {
        method: "POST",
        body: data,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {


          //отправка файла из облака в приложение
          return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              description: postTextInput.value.replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;"),
              imageUrl: data.fileUrl,
            }),
          }).then((response) => {
            if (response.status === 400)
              throw new Error(`Добавьте описание...`);


            return response.json()
          }).then((data) => {
            if (data.result === 'ok') {
              console.log(data)
              const postLoadButton = document.getElementById(`post-button`);
              console.log(postLoadButton.innerHTML)
              loginedUserPosts()
              goToPage(USER_POSTS_PAGE)
              return postLoadButton.innerHTML = `<button disabled class="button-photo" id="post-button">готово</button>`
            }


            return data
          }).catch((error) => {
            function loaderButton() {
              const postLoadButton = document.getElementById(`post-button`);
              console.log(postLoadButton.innerHTML)
              postLoadButton.disabled
              return postLoadButton.innerHTML = `<button  class="button-photo " id="post-button" >загрузить</button>`
            }
            loaderButton()
            alert(`111${error}`);
          });

        }).catch((err) => { console.log(`${err}`) })
    })
  })

}

export function loginedUserPosts() {
  console.log(user)

  userPostsId = user._id
  return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${userPostsId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${user.token}` },
  }).then((response) => { return response.json() }).then((data) => {

    console.log(data)
    return data.posts;
  })


}