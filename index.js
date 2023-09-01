//import { user } from "../index.js";
import { getPosts } from "./api.js";
//import { getUserPosts } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
//import  token  from "./api.js"
import { likePost} from "./components/posts-page-component.js";
import { reRenderPosts} from "./components/posts-page-component.js";
import { loginedUserPosts } from "./components/add-post-page-component.js";
//import {likePost} from "./components/posts-page-component.js"
export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];


const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};
export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};
/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }
    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          console.log(newPosts)
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();
      return loginedUserPosts()
      .then((newPosts) => {
        console.log(newPosts)
        page = USER_POSTS_PAGE;
        posts = [];
        renderApp(newPosts);

      }) .catch((error) => {
        console.error(error);
        goToPage(POSTS_PAGE);
      });
      // TODO: реализовать получение постов юзера из API


      //console.log("Открываю страницу пользователя: ", data.userId);




    }

    page = newPage;
    renderApp();
    return;
  }

  throw new Error("страницы не существует");

};
const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }
  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }
  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        // TODO: реализовать добавление поста в API
        console.log("Добавляю пост...", { description, imageUrl });
        goToPage(POSTS_PAGE);
      },
    });
  }
  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {


    //TODO: реализовать страницу фотографию пользвателя

    loginedUserPosts() 
    .then((data) => {

      console.log(data)
      appEl.innerHTML=data.map((i,index)=>{
        let likesAr =[] = i.likes
        let likesName =[];
        for (let index = 0; index < likesAr.length; index++) 
        {
        likesName.push(` ${likesAr[index].name}`)
        } 
  //render posts page new
  return `<div class="page-container" id ="page-container-id">
  <div class="header-container" ></div>
  <ul class="posts"id ="posts-id">
  <li class="post" id ="post-id">
  <div class="post-header" data-user-id="${i.user.id}">
  <img src="${i.user.imageUrl}" class="post-header__user-image">
  <p class="post-header__user-name">${i.user.name}</p>
  </div>
  <div class="post-image-container">
  <img class="post-image" src="${i.imageUrl}">
  </div>
  <div class="post-likes">
  <button data-post-id="${i.id}" class="like-button">
  <img src="./assets/images/like-active.svg">
  </button>
  <p class="post-likes-text" id ="likes-number-id">
  Нравится: <strong>${i.likes.length}</strong>
  </p>
  </div>
  <p class="post-text">
  <span class="user-name">${likesName}</span>
  ${i.description}
  </p>
  <p class="post-date">
  ${i.createdAt}
  </p>
  </li>
  </ul>
  </div>`})

//навесить лайки
loginedUserPosts().then((data)=>{
  console.log(`likes waiting`)
  let posts=data
  console.log(posts)
  const likePost = document.querySelectorAll('.like-button')
for (const likeEl of likePost) {
  let post = posts.filter((item)=>
  item.id===likeEl.dataset.postId)
  console.log(post)

  likeEl.addEventListener("click", () => {      
    if(post[0].isLiked===true){


      return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${likeEl.dataset.postId}/dislike`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
      }).then((response)=>{
        return response.json()
      }).then((data) => {
        console.log(data)
        return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/`,{
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` }, 
      }).then((response)=>response.json()).then((data)=>{
        console.log(data)
        let likeData =data

      //re render pge posts
      reRenderPosts(likeData)
      return likeData
    }).catch((err)=>{alert(`${err.message}`)})

    }).catch((err)=>{alert(`${err.message}`)})
    }

    return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/${likeEl.dataset.postId}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },

    }).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
      return fetch(`https://wedev-api.sky.pro/api/v1/egor_torg/instapro/user-posts/`,{
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` }, 
      }).then((response)=>response.json()).then((data)=>{console.log(data)
        let likeData =data

      //rerender pge posts
      reRenderPosts(likeData)
      return likeData
      }).catch((err)=>{alert(`${err.message}`)})


    }).catch((err)=>{alert(`${err.message}`)})

  })}

})
//console.log(postsToIndex)//импортировать в файл массив или добыть массив самому

    })

  
  // return renderPostsPageComponent({
  //   appEl,
  // });
  
  
  
  
  
  
  //"Здесь будет страница фотографий пользователя";
}
};
goToPage(POSTS_PAGE);